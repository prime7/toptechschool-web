import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import { prisma } from "@/lib/prisma";
import { User, SocialLink } from "@prisma/client";
import { revalidatePath } from "next/cache";
import ProfileAbout from "./ProfileAbout";
import ProfileSocialLinks from "./ProfileSocialLinks";

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
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  async function updateUser(updatedData: Partial<User & { socialLinks?: SocialLink[] }>): Promise<User> {
    'use server'
    
    const { socialLinks, ...userData } = updatedData;
    
    const updatedUser = await prisma.user.update({
      where: { id: user?.id },
      data: {
        ...userData,
        ...(socialLinks && {
          socialLinks: {
            deleteMany: {},
            create: socialLinks.map(link => ({
              platform: link.platform,
              url: link.url,
            })),
          },
        }),
      },
      include: {
        socialLinks: true,
      },
    });
    
    revalidatePath('/profile');
    
    return updatedUser;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="grid gap-8">
        <ProfileHeader user={user} onSave={updateUser} />
        <ProfileAbout user={user} onSave={updateUser} />
        <ProfileSocialLinks user={user} onSave={updateUser} />
      </div>
    </div>
  );
}
