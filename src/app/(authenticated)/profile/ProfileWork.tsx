"use client";

import { useTransition, useOptimistic } from "react";
import { EmploymentType, JobRole, LocationType, User, Work } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { WorkEditor } from "@/components/resume-editor/components/WorkEditor";
import { WorkItem } from "@/components/resume-editor/types";

interface ProfileWorkProps {
  user: User & { work: Work[] };
  onSave: (data: Partial<User & { work: Omit<Work, "id">[] }>) => Promise<User>;
}

const workToWorkItem = (work: Work): WorkItem => ({
  id: work.id,
  company: work.company,
  position: work.position,
  location: work.location,
  employmentType: work.employmentType,
  startDate: dateToMonthString(work.startDate),
  endDate: work.endDate ? dateToMonthString(work.endDate) : undefined,
  description: work.description || "",
  points: work.points || [],
  displayOrder: work.displayOrder,
});

const workItemToWork = (workItem: Omit<WorkItem, "id">, userId: string): Omit<Work, "id"> => ({
  userId,
  company: workItem.company,
  position: workItem.position as JobRole,
  location: workItem.location as LocationType,
  employmentType: workItem.employmentType as EmploymentType,
  startDate: parseMonthInput(workItem.startDate),
  endDate: workItem.endDate ? parseMonthInput(workItem.endDate) : null,
  description: workItem.description || null,
  points: workItem.points,
  displayOrder: workItem.displayOrder,
});

const parseMonthInput = (dateString: string): Date => {
  if (!dateString) return new Date();
  
  const [year, month] = dateString.split('-').map(num => parseInt(num, 10));
  return new Date(year, month - 1, 15, 12, 0, 0);
};

const dateToMonthString = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export default function ProfileWork({ user, onSave }: ProfileWorkProps) {
  const [, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [optimisticWork, updateOptimisticWork] = useOptimistic(
    user.work.map(workToWorkItem),
    (state, newWork: WorkItem[]) => newWork
  );

  const saveWorkExperience = async (workItems: WorkItem[]) => {
    startTransition(async () => {
      try {
        const formattedWork = workItems.map(item => workItemToWork(item, user.id));
        await onSave({ work: formattedWork });
        
        toast({
          title: "Work experience updated",
          description: "Your work experience has been updated successfully.",
        });
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

  const handleAdd = (workItem: WorkItem) => {
    const newWork = [...optimisticWork, workItem];
    updateOptimisticWork(newWork);
    saveWorkExperience(newWork);
  };

  const handleUpdate = (id: string, data: Omit<WorkItem, "id">) => {
    const updatedWork = optimisticWork.map(item => 
      item.id === id ? { ...item, ...data } : item
    );
    updateOptimisticWork(updatedWork);
    saveWorkExperience(updatedWork);
  };

  const handleRemove = (id: string) => {
    const filteredWork = optimisticWork.filter(item => item.id !== id);
    updateOptimisticWork(filteredWork);
    saveWorkExperience(filteredWork);
  };

  return (
    <WorkEditor
      work={optimisticWork}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      title="Work Experience"
      description=""
    />
  );
}
