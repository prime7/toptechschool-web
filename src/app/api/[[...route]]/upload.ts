import { Hono } from "hono";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import s3Client from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const uploadApp = new Hono();

uploadApp.post("/", async (c) => {
  try {
    const { filename, fileType } = await c.req.json();
    const session = await auth();

    if (!session?.user?.id) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        filename,
        url: "",
      },
    });

    const key = `resumes/${session.user.id}/${resume.id}/${crypto
      .randomUUID()
      .slice(0, 6)}.pdf`;
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    const encodedKey = encodeURIComponent(key);
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        url: `${process.env.CLOUDFLARE_R2_ENDPOINT}/${encodedKey}`,
      },
    });
    return c.json({ signedUrl, resumeId: resume.id });
  } catch (error) {
    console.error("Error processing upload request:", error);
    return c.json({ error: "Error processing upload request" }, 500);
  }
});

export default uploadApp;
