import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  const { videoUrl, audioUrl } = await request.json();
  console.log(videoUrl, audioUrl)

  console.log("AWS_API_GATEWAY_URL", process.env.AWS_API_GATEWAY_URL)
  console.log("AWS_API_KEY", process.env.AWS_API_KEY)

  try {
    console.log('Sending request to AWS API Gateway:', process.env.AWS_API_GATEWAY_URL);
    const response = await fetch(process.env.AWS_API_GATEWAY_URL!, {
      method: 'POST',
      body: JSON.stringify({
        videoUrl,
        audioUrl
      }),
      headers: { 
        'Content-Type': 'application/json', 
      }
    });

    console.log('AWS API Gateway response status:', response.status);
    const responseText = await response.text();
    console.log('AWS API Gateway response body:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to process video: ${response.status} ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log("result", result)
    const fullVideoUrl = `https://awsreplicatebucket.s3.us-east-2.amazonaws.com/${result.outputKey}`;
    console.log("fullvideourl",fullVideoUrl)
    return NextResponse.json({ ...result, fullVideoUrl });
  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json({ error: 'Failed to process video: ' + (error as Error).message }, { status: 500 });
  }
}




























































// import { NextResponse } from 'next/server';
// import ffmpeg from 'fluent-ffmpeg';
// import { uploadToS3 } from '@/lib/s3Upload';
// import fs from 'fs';
// import path from 'path';
// import { promisify } from 'util';

// const unlink = promisify(fs.unlink);

// // Set the path to your FFmpeg executable
// const ffmpegPath = path.join(process.cwd(), 'ffmpeg', 'ffmpeg.exe');
// ffmpeg.setFfmpegPath(ffmpegPath);

// export async function POST(request: Request) {
//   const { videoUrl, audioUrl } = await request.json();
//   console.log('Received request:', { videoUrl, audioUrl });

//   if (!videoUrl || !audioUrl) {
//     return NextResponse.json({ error: 'Video URL and Audio URL are required' }, { status: 400 });
//   }

//   try {
//     // Use the 'tmp' directory at the project root
//     const tempDir = path.join(process.cwd(), 'tmp');
    
//     // Ensure the tmp directory exists
//     await fs.promises.mkdir(tempDir, { recursive: true });

//     const outputPath = path.join(tempDir, `combined_${Date.now()}.mp4`);

//     await new Promise<void>((resolve, reject) => {
//       ffmpeg()
//         .input(videoUrl)
//         .input(audioUrl)
//         .outputOptions('-c:v copy')
//         .outputOptions('-c:a aac')
//         .outputOptions('-map 0:v:0')
//         .outputOptions('-map 1:a:0')
//         .outputOptions('-shortest') // This will trim the audio to match the video length
//         .output(outputPath)
//         .on('end', () => resolve())
//         .on('error', (err: Error) => {
//           console.error('FFmpeg error:', err);
//           reject(new Error(`FFmpeg error: ${err.message}`));
//         })
//         .run();
//     });
//     console.log('FFmpeg operation completed');

//     // Read the file into a buffer
//     const fileBuffer = await fs.promises.readFile(outputPath);
//     console.log('File read successfully');
    
//     // Create a File object from the buffer
//     const file = new File([fileBuffer], 'combined_video.mp4', { type: 'video/mp4' });

//     // Upload to S3
//     const s3Url = await uploadToS3(file, 'video');
//     console.log('S3 upload successful:', s3Url);

//     // Delete the temporary file
//     await unlink(outputPath);

//     return NextResponse.json({ message: 'Video and audio combined and uploaded successfully', videoUrl: s3Url });
//   } catch (error) {
//     console.error('Error combining video and audio:', error);
//     return NextResponse.json({ error: `Failed to combine video and audio: ${(error as Error).message}` }, { status: 500 });
//   }
// }