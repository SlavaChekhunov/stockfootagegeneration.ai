import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const section1 = formData.get('section1') as string;
  const section2 = formData.get('section2') as string;
  const aspectRatio = formData.get('aspect_ratio') as string;

  try {
    // Step 1: Generate initial video using section1 prompt
    const initialVideoTaskId = await generateVideo(section1, aspectRatio);

    // Step 2: Check status of initial video
    await checkVideoStatus(initialVideoTaskId);

    // Step 3: Extend the video using section2 prompt
    const extendedVideoTaskId = await extendVideo(initialVideoTaskId, section2);

    // Step 4: Check status of extended video and get final URL
    const extendedVideoUrl = await checkVideoStatus(extendedVideoTaskId);

    return NextResponse.json({ videoUrl: extendedVideoUrl });
  } catch (error) {
    console.error('Error in text-to-film process:', error);
    return NextResponse.json({ error: 'Failed to generate extended video' }, { status: 500 });
  }
}

async function generateVideo(prompt: string, aspectRatio: string): Promise<string> {
  const url = 'https://api.piapi.ai/api/kling/v1/video';
  const options = {
    method: 'POST',
    headers: {
      'X-API-key': process.env.KLING_API_KEY || '',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      prompt,
      aspect_ratio: aspectRatio,
      professional_mode: true,
      duration: 5,
    }),
  };

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok || !data.data || !data.data.task_id) {
    throw new Error('Failed to generate initial video');
  }

  return data.data.task_id;
}

async function checkVideoStatus(taskId: string): Promise<string> {
  const url = `https://api.piapi.ai/api/kling/v1/video/${taskId}`;
  const options = {
    method: 'GET',
    headers: {
      'X-API-Key': process.env.KLING_API_KEY || '',
      Accept: 'application/json',
    },
  };

  while (true) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.data.status === 'completed') {
      return data.data.works[0].resource.resource;
    } else if (data.data.status === 'failed') {
      throw new Error('Video generation failed');
    }

    // Wait for 5 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

async function extendVideo(taskId: string, prompt: string): Promise<string> {
  const url = `https://api.piapi.ai/api/kling/v1/video/${taskId}/extend`;
  const options = {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.KLING_API_KEY || '',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ prompt }),
  };

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok || !data.data || !data.data.task_id) {
    throw new Error('Failed to extend video');
  }

  return data.data.task_id;
}