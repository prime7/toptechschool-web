"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Link2 } from "lucide-react";
import { Platform, SocialLink, User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSocialIcon } from "@/lib/icons";
import { ProfileSection } from "@/app/(authenticated)/profile/ProfileSection";
import { FormDialog } from "@/components/common/FormDialog";

interface ProfileSocialLinksProps {
  user: User & { socialLinks?: SocialLink[] };
  onSave: (updatedUser: Partial<User & { socialLinks?: SocialLink[] }>) => Promise<User>;
}

export default function ProfileSocialLinks({ user, onSave }: ProfileSocialLinksProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    user.socialLinks || []
  );
  const [optimisticSocialLinks, updateOptimisticSocialLinks] = useOptimistic(
    socialLinks,
    (state, newLinks: SocialLink[]) => newLinks
  );
  const { toast } = useToast();

  const [newSocialLink, setNewSocialLink] = useState<Omit<SocialLink, "id" | "createdAt" | "updatedAt" | "displayOrder" | "userId">>({
    platform: Platform.GITHUB,
    url: "",
  });

  const addSocialLink = () => {
    if (newSocialLink.url.trim()) {
      setSocialLinks([...socialLinks, { ...newSocialLink as SocialLink }]);
      setNewSocialLink({ platform: Platform.GITHUB, url: "" });
    }
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
  };

  const handleSave = async () => {
    updateOptimisticSocialLinks(socialLinks);

    startTransition(async () => {
      try {
        await onSave({ socialLinks });
        setIsDialogOpen(false);
        toast({
          title: "Social links updated",
          description: "Your social links have been updated successfully.",
        });
      } catch (error) {
        console.error("Failed to update social links:", error);
        toast({
          title: "Update failed",
          description: "There was a problem updating your social links. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleOpenDialog = () => {
    setSocialLinks(user.socialLinks || []);
    setIsDialogOpen(true);
  };

  const isEmpty = !optimisticSocialLinks.length;

  return (
    <>
      <ProfileSection 
        title="Social Links" 
        icon={<Link2 className="h-5 w-5" />}
        onEdit={isEmpty ? undefined : handleOpenDialog}
        isEmpty={isEmpty}
        emptyStateMessage="Add your social media profiles."
        emptyStateAction={handleOpenDialog}
        emptyStateActionText="Add Links"
      >
        <div className="space-y-3">
          {optimisticSocialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              {getSocialIcon(link.platform)}
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex-1 break-all">
                {link.url}
              </a>
            </div>
          ))}
        </div>
      </ProfileSection>

      <FormDialog
        title="Edit Social Links"
        description="Add or remove your social media profiles."
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSave}
        onCancel={() => setSocialLinks(user.socialLinks || [])}
        isSubmitting={isPending}
      >
        <div className="space-y-4">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              {getSocialIcon(link.platform)}
              <span className="flex-1 truncate">{link.url}</span>
              <Button variant="ghost" size="icon" onClick={() => removeSocialLink(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1">
              <Select
                value={newSocialLink.platform}
                onValueChange={(value) => setNewSocialLink({ ...newSocialLink, platform: value as Platform })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Platform).map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3 flex gap-2">
              <Input 
                placeholder="URL" 
                value={newSocialLink.url} 
                onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })} 
              />
              <Button type="button" onClick={addSocialLink}>Add</Button>
            </div>
          </div>
        </div>
      </FormDialog>
    </>
  );
}
