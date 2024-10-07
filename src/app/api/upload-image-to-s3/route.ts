import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3Upload';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const imageUrl = await uploadToS3(image, 'image');

    if (typeof imageUrl !== 'string') {
      throw new Error('Failed to get image URL from S3');
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
