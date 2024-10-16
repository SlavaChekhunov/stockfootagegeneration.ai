import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const prompt = formData.get('prompt') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const negativePrompt = formData.get('negative_prompt') as string || '';
  const aspectRatio = formData.get('aspect_ratio') as string;

  try {
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
        negative_prompt: negativePrompt,
        professional_mode: true,
        creativity: 0.5,
        duration: 5,
        image_url: imageUrl || '',
        version: '1.5',
        webhook_config: {
          endpoint: '',
          secret: ''
        }
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      console.error('Kling API error:', data);
      return NextResponse.json({ error: data.message || 'Failed to generate video' }, { status: response.status });
    }

    if (!data.data || !data.data.task_id) {
      console.error('Unexpected Kling API response:', data);
      return NextResponse.json({ error: 'Unexpected API response' }, { status: 500 });
    }

    return NextResponse.json({ taskId: data.data.task_id });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}