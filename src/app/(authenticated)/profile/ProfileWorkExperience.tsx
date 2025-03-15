"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase } from "lucide-react";
import { EmploymentType, User, WorkExperience } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileSection } from "@/app/(authenticated)/profile/ProfileSection";
import { TimelineItem } from "@/components/common/TimelineItem";
import { formatDateRange, dateToMonthString } from "@/lib/date-utils";

interface ProfileWorkExperienceProps {
  user: User & { workExperience: WorkExperience[] };
  onSave: (data: Partial<User & { workExperience: Omit<WorkExperience, "id">[] }>) => Promise<User>;
}

type WorkExperienceFormData = {
  company: string;
  position: string;
  location: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string | null;
  description: string | null;
  displayOrder: number;
};

export default function ProfileWorkExperience({ user, onSave }: ProfileWorkExperienceProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [optimisticExperience, updateOptimisticExperience] = useOptimistic(
    user.workExperience,
    (state, newExperience: WorkExperience[]) => newExperience
  );

  const [experiences, setExperiences] = useState<WorkExperience[]>(user.workExperience);
  
  const [newExperience, setNewExperience] = useState<WorkExperienceFormData>({
    company: "",
    position: "",
    location: "",
    employmentType: EmploymentType.FULL_TIME,
    startDate: "",
    endDate: null,
    description: "",
    displayOrder: 0,
  });

  const handleAddExperience = () => {
    if (!newExperience.company || !newExperience.position || !newExperience.startDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const experienceToAdd: WorkExperience = {
      id: `temp-${Date.now()}`,
      userId: user.id,
      company: newExperience.company,
      position: newExperience.position,
      location: newExperience.location,
      employmentType: newExperience.employmentType,
      startDate: new Date(newExperience.startDate),
      endDate: newExperience.endDate ? new Date(newExperience.endDate) : null,
      description: newExperience.description,
      displayOrder: experiences.length,
    };

    const updatedExperiences = [...experiences, experienceToAdd];
    setExperiences(updatedExperiences);
    updateOptimisticExperience(updatedExperiences);

    // Save immediately
    startTransition(async () => {
      try {
        const formattedExperiences = updatedExperiences.map(({ ...exp }) => ({
          company: exp.company,
          position: exp.position,
          location: exp.location,
          employmentType: exp.employmentType,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          displayOrder: exp.displayOrder,
        }));

        await onSave({ workExperience: formattedExperiences.map(exp => ({
          ...exp,
          userId: user.id,
        })) });
        
        setIsDialogOpen(false);
        toast({
          title: "Work experience updated",
          description: "New experience has been added successfully.",
        });

        resetForm();
      } catch (error) {
        console.error("Failed to add work experience:", error);
        toast({
          title: "Update failed",
          description: "There was a problem adding your work experience. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleEditExperience = (index: number) => {
    const exp = experiences[index];
    if (!exp) return;
    
    setEditingIndex(index);
    setNewExperience({
      company: exp.company,
      position: exp.position,
      location: exp.location,
      employmentType: exp.employmentType,
      startDate: dateToMonthString(exp.startDate),
      endDate: dateToMonthString(exp.endDate),
      description: exp.description || "",
      displayOrder: exp.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const handleUpdateExperience = () => {
    if (editingIndex === null) return;
    
    if (!newExperience.company || !newExperience.position || !newExperience.startDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const updatedExperiences = [...experiences];
    if (!updatedExperiences[editingIndex]) {
      toast({
        title: "Update failed",
        description: "Could not find the experience to update.",
        variant: "destructive",
      });
      return;
    }
    
    updatedExperiences[editingIndex] = {
      ...updatedExperiences[editingIndex],
      company: newExperience.company,
      position: newExperience.position,
      location: newExperience.location,
      employmentType: newExperience.employmentType,
      startDate: new Date(newExperience.startDate),
      endDate: newExperience.endDate ? new Date(newExperience.endDate) : null,
      description: newExperience.description,
    };

    setExperiences(updatedExperiences);
    updateOptimisticExperience(updatedExperiences);

    startTransition(async () => {
      try {
        const formattedExperiences = updatedExperiences.map(({ ...exp }) => ({
          company: exp.company,
          position: exp.position,
          location: exp.location,
          employmentType: exp.employmentType,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          displayOrder: exp.displayOrder,
        }));

        await onSave({ workExperience: formattedExperiences.map(exp => ({
          ...exp,
          userId: user.id,
        })) });
        
        setIsDialogOpen(false);
        toast({
          title: "Work experience updated",
          description: "Experience has been updated successfully.",
        });
        resetForm();
      } catch (error) {
        console.error("Failed to update work experience:", error);
        toast({
          title: "Update failed",
          description: "There was a problem updating your work experience. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const resetForm = () => {
    setNewExperience({
      company: "",
      position: "",
      location: "",
      employmentType: EmploymentType.FULL_TIME,
      startDate: "",
      endDate: null,
      description: "",
      displayOrder: 0,
    });
    setEditingIndex(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    updateOptimisticExperience(updatedExperiences);
    
    // Save immediately
    startTransition(async () => {
      try {
        const formattedExperiences = updatedExperiences.map(({ id, userId, ...exp }) => ({
          company: exp.company,
          position: exp.position,
          location: exp.location,
          employmentType: exp.employmentType,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          displayOrder: exp.displayOrder,
        }));

        await onSave({ workExperience: formattedExperiences.map(exp => ({
          ...exp,
          userId: user.id,
        })) });
        
        toast({
          title: "Experience removed",
          description: "Work experience has been removed successfully.",
        });
      } catch (error) {
        console.error("Failed to remove work experience:", error);
        toast({
          title: "Update failed",
          description: "There was a problem removing your work experience. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const formatEmploymentType = (type: EmploymentType): string => {
    return type.replace(/_/g, ' ').toLowerCase();
  };

  const isEmpty = optimisticExperience.length === 0;

  return (
    <ProfileSection
      title="Work Experience"
      icon={<Briefcase className="h-5 w-5" />}
      onAdd={() => {
        resetForm();
        setIsDialogOpen(true);
      }}
      addButtonText="Add Experience"
      isEmpty={isEmpty}
      emptyStateMessage="Add your work experience to showcase your professional background."
      emptyStateAction={() => {
        resetForm();
        setIsDialogOpen(true);
      }}
      emptyStateActionText="Add Experience"
    >
      <div className="space-y-8">
        {optimisticExperience.map((exp, index) => (
          <TimelineItem
            key={exp.id}
            title={exp.position}
            subtitle={`${exp.company}${exp.location ? ` · ${exp.location}` : ''}`}
            dateRange={formatDateRange(exp.startDate, exp.endDate)}
            description={exp.description}
            onEdit={() => handleEditExperience(index)}
            onDelete={() => handleRemoveExperience(index)}
          >
            {exp.employmentType && (
              <div className="mt-1">
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  {formatEmploymentType(exp.employmentType)}
                </span>
              </div>
            )}
          </TimelineItem>
        ))}
      </div>

      {/* Experience Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Experience" : "Add New Experience"}
            </DialogTitle>
            <DialogDescription>
              {editingIndex !== null 
                ? "Update your work experience details below." 
                : "Add details about your work experience."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Company *</label>
                <Input
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Position *</label>
                <Input
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                  placeholder="Job title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={newExperience.location}
                  onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                  placeholder="City, Country or Remote"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Employment Type</label>
                <Select
                  value={newExperience.employmentType}
                  onValueChange={(value) => setNewExperience({ ...newExperience, employmentType: value as EmploymentType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EmploymentType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatEmploymentType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date *</label>
                <Input
                  type="month"
                  value={newExperience.startDate}
                  onChange={(e) => setNewExperience({ 
                    ...newExperience, 
                    startDate: e.target.value 
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="month"
                  value={newExperience.endDate || ""}
                  onChange={(e) => setNewExperience({ 
                    ...newExperience, 
                    endDate: e.target.value || null
                  })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newExperience.description || ""}
                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                placeholder="Describe your responsibilities and achievements"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleDialogOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={editingIndex !== null ? handleUpdateExperience : handleAddExperience} 
                disabled={isPending}
              >
                {isPending ? "Saving..." : editingIndex !== null ? "Update Experience" : "Add Experience"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ProfileSection>
  );
}
