import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.MINIMAX_API_KEY;

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.minimax.chat/v1/video_generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'video-01',
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || response.statusText;
      return NextResponse.json(
        { error: `API request failed: ${errorMessage}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    if (!data.task_id) {
      return NextResponse.json({ error: 'No task ID received from API' }, { status: 500 });
    }

    return NextResponse.json({ taskId: data.task_id });

  } catch (error) {
    console.error('Error in video generation API route:', error);
    return NextResponse.json(
      { error: `Internal server error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}