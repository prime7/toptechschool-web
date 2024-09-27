import { prisma } from "@/lib/prisma";
import S3Service from "./s3";

class UploadService {
  private s3Service: S3Service;

  constructor() {
    this.s3Service = new S3Service();
  }

  private generateResumeKey(userId: string, resumeId: string): string {
    return `resumes/${userId}/${resumeId}/${crypto
      .randomUUID()
      .slice(0, 6)}.pdf`;
  }

  async uploadResume(userId: string, filename: string, fileType: string) {
    try {
      const resume = await prisma.resume.create({
        data: { userId, filename, url: "" },
      });

      const key = this.generateResumeKey(userId, resume.id);
      const signedUrl = await this.s3Service.getSignedUrlForUpload(
        key,
        fileType
      );
      const encodedKey = encodeURIComponent(key);

      await prisma.resume.update({
        where: { id: resume.id },
        data: { url: `${process.env.CLOUDFLARE_R2_ENDPOINT}/${encodedKey}` },
      });

      return { signedUrl, resumeId: resume.id };
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw error;
    }
  }
}

export default UploadService;
