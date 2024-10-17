import { NextApiRequest, NextApiResponse } from 'next';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from '@/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const latestVideo = await db.video.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { status: true, url: true },
    });

    if (latestVideo) {
      res.status(200).json({ status: latestVideo.status, url: latestVideo.url });
    } else {
      res.status(404).json({ error: 'No videos found' });
    }
  } catch (error) {
    console.error('Error fetching latest video status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}