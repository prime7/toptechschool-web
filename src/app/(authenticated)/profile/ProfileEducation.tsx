"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap } from "lucide-react";
import { Degree, User, Education } from "@prisma/client";
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

interface ProfileEducationProps {
  user: User & { education: Education[] };
  onSave: (data: Partial<User & { education: Omit<Education, "id">[] }>) => Promise<User>;
}

type EducationFormData = {
  institution: string;
  degree: Degree;
  startDate: string;
  endDate: string | null;
  description: string | null;
  displayOrder: number;
};

export default function ProfileEducation({ user, onSave }: ProfileEducationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [optimisticEducation, updateOptimisticEducation] = useOptimistic(
    user.education,
    (state, newEducation: Education[]) => newEducation
  );

  const [educations, setEducations] = useState<Education[]>(user.education);
  
  const [newEducation, setNewEducation] = useState<EducationFormData>({
    institution: "",
    degree: Degree.BACHELORS,
    startDate: "",
    endDate: null,
    description: "",
    displayOrder: 0,
  });

  const handleAddEducation = () => {
    if (!newEducation.institution || !newEducation.startDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const educationToAdd: Education = {
      id: `temp-${Date.now()}`,
      userId: user.id,
      institution: newEducation.institution,
      degree: newEducation.degree,
      startDate: new Date(newEducation.startDate),
      endDate: newEducation.endDate ? new Date(newEducation.endDate) : null,
      description: newEducation.description,
      displayOrder: educations.length,
    };

    const updatedEducations = [...educations, educationToAdd];
    setEducations(updatedEducations);
    updateOptimisticEducation(updatedEducations);

    // Save immediately
    startTransition(async () => {
      try {
        const formattedEducations = updatedEducations.map(({ id, userId, ...edu }) => ({
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description,
          displayOrder: edu.displayOrder,
        }));

        await onSave({ education: formattedEducations.map(edu => ({
          ...edu,
          userId: user.id,
        })) });
        
        setIsDialogOpen(false);
        toast({
          title: "Education updated",
          description: "New education has been added successfully.",
        });

        resetForm();
      } catch (error) {
        console.error("Failed to add education:", error);
        toast({
          title: "Update failed",
          description: "There was a problem adding your education. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleEditEducation = (index: number) => {
    const edu = educations[index];
    if (!edu) return;
    
    setEditingIndex(index);
    setNewEducation({
      institution: edu.institution,
      degree: edu.degree,
      startDate: dateToMonthString(edu.startDate),
      endDate: dateToMonthString(edu.endDate),
      description: edu.description || "",
      displayOrder: edu.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const handleUpdateEducation = () => {
    if (editingIndex === null) return;
    
    if (!newEducation.institution || !newEducation.startDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const updatedEducations = [...educations];
    if (!updatedEducations[editingIndex]) {
      toast({
        title: "Update failed",
        description: "Could not find the education to update.",
        variant: "destructive",
      });
      return;
    }
    
    updatedEducations[editingIndex] = {
      ...updatedEducations[editingIndex],
      institution: newEducation.institution,
      degree: newEducation.degree,
      startDate: new Date(newEducation.startDate),
      endDate: newEducation.endDate ? new Date(newEducation.endDate) : null,
      description: newEducation.description,
    };

    setEducations(updatedEducations);
    updateOptimisticEducation(updatedEducations);

    startTransition(async () => {
      try {
        const formattedEducations = updatedEducations.map(({ id, userId, ...edu }) => ({
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description,
          displayOrder: edu.displayOrder,
        }));

        await onSave({ education: formattedEducations.map(edu => ({
          ...edu,
          userId: user.id,
        })) });
        
        setIsDialogOpen(false);
        toast({
          title: "Education updated",
          description: "Education has been updated successfully.",
        });
        resetForm();
      } catch (error) {
        console.error("Failed to update education:", error);
        toast({
          title: "Update failed",
          description: "There was a problem updating your education. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const resetForm = () => {
    setNewEducation({
      institution: "",
      degree: Degree.BACHELORS,
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

  const handleRemoveEducation = (index: number) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
    updateOptimisticEducation(updatedEducations);
    
    // Save immediately
    startTransition(async () => {
      try {
        const formattedEducations = updatedEducations.map(({ id, userId, ...edu }) => ({
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description,
          displayOrder: edu.displayOrder,
        }));

        await onSave({ education: formattedEducations.map(edu => ({
          ...edu,
          userId: user.id,
        })) });
        
        toast({
          title: "Education removed",
          description: "Education has been removed successfully.",
        });
      } catch (error) {
        console.error("Failed to remove education:", error);
        toast({
          title: "Update failed",
          description: "There was a problem removing your education. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const formatDegree = (degree: Degree): string => {
    return degree.replace(/_/g, ' ').toLowerCase();
  };

  const isEmpty = optimisticEducation.length === 0;

  return (
    <ProfileSection
      title="Education"
      icon={<GraduationCap className="h-5 w-5" />}
      onAdd={() => {
        resetForm();
        setIsDialogOpen(true);
      }}
      addButtonText="Add Education"
      isEmpty={isEmpty}
      emptyStateMessage="Add your educational background to showcase your qualifications."
      emptyStateAction={() => {
        resetForm();
        setIsDialogOpen(true);
      }}
      emptyStateActionText="Add Education"
    >
      <div className="space-y-8">
        {optimisticEducation.map((edu, index) => (
          <TimelineItem
            key={edu.id}
            title={formatDegree(edu.degree)}
            subtitle={edu.institution}
            dateRange={formatDateRange(edu.startDate, edu.endDate)}
            description={edu.description}
            onEdit={() => handleEditEducation(index)}
            onDelete={() => handleRemoveEducation(index)}
          />
        ))}
      </div>

      {/* Education Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Education" : "Add New Education"}
            </DialogTitle>
            <DialogDescription>
              {editingIndex !== null 
                ? "Update your education details below." 
                : "Add details about your education."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Institution *</label>
                <Input
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                  placeholder="School or university name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Degree *</label>
                <Select
                  value={newEducation.degree}
                  onValueChange={(value) => setNewEducation({ ...newEducation, degree: value as Degree })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Degree).map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {formatDegree(degree)}
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
                  value={newEducation.startDate}
                  onChange={(e) => setNewEducation({ 
                    ...newEducation, 
                    startDate: e.target.value 
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="month"
                  value={newEducation.endDate || ""}
                  onChange={(e) => setNewEducation({ 
                    ...newEducation, 
                    endDate: e.target.value || null
                  })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newEducation.description || ""}
                onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                placeholder="Add any relevant details about your education"
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
                onClick={editingIndex !== null ? handleUpdateEducation : handleAddEducation} 
                disabled={isPending}
              >
                {isPending ? "Saving..." : editingIndex !== null ? "Update Education" : "Add Education"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ProfileSection>
  );
}
