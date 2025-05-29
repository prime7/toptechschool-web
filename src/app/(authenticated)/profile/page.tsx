import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import { prisma } from "@/lib/prisma";
import { User, Work, Education, Project } from "@prisma/client";
import { revalidatePath } from "next/cache";
import ProfileEducation from "./ProfileEducation";
import ProfileWork from "./ProfileWork";
import ProfileProject from "./ProfileProject";

export default async function Profile() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      work: {
        orderBy: {
          startDate: "desc",
        },
      },
      education: {
        orderBy: {
          startDate: "desc",
        },
      },
      projects: {
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  async function updateUser(
    updatedData: Partial<
      User & {
        work?: Omit<Work, "id">[];
        education?: Omit<Education, "id">[];
        projects?: Omit<Project, "id">[];
      }
    >
  ): Promise<User> {
    "use server";

    const { work, education, projects, ...userData } = updatedData;

    const updatedUser = await prisma.user.update({
      where: { id: user?.id },
      data: {
        ...userData,
        ...(work && {
          work: {
            deleteMany: {
              userId: user?.id,
            },
            create: work.map((job) => ({
              company: job.company,
              position: job.position,
              location: job.location,
              points: job.points,
              description: job.description,
              startDate: new Date(job.startDate),
              endDate: job.endDate ? new Date(job.endDate) : null,
              displayOrder: job.displayOrder,
            })),
          },
        }),
        ...(projects && {
          projects: {
            deleteMany: {
              userId: user?.id,
            },
            create: projects.map((project) => ({
              name: project.name,
              description: project.description,
              points: project.points,
              url: project.url,
              displayOrder: project.displayOrder,
            })),
          },
        }),
        ...(education && {
          education: {
            deleteMany: {
              userId: user?.id,
            },
            create: education.map((edu) => ({
              institution: edu.institution,
              degree: edu.degree,
              startDate: new Date(edu.startDate),
              endDate: edu.endDate ? new Date(edu.endDate) : null,
              points: edu.points,
              displayOrder: edu.displayOrder,
            })),
          },
        }),
      },
      include: {
        work: true,
        education: true,
        projects: true,
      },
    });

    revalidatePath("/profile");
    return updatedUser;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6">
              <ProfileHeader user={user} onSave={updateUser} />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <ProfileWork user={user} onSave={updateUser} />
            <ProfileEducation user={user} onSave={updateUser} />
            <ProfileProject user={user} onSave={updateUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
