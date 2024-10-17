// src/app/api/check-video-status/route.ts
import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from '@/db';

export async function GET(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('id');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    const video = await db.video.findUnique({
      where: { id: videoId, userId: user.id }
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: video.status,
      url: video.url
    });
  } catch (error) {
    console.error('Error checking video status:', error);
    return NextResponse.json({ error: 'Failed to check video status' }, { status: 500 });
  }
}