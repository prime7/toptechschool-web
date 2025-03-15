"use client";

import { User } from '@prisma/client';
import { FileText } from "lucide-react";
import { useState, useTransition, useOptimistic } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfileSection } from "@/app/(authenticated)/profile/ProfileSection";
import { FormDialog } from "@/components/common/FormDialog";
import { Textarea } from "@/components/ui/textarea";

interface ProfileAboutProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => Promise<User>;
}

export default function ProfileAbout({ user, onSave }: ProfileAboutProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [optimisticUser, updateOptimisticUser] = useOptimistic(
    user,
    (state, update: Partial<User>) => ({ ...state, ...update })
  );
  const { toast } = useToast();
  
  const [bio, setBio] = useState(user.bio || "");

  const handleSave = () => {
    const updatedFields = {
      bio: bio,
    };
    
    updateOptimisticUser(updatedFields);
    
    startTransition(async () => {
      try {
        await onSave(updatedFields);
        setIsDialogOpen(false);
        toast({
          title: "Bio updated",
          description: "Your bio has been updated successfully.",
        });
      } catch (error) {
        console.error("Failed to update bio:", error);
        toast({
          title: "Update failed",
          description: "There was a problem updating your bio. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleOpenDialog = () => {
    setBio(user.bio || "");
    setIsDialogOpen(true);
  };

  const isEmpty = !optimisticUser.bio;

  return (
    <>
      <ProfileSection 
        title="About" 
        icon={<FileText className="h-5 w-5" />}
        onEdit={isEmpty ? undefined : handleOpenDialog}
        isEmpty={isEmpty}
        emptyStateMessage="Add a bio to tell others about yourself."
        emptyStateAction={handleOpenDialog}
        emptyStateActionText="Add Bio"
      >
        <p className="text-muted-foreground whitespace-pre-wrap">
          {optimisticUser.bio}
        </p>
      </ProfileSection>

      <FormDialog
        title={isEmpty ? "Add Bio" : "Edit Bio"}
        description="Share information about yourself with others."
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSave}
        onCancel={() => setBio(user.bio || "")}
        isSubmitting={isPending}
      >
        <Textarea 
          value={bio} 
          onChange={(e) => setBio(e.target.value)}
          className="min-h-[200px]"
          placeholder="Tell us about yourself..."
        />
      </FormDialog>
    </>
  );
}
