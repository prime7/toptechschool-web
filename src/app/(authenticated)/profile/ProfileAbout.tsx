"use client";

import { User } from '@prisma/client';
import { FileText, Quote } from "lucide-react";
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

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setBio(user.bio || "");
    }
  };

  const isEmpty = !optimisticUser.bio;

  return (
    <>
      <ProfileSection 
        title="About" 
        icon={<FileText className="h-5 w-5" />}
        onAdd={isEmpty ? () => setIsDialogOpen(true) : undefined}
        onEdit={isEmpty ? undefined : () => setIsDialogOpen(true)}
        isEmpty={isEmpty}
        emptyStateMessage="Add a bio to tell others about yourself."
      >
        <div className="relative">
          <Quote className="absolute text-primary/20 h-8 w-8 -left-1 -top-2 rotate-180" />
          <div className="pl-6 pr-2">
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {optimisticUser.bio}
            </p>
          </div>
          <Quote className="absolute text-primary/20 h-8 w-8 right-0 bottom-0" />
        </div>
      </ProfileSection>

      <FormDialog
        title={isEmpty ? "Add Bio" : "Edit Bio"}
        description="Share information about yourself with others."
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSave}
        onCancel={() => setBio(user.bio || "")}
        isSubmitting={isPending}
      >
        <Textarea 
          value={bio} 
          onChange={(e) => setBio(e.target.value)}
          className="min-h-[200px] resize-y"
          placeholder="Tell us about yourself..."
        />
      </FormDialog>
    </>
  );
}
