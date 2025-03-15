"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, PlusCircle, GraduationCap } from "lucide-react";
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
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Convert Date to YYYY-MM format for input[type="month"]
  const dateToMonthString = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().slice(0, 7);
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Education</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {/* Display Education */}
      <div className="space-y-8">
        {optimisticEducation.map((edu, index) => (
          <div key={edu.id} className="relative pl-6 border-l-2 border-muted pb-6 last:pb-0">
            <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5" />
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{edu.degree.replace(/_/g, ' ').toLowerCase()}</h3>
                <p className="text-muted-foreground">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : "Present"}
                </p>
                {edu.description && <p className="mt-2">{edu.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditEducation(index)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveEducation(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
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
                        {degree.replace(/_/g, ' ').toLowerCase()}
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
    </div>
  );
}
