import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "./awsConfig";

export async function uploadToS3(file: File, type: 'image' | 'video'): Promise<string> {
  const folder = type === 'image' ? 'images' : 'videos';
  const key = `uploads/${folder}/${Date.now()}-${file.name}`;
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: file,
      ContentType: file.type,
    }
  });

  await upload.done();

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}