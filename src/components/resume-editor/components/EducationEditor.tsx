import React, { useState } from "react";
import { EducationItem } from "../types";
import { Plus, Trash2, Pencil, GraduationCap } from "lucide-react";
import { generateId } from "../utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListContentEditor } from "./ListContentEditor";
import { formatEnumValue } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";

interface EducationEditorProps {
  education: EducationItem[];
  onAdd: (education: EducationItem) => void;
  onUpdate: (id: string, data: Omit<EducationItem, "id">) => void;
  onRemove: (id: string) => void;
  title?: string;
  description?: string;
}

interface FormData extends Omit<EducationItem, "id"> {
  current?: boolean;
}

export function EducationEditor({
  education,
  onAdd,
  onUpdate,
  onRemove,
  title = "Education",
  description = "Add your educational background, including degrees, certifications, and relevant coursework.",
}: EducationEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const initialFormState: FormData = {
    institution: "",
    degree: "",
    startDate: "",
    endDate: undefined,
    points: [],
    displayOrder: 0,
    current: false,
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      current: checked,
      endDate: checked ? undefined : prev.endDate,
    }));
    if (checked && errors.endDate)
      setErrors((prev) => ({ ...prev, endDate: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.institution.trim())
      newErrors.institution = "Institution is required";
    if (!formData.degree) newErrors.degree = "Degree is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.current && !formData.endDate)
      newErrors.endDate = "End date is required if not currently studying";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const submissionData: Omit<EducationItem, "id"> = {
      institution: formData.institution,
      degree: formData.degree,
      startDate: formData.startDate,
      endDate: formData.current ? undefined : formData.endDate,
      description: formData.description,
      points: formData.points,
      displayOrder: formData.displayOrder,
    };
    if (isEditing) {
      onUpdate(isEditing, submissionData);
      setIsEditing(null);
    } else {
      onAdd({ id: generateId(), ...submissionData });
    }
    setFormData(initialFormState);
    setIsDialogOpen(false);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setIsDialogOpen(false);
    setIsEditing(null);
    setErrors({});
  };

  const handleEdit = (item: EducationItem) => {
    setFormData({
      institution: item.institution,
      degree: item.degree,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description,
      points: item.points,
      displayOrder: item.displayOrder,
      current: !item.endDate,
    });
    setIsEditing(item.id);
    setIsDialogOpen(true);
    setErrors({});
  };

  const openDeleteDialog = (id: string) => setDeleteId(id);

  const confirmDelete = () => {
    if (deleteId) {
      onRemove(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr,auto] gap-4 items-start mb-1">
        <div className="space-y-0.5">
          {title && (
            <h2 className="text-xl font-semibold leading-none">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Button size="sm" onClick={() => setIsDialogOpen(true)} className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Education" : "Add Education"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your education information."
                : "Add a new education entry to your resume."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-sm">
                  Institution <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="University or school name"
                  className={errors.institution ? "border-destructive" : ""}
                />
                {errors.institution && (
                  <p className="text-xs text-destructive">
                    {errors.institution}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="degree" className="text-sm">
                  Degree <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="Enter your degree"
                  className={errors.degree ? "border-destructive" : ""}
                />
                {errors.degree && (
                  <p className="text-xs text-destructive">{errors.degree}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="month"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={errors.startDate ? "border-destructive" : ""}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm">
                  End Date{" "}
                  {!formData.current && (
                    <span className="text-destructive">*</span>
                  )}
                </Label>
                <Input
                  type="month"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate || ""}
                  onChange={handleChange}
                  disabled={formData.current}
                  className={errors.endDate ? "border-destructive" : ""}
                />
                {errors.endDate && (
                  <p className="text-xs text-destructive">{errors.endDate}</p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="current"
                    checked={formData.current}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="current" className="text-sm">
                    Currently studying here
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Description & Key Points</Label>
              <ListContentEditor
                description={formData.description}
                onDescriptionChange={(description) =>
                  setFormData((prev) => ({ ...prev, description }))
                }
                bulletPoints={formData.points}
                onAdd={(bullet) =>
                  setFormData((prev) => ({
                    ...prev,
                    points: [...prev.points, bullet],
                  }))
                }
                onUpdate={(index, text) =>
                  setFormData((prev) => ({
                    ...prev,
                    points: prev.points.map((b, i) => (i === index ? text : b)),
                  }))
                }
                onRemove={(index) =>
                  setFormData((prev) => ({
                    ...prev,
                    points: prev.points.filter((_, i) => i !== index),
                  }))
                }
                onReorder={(newOrder) =>
                  setFormData((prev) => ({ ...prev, points: newOrder }))
                }
                showDescription={true}
                descriptionLabel="Description"
                descriptionPlaceholder="Brief description of your education"
                bulletPlaceholder="Add a key point or achievement"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {education.length > 0 && (
        <div className="grid gap-1.5">
          {education.map((item) => (
            <Card key={item.id} className="group overflow-hidden shadow-sm">
              <CardContent className="p-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                      <h3 className="font-medium leading-none">
                        {item.degree ? formatEnumValue(item.degree) : ""} •{" "}
                        {item.institution}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(item.startDate)} -{" "}
                      {item.endDate ? formatDate(item.endDate) : "Present"}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => openDeleteDialog(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1 leading-snug">
                    {item.description}
                  </p>
                )}
                {item.points && item.points.length > 0 && (
                  <ul className="list-disc pl-4 mt-1 text-sm text-muted-foreground leading-snug">
                    {item.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Education</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this education entry? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
