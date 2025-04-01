import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BaseService } from "./Base.service";
import { R2_CONFIG } from "@/lib/constants";

export class R2Service extends BaseService {
  private static readonly r2Client = new S3Client({
    region: R2_CONFIG.REGION,
    endpoint: process.env.R2_CLOUDFLARE_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  static async getSignedUrlForUpload(key: string, fileType: string): Promise<string> {
    return this.handleError(
      async () => {
        const command = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          ContentType: fileType,
        });
        return await getSignedUrl(this.r2Client, command, { expiresIn: R2_CONFIG.DEFAULT_EXPIRY });
      },
      "Failed to generate upload URL"
    );
  }

  static async getPresignedUrl(key: string): Promise<string> {
    return this.handleError(
      async () => {
        const command = new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: decodeURIComponent(key),
        });
        return await getSignedUrl(this.r2Client, command, { expiresIn: R2_CONFIG.DEFAULT_EXPIRY });
      },
      "Failed to generate download URL"
    );
  }
} 