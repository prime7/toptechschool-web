import React, { useState } from "react";
import { WorkItem } from "../types";
import { Plus, Trash2, Pencil, Briefcase } from "lucide-react";
import { generateId } from "../utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BulletPointEditor } from "./BulletPointEditor";
import { Textarea } from "@/components/ui/textarea";
import { EmploymentType, JobRole, LocationType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatEnumValue } from "@/lib/utils";

interface WorkEditorProps {
  work: WorkItem[];
  onAdd: (work: WorkItem) => void;
  onUpdate: (id: string, data: Omit<WorkItem, "id">) => void;
  onRemove: (id: string) => void;
  title?: string;
  description?: string;
}

interface FormData extends Omit<WorkItem, "id"> {
  current?: boolean;
}

export function WorkEditor({
  work,
  onAdd,
  onUpdate,
  onRemove,
  title = "Work Experience",
  description = "Add your work experience, including your roles, responsibilities, and achievements.",
}: WorkEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialFormState: FormData = {
    company: "",
    position: null,
    location: null,
    employmentType: null,
    startDate: "",
    endDate: undefined,
    description: "",
    points: [],
    displayOrder: 0,
    current: false,
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (checked && errors.endDate) setErrors((prev) => ({ ...prev, endDate: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.current && !formData.endDate) newErrors.endDate = "End date is required if not currently working";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const submissionData: Omit<WorkItem, "id"> = {
      company: formData.company,
      position: formData.position,
      location: formData.location,
      employmentType: formData.employmentType,
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
    setIsAdding(false);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setIsAdding(false);
    setIsEditing(null);
    setErrors({});
  };

  const handleEdit = (item: WorkItem) => {
    setFormData({
      company: item.company,
      position: item.position,
      location: item.location,
      employmentType: item.employmentType,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description,
      points: item.points,
      displayOrder: item.displayOrder,
      current: !item.endDate,
    });
    setIsEditing(item.id);
    setIsAdding(true);
    setErrors({});
  };

  const openDeleteDialog = (id: string) => setDeleteId(id);

  const confirmDelete = () => {
    if (deleteId) {
      onRemove(deleteId);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        {(title || description) && (
          <div className="space-y-0.5">
            {title && <h2 className="text-xl font-semibold leading-none">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground leading-snug">{description}</p>}
          </div>
        )}
        {!isAdding && (
          <Button size="sm" onClick={() => setIsAdding(true)} className="h-8">
            <Plus className="h-4 w-4 mr-1" />Add Work Experience
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-base font-medium">{isEditing ? "Edit Work Experience" : "Add Work Experience"}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="company" className="text-sm">Company <span className="text-destructive">*</span></Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  className={`h-8 ${errors.company ? "border-destructive" : ""}`}
                />
                {errors.company && <p className="text-xs text-destructive mt-0.5">{errors.company}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="position" className="text-sm">Position <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.position || "" }
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, position: value as JobRole }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(JobRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {formatEnumValue(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position && <p className="text-xs text-destructive mt-0.5">{errors.position}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="location" className="text-sm">Location</Label>
                <Select
                  value={formData.location || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value as LocationType }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(LocationType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatEnumValue(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="employmentType" className="text-sm">Employment Type</Label>
                <Select
                  value={formData.employmentType || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, employmentType: value as EmploymentType }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EmploymentType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatEnumValue(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="startDate" className="text-sm">Start Date <span className="text-destructive">*</span></Label>
                <Input
                  type="month"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`h-8 ${errors.startDate ? "border-destructive" : ""}`}
                />
                {errors.startDate && <p className="text-xs text-destructive mt-0.5">{errors.startDate}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="endDate" className="text-sm">End Date {!formData.current && <span className="text-destructive">*</span>}</Label>
                <Input
                  type="month"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate || ""}
                  onChange={handleChange}
                  disabled={formData.current}
                  className={`h-8 ${errors.endDate ? "border-destructive" : ""}`}
                />
                {errors.endDate && <p className="text-xs text-destructive mt-0.5">{errors.endDate}</p>}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Checkbox id="current" checked={formData.current} onCheckedChange={handleCheckboxChange} className="h-3.5 w-3.5" />
                  <Label htmlFor="current" className="text-xs">Currently working here</Label>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your role and responsibilities"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="points" className="text-sm">Key Achievements & Responsibilities</Label>
              <BulletPointEditor
                bulletPoints={formData.points}
                onAdd={(bullet) => setFormData((prev) => ({ ...prev, points: [...prev.points, bullet] }))}
                onUpdate={(index, text) => setFormData((prev) => ({ ...prev, points: prev.points.map((b, i) => (i === index ? text : b)) }))}
                onRemove={(index) => setFormData((prev) => ({ ...prev, points: prev.points.filter((_, i) => i !== index) }))}
                onReorder={(newOrder) => setFormData((prev) => ({ ...prev, points: newOrder }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={handleCancel} className="h-7">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} className="h-7">{isEditing ? "Update" : "Save"}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {work.length > 0 && !isAdding && (
        <div className="grid gap-1.5">
          {work.map((item) => (
            <Card key={item.id} className="group overflow-hidden bg-card shadow-sm">
              <CardContent className="p-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-primary shrink-0" />
                      <h3 className="font-medium leading-none">
                        {item.position ? formatEnumValue(item.position) : ''} • {item.company}
                      </h3>
                    </div>
                    {item.location && (
                      <p className="text-sm text-muted-foreground mt-0.5">{formatEnumValue(item.location)}</p>
                    )}
                    {item.employmentType && (
                      <span className="inline-block text-xs bg-muted px-2 py-0.5 rounded-full mt-1">
                        {formatEnumValue(item.employmentType)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : "Present"}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive hover:bg-destructive/10" onClick={() => openDeleteDialog(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1 leading-snug">{item.description}</p>
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Work Experience</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this work experience entry? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
