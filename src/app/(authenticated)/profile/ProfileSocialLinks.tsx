"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import { Platform, SocialLink, User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSocialIcon } from "@/lib/icons";

interface ProfileSocialLinksProps {
  user: User & { socialLinks?: SocialLink[] };
  onSave: (updatedUser: Partial<User & { socialLinks?: SocialLink[] }>) => Promise<User>;
}

export default function ProfileSocialLinks({ user, onSave }: ProfileSocialLinksProps) {
  const [editingSection, setEditingSection] = useState<string>("");
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
        setEditingSection("");
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

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Social Links</h2>
        {editingSection !== "social" && (
          <Button variant="ghost" size="icon" onClick={() => setEditingSection("social")}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {(editingSection === "social" ? socialLinks : optimisticSocialLinks).map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            {getSocialIcon(link.platform)}
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex-1">
              {link.url}
            </a>
            {editingSection === "social" && (
              <Button variant="ghost" size="icon" onClick={() => removeSocialLink(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}

        {optimisticSocialLinks.length === 0 && !editingSection && (
          <p className="text-muted-foreground">No social links added yet.</p>
        )}

        {editingSection === "social" && (
          <div className="mt-4 grid gap-4">
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
                <Input placeholder="URL" value={newSocialLink.url} onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })} />
                <Button onClick={addSocialLink}>Add</Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingSection("")} disabled={isPending}>Cancel</Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
