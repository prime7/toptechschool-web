import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function JobPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const resumes = await prisma.resume.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div>
      <h1>Job Page</h1>
      <p>Resumes: {resumes.length}</p>
    </div>
  );
}
