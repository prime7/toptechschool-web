"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitialsFromName } from "@/lib/utils";
import { User } from '@prisma/client'
import { Edit, User as UserIcon, MapPin, Mail } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
        <div className="relative group">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/30 bg-primary/5">
            <AvatarImage 
              src={optimisticUser?.image ?? ""} 
              alt={optimisticUser?.name ?? ""} 
              className="object-cover"
            />
            <AvatarFallback className="text-2xl sm:text-3xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium">
              {getInitialsFromName(optimisticUser?.name ?? "")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold capitalize tracking-tight">
              {optimisticUser?.name || "Add your name"}
            </h1>
            {!editing && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setEditing(true)}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="text-lg sm:text-xl text-muted-foreground capitalize mb-3">
            {optimisticUser.title || <span className="text-muted-foreground/60 italic">Add your professional title</span>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center sm:items-start mt-4">
            {optimisticUser?.location && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary/70" />
                <span className="capitalize">{optimisticUser.location}</span>
              </div>
            )}
            
            {optimisticUser?.email && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary/70" />
                <span className="lowercase break-words">{optimisticUser.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {editing && (
        <div className="mt-6 sm:mt-8 rounded-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <ProfileSection 
            title="Edit Profile Information" 
            icon={<UserIcon className="h-5 w-5" />}
          >
            <div className="grid gap-4 sm:gap-5">
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
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={isPending} 
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isPending} 
                  className="w-full sm:w-auto"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </ProfileSection>
        </div>
      )}
    </div>
  );
}