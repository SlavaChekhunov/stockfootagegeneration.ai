import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  const url = `https://api.piapi.ai/api/v1/task/${taskId}`;
  const options = {
    method: 'GET',
    headers: {
      'x-api-key': process.env.KLING_API_KEY || '',
      'Accept': 'application/json',
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    console.log('Kling API response:', data);

    if (!response.ok) {
      console.error('Kling API error:', data);
      return NextResponse.json({ error: data.message || 'Failed to check video status' }, { status: response.status });
    }

    if (data.data.status === 'completed') {
      const videoUrl = data.data.output.works[0].video.resource_without_watermark;
      return NextResponse.json({ status: 'completed', videoUrl });
    } else if (data.data.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        error: data.data.error.message || 'Video generation failed'
      });
    } else {
      return NextResponse.json({ status: data.data.status });
    }
  } catch (error) {
    console.error('Error checking video status:', error);
    return NextResponse.json({ error: 'Failed to check video status' }, { status: 500 });
  }
}