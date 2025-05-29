import { auth } from "@/lib/auth";
import { ResumeEditor } from "@/components/resume-editor";
import { ResumeData } from "@/components/resume-editor/types";
import { defaultStyle } from "@/components/resume-editor/constants";
import { prisma } from "@/lib/prisma";

async function getUserResumeData(userId: string | undefined): Promise<ResumeData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      work: {
        orderBy: { displayOrder: 'asc' }
      },
      education: {
        orderBy: { displayOrder: 'asc' }
      },
      projects: {
        orderBy: { displayOrder: 'asc' }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    personal: {
      fullName: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      profession: user.profession || "",
      website: user.website || "",
      linkedin: user.linkedin || "",
      github: user.github || "",
    },
    summary: user.summary || "",
    summaryHighlights: user.highlights || [],
    work: user.work.map(w => ({
      id: w.id,
      company: w.company,
      position: w.position,
      location: w.location,
      startDate: w.startDate.toISOString().slice(0, 7),
      endDate: w.endDate?.toISOString().slice(0, 7),
      description: w.description || "",
      points: w.points,
      displayOrder: w.displayOrder,
    })),
    education: user.education.map(e => ({
      id: e.id,
      institution: e.institution,
      degree: e.degree,
      startDate: e.startDate.toISOString().slice(0, 7),
      endDate: e.endDate?.toISOString().slice(0, 7),
      description: e.description || "",
      points: e.points,
      displayOrder: e.displayOrder,
    })),
    projects: user.projects.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      points: p.points,
      url: p.url || "",
      displayOrder: p.displayOrder,
    })),
    activeSections: ["personal", "summary", "work", "education", "projects"],
    style: defaultStyle,
  };
}

export default async function ResumeEditorPage() {
  const session = await auth();
  const userData = await getUserResumeData(session?.user?.id);

  return (
    <ResumeEditor data={userData} />
  );
}
