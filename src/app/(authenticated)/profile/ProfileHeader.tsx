"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitialsFromName } from "@/lib/utils";
import { User } from '@prisma/client'
import { Edit, User as UserIcon } from "lucide-react";
import { useState, useTransition, useOptimistic } from "react";
import { useToast } from "@/hooks/use-toast";
import { InputField } from "@/components/common/FormField";
import { ProfileSection } from "@/app/(authenticated)/profile/ProfileSection";

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

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-border">
          <AvatarImage src={optimisticUser?.image ?? ""} alt={optimisticUser?.name ?? ""} />
          <AvatarFallback className="text-lg sm:text-xl bg-primary/10">
            {getInitialsFromName(optimisticUser?.name ?? "")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold capitalize">{optimisticUser?.name || "Add your name"}</h1>
            {!editing && (
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground capitalize">
            {optimisticUser.title || <span className="text-muted-foreground/60 italic">Add your professional title</span>}
          </p>
          <p className="mt-1 capitalize">
            {optimisticUser?.location || <span className="text-muted-foreground/60 italic">Add your location</span>}
          </p>
          <p className="mt-1 text-muted-foreground lowercase break-words">{optimisticUser?.email}</p>
        </div>
      </div>
      {editing && (
        <ProfileSection 
          title="Edit Profile Information" 
          icon={<UserIcon className="h-5 w-5" />}
          className="mt-4"
        >
          <div className="grid gap-4">
            <InputField
              label="Name"
              value={formData.name}
              onChange={(value) => handleFieldChange("name", value)}
              required
            />
            <InputField
              label="Professional Title"
              value={formData.title}
              onChange={(value) => handleFieldChange("title", value)}
              placeholder="e.g. Software Engineer"
            />
            <InputField
              label="Location"
              value={formData.location}
              onChange={(value) => handleFieldChange("location", value)}
              placeholder="e.g. San Francisco, CA"
            />
            <InputField
              label="Email"
              value={formData.email}
              onChange={(value) => handleFieldChange("email", value)}
              type="email"
              required
            />
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-2">
              <Button variant="outline" onClick={handleCancel} disabled={isPending} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={handleSave} disabled={isPending} className="w-full sm:w-auto">
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </ProfileSection>
      )}
    </div>
  );
}