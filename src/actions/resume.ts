import { auth } from "@/lib/auth";
import { ResumeService } from "@/service/Resume.service";

export type ResumeWithJobRole = {
  id: string;
  filename: string;
  createdAt: Date;
  profession: string | null;
};

export async function getUserResumes(): Promise<ResumeWithJobRole[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return await ResumeService.getUserResumes(session.user.id);
}
