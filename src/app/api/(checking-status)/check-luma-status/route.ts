import { NextResponse } from 'next/server';
import LumaAI from 'lumaai';

const client = new LumaAI({
  authToken: process.env.LUMAAI_API_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const generation: LumaAI.Generation = await client.generations.get(taskId);

    console.log('Luma AI Generation:', JSON.stringify(generation, null, 2));

    // Handle different generation states
    if (generation.state === 'completed') {
      return NextResponse.json({
        status: 'completed',
      });
    } else if (generation.state === 'failed') {
      return NextResponse.json({
        status: 'failed',
        error: generation.failure_reason || 'Unknown error'
      }, { status: 400 });
    } else {
      return NextResponse.json({
        status: generation.state,
        message: 'Video generation in progress'
      });
    }

  } catch (error) {
    if (error instanceof LumaAI.APIError) {
      console.error('Luma AI API Error:', error.status, error.name, error.message);
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error checking Luma AI video status:', error);
    return NextResponse.json({ error: 'Failed to check video status' }, { status: 500 });
  }
}