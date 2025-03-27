import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import { prisma } from "@/lib/prisma";
import { User, SocialLink, WorkExperience, Education, Skill } from "@prisma/client";
import { revalidatePath } from "next/cache";
import ProfileAbout from "./ProfileAbout";
import ProfileSocialLinks from "./ProfileSocialLinks";
import ProfileWorkExperience from "./ProfileWorkExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileSkills from "./ProfileSkills";
import { Separator } from "@/components/ui/separator";

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
      socialLinks: true,
      workExperience: {
        orderBy: {
          startDate: 'desc'
        }
      },
      education: {
        orderBy: {
          startDate: 'desc'
        }
      },
      skills: {
        orderBy: {
          name: 'asc'
        }
      },
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  async function updateUser(updatedData: Partial<User & { 
    socialLinks?: SocialLink[], 
    workExperience?: Omit<WorkExperience, "id">[],
    education?: Omit<Education, "id">[],
    skills?: Omit<Skill, "id">[]
  }>): Promise<User> {
    'use server'

    const { socialLinks, workExperience, education, skills, ...userData } = updatedData;

    const updatedUser = await prisma.user.update({
      where: { id: user?.id },
      data: {
        ...userData,
        ...(socialLinks && {
          socialLinks: {
            deleteMany: {
              userId: user?.id
            },
            create: socialLinks.map(link => ({
              platform: link.platform,
              url: link.url,
              displayOrder: link.displayOrder,
            })),
          },
        }),
        ...(workExperience && {
          workExperience: {
            deleteMany: {
              userId: user?.id
            },
            create: workExperience.map(job => ({
              company: job.company,
              position: job.position,
              location: job.location,
              employmentType: job.employmentType,
              startDate: new Date(job.startDate),
              endDate: job.endDate ? new Date(job.endDate) : null,
              description: job.description,
              displayOrder: job.displayOrder,
            })),
          },
        }),
        ...(education && {
          education: {
            deleteMany: {
              userId: user?.id
            },
            create: education.map(edu => ({
              institution: edu.institution,
              degree: edu.degree,
              startDate: new Date(edu.startDate),
              endDate: edu.endDate ? new Date(edu.endDate) : null,
              description: edu.description,
              displayOrder: edu.displayOrder,
            })),
          },
        }),
        ...(skills && {
          skills: {
            deleteMany: {
              userId: user?.id
            },
            create: skills.map(skill => ({
              name: skill.name,
            })),
          },
        }),
      },
      include: {
        workExperience: true,
        socialLinks: true,
        education: true,
        skills: true,
      },
    });

    revalidatePath('/profile');
    return updatedUser;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 max-w-6xl">
        <div className="grid gap-6 sm:gap-8 md:gap-10">
          <div>
            <ProfileHeader user={user} onSave={updateUser} />
          </div>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-6 sm:space-y-8">
              <div className="grid gap-6 sm:gap-8">
                <ProfileAbout user={user} onSave={updateUser} />
                <ProfileSocialLinks user={user} onSave={updateUser} />
                <ProfileSkills user={user} onSave={updateUser} />
              </div>
            </div>
            
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              <div className="grid gap-6 sm:gap-8">
                <ProfileWorkExperience user={user} onSave={updateUser} />
                <ProfileEducation user={user} onSave={updateUser} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
