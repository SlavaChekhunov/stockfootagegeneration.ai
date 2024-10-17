import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from '@/db';
import { uploadToS3 } from '@/lib/s3Upload';


export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const aspectRatio = formData.get('aspect_ratio') as string;
    const activeTab = formData.get('activeTab') as 'image-to-video' | 'text-to-video';
    const image = formData.get('imageUrl') as File | string;
    const negativePrompt = formData.get('negative_prompt') as string || '';
    const useEndFrame = formData.get('useEndFrame') === 'true';
    const isSoundOn = formData.get('isSoundOn') === 'true';
    const songDescription = formData.get('songDescription') as string;

   // Handle image upload to S3 if it's a File
   let imageUrl: string | undefined;
   if (image instanceof File) {
     console.log('Uploading image to S3');
     imageUrl = await uploadToS3(image, 'image');
     console.log('Image uploaded, URL:', imageUrl);
   } else if (typeof image === 'string') {
     imageUrl = image;
     console.log('Using provided image URL:', imageUrl);
   }

   console.log('Creating video record in database');
   const video = await db.video.create({
     data: {
       userId: user.id,
       name: `Video ${new Date().toISOString()}`,
       prompt: prompt || '',
       aspectRatio: aspectRatio || '16:9',
       sourceType: activeTab === 'image-to-video' ? 'IMAGE' : 'TEXT',
       sourceImageUrl: imageUrl || null,
       status: 'PENDING',
     },
   });
   console.log('Video record created:', video);

   console.log('Starting generateVideo function');
   generateVideo(video.id, {
     prompt,
     aspectRatio,
     activeTab,
     imageUrl,
     negativePrompt,
     useEndFrame,
     isSoundOn,
     songDescription
   });

   console.log('Returning videoId:', video.id);
    return NextResponse.json({ videoId: video.id });
  } catch (error) {
    console.error('Error in start-video-generation:', error);
    return NextResponse.json({ error: 'Failed to start video generation' }, { status: 500 });
  }
}

async function generateVideo(videoId: string, params: {
  prompt: string;
  aspectRatio: string;
  activeTab: 'image-to-video' | 'text-to-video';
  imageUrl?: string;
  negativePrompt?: string;
  useEndFrame: boolean;
  isSoundOn: boolean;
  songDescription?: string;
}) {
  console.log('generateVideo function started with params:', params);
  try {
    console.log('Calling Kling API');
    const klingResponse = await fetch('https://api.piapi.ai/api/kling/v1/video', {
      method: 'POST',
      headers: {
        'X-API-key': process.env.KLING_API_KEY || '',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        aspect_ratio: params.aspectRatio,
        negative_prompt: params.negativePrompt,
        professional_mode: false,
        creativity: 0.5,
        duration: 5,
        image_url: params.imageUrl || '',
        version: '1.0',
        webhook_config: {
          endpoint: '',
          secret: ''
        }
      }),
    });

    console.log('Kling API response status:', klingResponse.status);
    if (!klingResponse.ok) {
      const errorData = await klingResponse.json();
      console.error('Kling API error:', errorData);
      throw new Error(`Kling API failed: ${JSON.stringify(errorData)}`);
    }

    const klingData = await klingResponse.json();
    console.log('Kling API response data:', klingData);
    const klingTaskId = klingData.data.task_id;

    // Implement Suno API call if sound is on
    let sunoTaskId: string | null = null;
    if (params.isSoundOn) {
      const sunoResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/generate-suno-music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.songDescription || params.prompt,
        }),
      });
    
      if (!sunoResponse.ok) {
        const errorData = await sunoResponse.json();
        console.error('Suno API error:', errorData);
        throw new Error(`Suno API failed: ${JSON.stringify(errorData)}`);
      }
    
      const sunoData = await sunoResponse.json();
      sunoTaskId = sunoData.data.task_id;
    }

    // Poll for completion
    const result = await pollForCompletion(klingTaskId, sunoTaskId);

    // Combine video and audio if both are present
    let finalVideoUrl = result.videoUrl;
    if (result.videoUrl && result.musicUrl) {
      const combineResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/combine-video-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: result.videoUrl, audioUrl: result.musicUrl }),
      });

      if (!combineResponse.ok) {
        throw new Error('Failed to combine video and audio');
      }

      const combineData = await combineResponse.json();
      finalVideoUrl = combineData.fullVideoUrl;
    }

    // Save to S3
    const s3Response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/save-video-to-s3`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl: finalVideoUrl }),
    });

    if (!s3Response.ok) {
      throw new Error('Failed to save video to S3');
    }

    const { s3Url } = await s3Response.json();

    // Update video record
    await db.video.update({
      where: { id: videoId },
      data: { 
        status: 'SUCCESS',
        url: s3Url,
      }
    });
  } catch (error) {
    console.error('Error generating video:', error);
    await db.video.update({
      where: { id: videoId },
      data: { status: 'FAILED' }
    });
  }
}

interface CompletionResult {
  videoUrl: string;
  musicUrl: string | null;
}

async function pollForCompletion(klingTaskId: string, sunoTaskId: string | null): Promise<CompletionResult> {
  let videoCompleted = false;
  let musicCompleted = !sunoTaskId;
  let videoUrl: string | null = null;
  let musicUrl: string | null = null;

  while (!videoCompleted || !musicCompleted) {
    if (!videoCompleted) {
      const videoResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/check-kling-status?taskId=${klingTaskId}`);
      const videoData = await videoResponse.json();

      if (videoData.status === 'completed') {
        videoCompleted = true;
        videoUrl = videoData.videoUrl;
      } else if (videoData.status === 'failed') {
        throw new Error('Video generation failed');
      }
    }

    if (!musicCompleted && sunoTaskId) {
      const musicResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/check-suno-status?taskId=${sunoTaskId}`);
      const musicData = await musicResponse.json();
    
      if (musicData.status === 'completed') {
        musicCompleted = true;
        musicUrl = musicData.musicUrl;
      } else if (musicData.status === 'failed') {
        throw new Error('Music generation failed');
      }
    }

    if (!videoCompleted || !musicCompleted) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
    }
  }

  return { videoUrl: videoUrl!, musicUrl };
}