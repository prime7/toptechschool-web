import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_CLOUDFLARE_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

 async function getSignedUrlForUpload(
  key: string,
  fileType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });
  return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
}

const getPresignedUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: decodeURIComponent(key),
  });
  return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
};

export { r2Client, getPresignedUrl, getSignedUrlForUpload };
