"use client";

import { useState, useTransition } from "react";
import { User, Education } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { EducationEditor } from "@/components/resume-editor/components/EducationEditor";
import { EducationItem } from "@/components/resume-editor/types";

interface ProfileEducationProps {
  user: User & { education: Education[] };
  onSave: (data: Partial<User & { education: Omit<Education, "id">[] }>) => Promise<User>;
}

export default function ProfileEducation({ user, onSave }: ProfileEducationProps) {
  const [, startTransition] = useTransition();
  const { toast } = useToast();

  const convertToEducationItem = (edu: Education): EducationItem => ({
    id: edu.id,
    institution: edu.institution,
    degree: edu.degree,
    startDate: edu.startDate.toISOString().slice(0, 7), // Convert to YYYY-MM
    endDate: edu.endDate ? edu.endDate.toISOString().slice(0, 7) : undefined,
    description: edu.description || undefined,
    points: edu.points || [],
    displayOrder: edu.displayOrder,
  });

  const convertToPrismaEducation = (item: EducationItem): Omit<Education, "id"> => ({
    userId: user.id,
    institution: item.institution,
    degree: item.degree || "",
    startDate: new Date(item.startDate + "-15"),
    endDate: item.endDate ? new Date(item.endDate + "-15") : null,
    description: item.description || null,
    points: item.points,
    displayOrder: item.displayOrder,
  });

  const [education, setEducation] = useState<EducationItem[]>(
    user.education.map(convertToEducationItem)
  );

  const saveEducation = async (updatedEducation: EducationItem[]) => {
    startTransition(async () => {
      try {
        const prismaEducation = updatedEducation.map(convertToPrismaEducation);
        await onSave({ education: prismaEducation });
        
        toast({
          title: "Education updated",
          description: "Your education has been updated successfully.",
        });
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

  const handleAddEducation = (newEducation: EducationItem) => {
    const updatedEducation = [...education, newEducation];
    setEducation(updatedEducation);
    saveEducation(updatedEducation);
  };

  const handleUpdateEducation = (id: string, data: Omit<EducationItem, "id">) => {
    const updatedEducation = education.map(item => 
      item.id === id ? { ...item, ...data } : item
    );
    setEducation(updatedEducation);
    saveEducation(updatedEducation);
  };

  const handleRemoveEducation = (id: string) => {
    const updatedEducation = education.filter(item => item.id !== id);
    setEducation(updatedEducation);
    saveEducation(updatedEducation);
  };

  return (
    <EducationEditor
      education={education}
      onAdd={handleAddEducation}
      onUpdate={handleUpdateEducation}
      onRemove={handleRemoveEducation}
      title="Education"
      description=""
    />
  );
}
