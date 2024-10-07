// app/api/check-suno-status/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  const url = `https://api.piapi.ai/api/suno/v1/music/${taskId}`;
  const options = {
    method: 'GET',
    headers: {
      'X-API-Key': process.env.SUNO_API_KEY as string,
      Accept: 'application/json'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.code !== 200) {
      throw new Error(`Suno API error: ${data.message}`);
    }

    const status = data.data.status;
    let musicUrl = null;

    if (status === 'completed') {
      // Get the first clip's audio URL
      const clipId = Object.keys(data.data.clips)[0];
      musicUrl = data.data.clips[clipId].audio_url;
    }

    return NextResponse.json({
      status,
      musicUrl,
      taskId: data.data.task_id,
      message: data.message
    });
  } catch (error) {
    console.error('Error checking Suno status:', error);
    return NextResponse.json({ error: 'Failed to check Suno status' }, { status: 500 });
  }
}