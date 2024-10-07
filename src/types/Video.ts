export interface Video {
    id: string;
    name: string;
    prompt: string;
    aspectRatio: string;
    url: string;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    sourceType: 'IMAGE' | 'TEXT';
    sourceImageUrl?: string;
    // endFrameImageId?: string;
    createdAt: Date;
  }