"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap } from "lucide-react";
import { Degree, User, Education } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileSection } from "@/app/(authenticated)/profile/ProfileSection";
import { TimelineItem } from "@/components/common/TimelineItem";
import { formatDateRange, dateToMonthString } from "@/lib/date-utils";
import { FormDialog } from "@/components/common/FormDialog";

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
  points?: string[];
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
  
  const [newEducation, setNewEducation] = useState<EducationFormData>({
    institution: "",
    degree: Degree.BACHELORS,
    startDate: "",
    endDate: null,
    description: null,
    points: [],
    displayOrder: 0,
  });

  const handleSave = () => {
    if (!newEducation.institution || !newEducation.startDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    let updatedEducations: Education[];
    
    if (editingIndex !== null) {
      // Update existing education
      updatedEducations = [...optimisticEducation];
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
        startDate: parseMonthInput(newEducation.startDate),
        endDate: newEducation.endDate ? parseMonthInput(newEducation.endDate) : null,
        description: newEducation.description,
        points: newEducation.points || [],
      };
    } else {
      const educationToAdd: Education = {
        id: `temp-${Date.now()}`,
        userId: user.id,
        institution: newEducation.institution,
        degree: newEducation.degree,
        startDate: parseMonthInput(newEducation.startDate),
        endDate: newEducation.endDate ? parseMonthInput(newEducation.endDate) : null,
        description: newEducation.description,
        points: newEducation.points || [],
        displayOrder: optimisticEducation.length,
      };
      updatedEducations = [...optimisticEducation, educationToAdd];
    }

    updateOptimisticEducation(updatedEducations);
    
    startTransition(async () => {
      try {
        const formattedEducations = updatedEducations.map(({ ...edu }) => ({
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description,
          points: edu.points,
          displayOrder: edu.displayOrder,
        }));

        await onSave({ education: formattedEducations.map(edu => ({
          ...edu,
          userId: user.id,
        })) });
        
        setIsDialogOpen(false);
        toast({
          title: "Education updated",
          description: editingIndex !== null 
            ? "Education has been updated successfully."
            : "New education has been added successfully.",
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

  const handleEditEducation = (index: number) => {
    const edu = optimisticEducation[index];
    if (!edu) return;
    
    setEditingIndex(index);
    setNewEducation({
      institution: edu.institution,
      degree: edu.degree,
      startDate: dateToMonthString(edu.startDate),
      endDate: dateToMonthString(edu.endDate),
      description: edu.description,
      points: edu.points,
      displayOrder: edu.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewEducation({
      institution: "",
      degree: Degree.BACHELORS,
      startDate: "",
      endDate: null,
      description: null,
      points: [],
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
    const updatedEducations = optimisticEducation.filter((_, i) => i !== index);
    updateOptimisticEducation(updatedEducations);
    
    // Save to server
    startTransition(async () => {
      try {
        const formattedEducations = updatedEducations.map(({ ...edu }) => ({
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description,
          points: edu.points,
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

  // Helper function to correctly parse month input (YYYY-MM) to avoid timezone issues
  const parseMonthInput = (dateString: string): Date => {
    if (!dateString) return new Date();
    
    const [year, month] = dateString.split('-').map(num => parseInt(num, 10));
    // Create date with specific year and month (0-indexed)
    // Set day to 15 to avoid end-of-month issues
    return new Date(year, month - 1, 15, 12, 0, 0);
  };

  const formatDegree = (degree: Degree): string => {
    return degree.replace(/_/g, ' ').toLowerCase();
  };

  const isEmpty = optimisticEducation.length === 0;

  return (
    <>
      <ProfileSection
        title="Education"
        icon={<GraduationCap className="h-5 w-5" />}
        onAdd={() => {
          resetForm();
          setIsDialogOpen(true);
        }}
        isEmpty={isEmpty}
        emptyStateMessage="Add your educational background to showcase your qualifications."
      >
        <div className="space-y-8">
          {optimisticEducation.map((edu, index) => (
            <TimelineItem
              key={edu.id}
              title={formatDegree(edu.degree)}
              subtitle={edu.institution}
              dateRange={formatDateRange(edu.startDate, edu.endDate)}
              points={edu.points}
              onEdit={() => handleEditEducation(index)}
              onDelete={() => handleRemoveEducation(index)}
            />
          ))}
        </div>
      </ProfileSection>

      <FormDialog
        title={editingIndex !== null ? "Edit Education" : "Add New Education"}
        description={editingIndex !== null 
          ? "Update your education details below." 
          : "Add details about your education."}
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSave}
        onCancel={() => resetForm()}
        isSubmitting={isPending}
      >
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
        </div>
      </FormDialog>
    </>
  );
}
