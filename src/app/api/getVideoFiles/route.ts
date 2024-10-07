// app/api/getVideoFiles/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function GET() {
  const videoDirectory = path.join(__dirname, '..', '..', '..', '..', 'public', 'assets', 'videos');
  
  try {
    const fileNames = await fs.readdir(videoDirectory);
    const videoFiles = fileNames.filter(file => 
      /\.(mp4|webm|ogg)$/i.test(file)
    );

    const videos = videoFiles.map(file => ({
      src: `/assets/videos/${file}`,
      name: file.replace(/\.[^/.]+$/, ""),
      span: 'col-span-1 row-span-1'
    }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error reading video directory:', error);
    return NextResponse.json({ error: 'Unable to read video files' }, { status: 500 });
  }
}