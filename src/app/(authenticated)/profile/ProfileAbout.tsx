"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from '@prisma/client';
import { Edit } from "lucide-react";
import { useState, useTransition, useOptimistic } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProfileAboutProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => Promise<User>;
}

export default function ProfileAbout({ user, onSave }: ProfileAboutProps) {
  const [editing, setEditing] = useState(false);
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
        setEditing(false);
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

  const handleCancel = () => {
    setBio(user.bio || "");
    setEditing(false);
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">About</h2>
        {!editing && (
          <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {editing ? (
        <div>
          <Textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
            className="min-h-[100px]"
            placeholder="Tell us about yourself..."
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isPending}>Cancel</Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">
          {optimisticUser.bio || "No bio provided. Click the edit button to add one."}
        </p>
      )}
    </div>
  );
}
