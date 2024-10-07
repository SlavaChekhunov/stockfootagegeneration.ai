import { NextResponse } from 'next/server';
import { s3Client } from '@/lib/awsConfig';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `uploads/images/${id}`,
    });

    const { Body, ContentType } = await s3Client.send(command);

    if (!(Body instanceof Readable)) {
      throw new Error('Failed to fetch image from S3');
    }

    const chunks = [];
    for await (const chunk of Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Set the appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', ContentType || 'application/octet-stream');
    headers.set('Content-Disposition', `inline; filename="${id}"`);

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
