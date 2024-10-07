import { NextResponse } from 'next/server';
import LumaAI from 'lumaai';

const client = new LumaAI({
  authToken: process.env.LUMAAI_API_KEY,
});

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const params: LumaAI.GenerationCreateParams = {
      aspect_ratio: '16:9',
      prompt: prompt,
    };
    const generation: LumaAI.Generation = await client.generations.create(params);

    return NextResponse.json({ taskId: generation.id });
  } catch (error) {
    if (error instanceof LumaAI.APIError) {
      console.error('Luma AI API Error:', error.status, error.name, error.message);
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error generating video with Luma AI:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}