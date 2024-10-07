import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3Upload';

export async function POST(request: Request) {
  const { videoUrl } = await request.json();
  console.log('Received video URL for S3 upload:', videoUrl);

  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    const file = new File([blob], 'video.mp4', { type: 'video/mp4' });

    const s3Url = await uploadToS3(file, 'video');
    console.log('Video uploaded to S3:', s3Url);

    return NextResponse.json({ s3Url });
  } catch (error) {
    console.error('Error saving video to S3:', error);
    return NextResponse.json({ error: 'Failed to save video to S3' }, { status: 500 });
  }
}