"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Link2, Globe, ExternalLink } from "lucide-react";
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

  // Get displayable URL without protocol prefix
  const getDisplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  const isEmpty = optimisticSocialLinks.length === 0;

  return (
    <>
      <ProfileSection 
        title="Social Links" 
        icon={<Globe className="h-5 w-5" />}
        onAdd={() => {
          resetForm();
          setIsDialogOpen(true);
        }}
        isEmpty={isEmpty}
        emptyStateMessage="Add your social media profiles to connect with others."
      >
        {!isEmpty && (
          <div className="space-y-3 animate-in fade-in duration-300">
            {optimisticSocialLinks.map((link, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 group border border-transparent hover:border-border/50 transition-all"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {getSocialIcon(link.platform)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-primary capitalize mb-0.5">
                    {link.platform.toLowerCase()}
                  </div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-primary text-sm truncate block hover:underline transition-colors flex items-center gap-1"
                  >
                    {getDisplayUrl(link.url)}
                    <ExternalLink className="h-3 w-3 inline opacity-60" />
                  </a>
                </div>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditSocialLink(index)}
                    className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveSocialLink(index)}
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <div className="grid gap-5 py-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block text-foreground">Platform *</label>
            <Select
              value={newSocialLink.platform}
              onValueChange={(value) => setNewSocialLink({ ...newSocialLink, platform: value as Platform })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Platform).map((platform) => (
                  <SelectItem key={platform} value={platform} className="capitalize">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{getSocialIcon(platform as Platform)}</span>
                      <span>{platform.toLowerCase()}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block text-foreground">URL *</label>
            <Input 
              placeholder="https://example.com/profile" 
              value={newSocialLink.url} 
              onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })} 
              className="w-full"
            />
          </div>
        </div>
      </FormDialog>
    </>
  );
}
