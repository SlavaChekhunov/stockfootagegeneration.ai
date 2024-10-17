import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from '@/db';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const latestVideo = await db.video.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { status: true, url: true },
    });

    if (latestVideo) {
      return NextResponse.json({ status: latestVideo.status, url: latestVideo.url });
    } else {
      return NextResponse.json({ error: 'No videos found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching latest video status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}