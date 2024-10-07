import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get('taskId');
  const apiKey = process.env.MINIMAX_API_KEY;

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.minimax.chat/v1/query/video_generation?task_id=${taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { status, file_id } = data;

    if (status === 'Success' && file_id) {
      const fileResponse = await fetch(`https://api.minimax.chat/v1/files/retrieve?file_id=${file_id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!fileResponse.ok) {
        throw new Error(`HTTP error! status: ${fileResponse.status}`);
      }

      const fileData = await fileResponse.json();
      const videoUrl = fileData.file.download_url;
      return NextResponse.json({ status, videoUrl });
    } else {
      return NextResponse.json({ status });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}