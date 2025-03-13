"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitialsFromName } from "@/lib/utils";
import { User } from '@prisma/client'
import { Edit } from "lucide-react";
import { useState, useTransition, useOptimistic } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => Promise<User>;
}

export default function ProfileHeader({ user, onSave }: ProfileHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [optimisticUser, updateOptimisticUser] = useOptimistic(
    user,
    (state, update: Partial<User>) => ({ ...state, ...update })
  );
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user.name || "",
    title: user.title || "",
    location: user.location || "",
    email: user.email || "",
  });

  const handleSave = () => {
    const updatedFields = {
      name: formData.name,
      title: formData.title,
      location: formData.location,
      email: formData.email,
    };
    
    updateOptimisticUser(updatedFields);
    
    startTransition(async () => {
      try {
        await onSave(updatedFields);
        setEditing(false);
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast({
          title: "Update failed",
          description: "There was a problem updating your profile. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      title: user.title || "",
      location: user.location || "",
      email: user.email || "",
    });
    setEditing(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={optimisticUser?.image ?? ""} alt={optimisticUser?.name ?? ""} />
          <AvatarFallback className="text-xl">{getInitialsFromName(optimisticUser?.name ?? "")}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h1 className="text-3xl font-bold capitalize">{optimisticUser?.name}</h1>
            {!editing && (
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xl text-muted-foreground capitalize">{optimisticUser.title}</p>
          <p className="mt-1 capitalize">{optimisticUser?.location}</p>
          <p className="mt-1 text-muted-foreground lowercase">{optimisticUser?.email}</p>
        </div>
      </div>
      {editing && (
        <div className="bg-card p-6 rounded-lg border border-border mt-4">
          <h2 className="text-xl font-semibold mb-4">Edit Profile Information</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={handleCancel} disabled={isPending}>Cancel</Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}