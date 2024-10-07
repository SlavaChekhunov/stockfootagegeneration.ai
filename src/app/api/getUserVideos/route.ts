import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from '@/db';

export async function GET(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const filter = req.nextUrl.searchParams.get('filter') || 'All Videos';
  

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let videos;
    if (filter === 'All Videos') {
      videos = await db.video.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      const sourceType = filter === 'Image to video' ? 'IMAGE' : 'TEXT';
      videos = await db.video.findMany({
        where: { 
          userId: user.id,
          sourceType: sourceType
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Error fetching videos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, prompt, aspectRatio, url, status, sourceType, sourceImageUrl } = await req.json();
    console.log('Parsed request body:', { name, prompt, aspectRatio, url, status, sourceType, sourceImageUrl });
    console.log('Attempting to create video with data:', {
      name,
      prompt,
      aspectRatio,
      url,
      status,
      userId: user.id,
      sourceType,
      sourceImageUrl,
    });
    const video = await db.video.create({
      data: {
        name,
        prompt,
        aspectRatio,
        url,
        status,
        userId: user.id,
        sourceType,
        sourceImageUrl,
        // endFrameImageId,
      },
    });
    console.log('Video saved to database:', video);
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json({ error: 'Error creating video' }, { status: 500 });
  }
}
