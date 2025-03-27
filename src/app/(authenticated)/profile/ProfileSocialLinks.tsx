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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticSocialLinks, updateOptimisticSocialLinks] = useOptimistic(
    user.socialLinks || [],
    (state, newLinks: SocialLink[]) => newLinks
  );
  const { toast } = useToast();

  const [newSocialLink, setNewSocialLink] = useState<Omit<SocialLink, "id" | "createdAt" | "updatedAt" | "displayOrder" | "userId">>({
    platform: Platform.GITHUB,
    url: "",
  });

  const handleSave = () => {
    if (!newSocialLink.url.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please provide a URL for your social link.",
        variant: "destructive",
      });
      return;
    }

    let updatedLinks: SocialLink[];
    
    if (editingIndex !== null) {
      // Update existing link
      updatedLinks = [...optimisticSocialLinks];
      if (!updatedLinks[editingIndex]) {
        toast({
          title: "Update failed",
          description: "Could not find the social link to update.",
          variant: "destructive",
        });
        return;
      }
      
      updatedLinks[editingIndex] = {
        ...updatedLinks[editingIndex],
        platform: newSocialLink.platform,
        url: newSocialLink.url,
      };
    } else {
      // Add new link
      const linkToAdd: SocialLink = {
        id: `temp-${Date.now()}`,
        userId: user.id,
        platform: newSocialLink.platform,
        url: newSocialLink.url,
        displayOrder: optimisticSocialLinks.length,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      updatedLinks = [...optimisticSocialLinks, linkToAdd];
    }

    // Update optimistic state immediately
    updateOptimisticSocialLinks(updatedLinks);
    
    // Save to server
    startTransition(async () => {
      try {
        await onSave({ socialLinks: updatedLinks });
        setIsDialogOpen(false);
        toast({
          title: "Social links updated",
          description: editingIndex !== null 
            ? "Social link has been updated successfully."
            : "New social link has been added successfully.",
        });
        resetForm();
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

  const handleEditSocialLink = (index: number) => {
    const link = optimisticSocialLinks[index];
    if (!link) return;
    
    setEditingIndex(index);
    setNewSocialLink({
      platform: link.platform,
      url: link.url,
    });
    setIsDialogOpen(true);
  };

  const handleRemoveSocialLink = (index: number) => {
    const updatedLinks = optimisticSocialLinks.filter((_, i) => i !== index);
    updateOptimisticSocialLinks(updatedLinks);
    
    // Save to server
    startTransition(async () => {
      try {
        await onSave({ socialLinks: updatedLinks });
        toast({
          title: "Social link removed",
          description: "Social link has been removed successfully.",
        });
      } catch (error) {
        console.error("Failed to remove social link:", error);
        toast({
          title: "Update failed",
          description: "There was a problem removing your social link. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const resetForm = () => {
    setNewSocialLink({
      platform: Platform.GITHUB,
      url: "",
    });
    setEditingIndex(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const isEmpty = optimisticSocialLinks.length === 0;

  return (
    <>
      <ProfileSection 
        title="Social Links" 
        icon={<Link2 className="h-5 w-5" />}
        onAdd={() => {
          resetForm();
          setIsDialogOpen(true);
        }}
        isEmpty={isEmpty}
        emptyStateMessage="Add your social media profiles to connect with others."
      >
        <div className="space-y-3">
          {optimisticSocialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 group">
              {getSocialIcon(link.platform)}
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex-1 break-all">
                {link.url}
              </a>
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => handleEditSocialLink(index)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveSocialLink(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ProfileSection>

      <FormDialog
        title={editingIndex !== null ? "Edit Social Link" : "Add Social Link"}
        description={editingIndex !== null 
          ? "Update your social media profile link." 
          : "Add a new social media profile."}
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSave}
        onCancel={() => resetForm()}
        isSubmitting={isPending}
      >
        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium">Platform *</label>
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
          <div>
            <label className="text-sm font-medium">URL *</label>
            <Input 
              placeholder="https://example.com/profile" 
              value={newSocialLink.url} 
              onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })} 
            />
          </div>
        </div>
      </FormDialog>
    </>
  );
}
