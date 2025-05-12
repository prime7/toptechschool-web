import React, { useState } from 'react';
import { EducationItem } from '../types';
import { Plus, Trash2, Pencil, GraduationCap } from 'lucide-react';
import { generateId } from '../utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BulletPointEditor } from './BulletPointEditor';

interface EducationEditorProps {
  education: EducationItem[];
  onAdd: (education: EducationItem) => void;
  onUpdate: (id: string, data: Omit<EducationItem, 'id'>) => void;
  onRemove: (id: string) => void;
  title?: string;
  description?: string;
}

export function EducationEditor({
  education,
  onAdd,
  onUpdate,
  onRemove,
  title = "Education",
  description = "Add your educational background, including degrees, certifications, and relevant coursework."
}: EducationEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<EducationItem, 'id'>>({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    bulletPoints: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialFormState = {
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    bulletPoints: []
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, current: checked }));
    if (checked && errors.endDate) {
      setErrors(prev => ({ ...prev, endDate: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }
    
    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }
    
    if (!formData.field.trim()) {
      newErrors.field = 'Field of study is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.current && !formData.endDate) {
      newErrors.endDate = 'End date is required if not currently studying';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    if (isEditing) {
      onUpdate(isEditing, formData);
      setIsEditing(null);
    } else {
      onAdd({ id: generateId(), ...formData });
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

  const handleEdit = (item: EducationItem) => {
    setFormData({
      institution: item.institution,
      degree: item.degree,
      field: item.field,
      startDate: item.startDate,
      endDate: item.endDate,
      current: item.current,
      gpa: item.gpa || '',
      bulletPoints: item.bulletPoints || []
    });
    setIsEditing(item.id);
    setIsAdding(true);
    setErrors({});
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onRemove(deleteId);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('default', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {(title || description) && (
          <div>
            {title && <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>}
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        )}
      </div>
      
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Education' : 'Add Education'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution" className="flex">
                  Institution <span className="text-destructive ml-1">*</span>
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
                  <p className="text-xs text-destructive">{errors.institution}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="degree" className="flex">
                  Degree <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="Bachelor of Science, Certificate, etc."
                  className={errors.degree ? "border-destructive" : ""}
                />
                {errors.degree && (
                  <p className="text-xs text-destructive">{errors.degree}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="field" className="flex">
                  Field of Study <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="field"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  placeholder="Computer Science, Business, etc."
                  className={errors.field ? "border-destructive" : ""}
                />
                {errors.field && (
                  <p className="text-xs text-destructive">{errors.field}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA (Optional)</Label>
                <Input
                  id="gpa"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="3.8"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex">
                  Start Date <span className="text-destructive ml-1">*</span>
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
                <Label htmlFor="endDate" className="flex">
                  End Date {!formData.current && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Input
                  type="month"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={formData.current}
                  className={errors.endDate ? "border-destructive" : ""}
                />
                {errors.endDate && (
                  <p className="text-xs text-destructive">{errors.endDate}</p>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="current"
                    checked={formData.current}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="current">I am currently studying here</Label>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="content">Description</Label>
              <BulletPointEditor
                bulletPoints={formData.bulletPoints || []}
                onAdd={(bullet) => setFormData(prev => ({ ...prev, bulletPoints: [...prev.bulletPoints, bullet] }))}
                onUpdate={(index, text) => setFormData(prev => ({ ...prev, bulletPoints: prev.bulletPoints.map((b, i) => i === index ? text : b) }))}
                onRemove={(index) => setFormData(prev => ({ ...prev, bulletPoints: prev.bulletPoints.filter((_, i) => i !== index) }))}
                onReorder={(newOrder) => setFormData(prev => ({ ...prev, bulletPoints: newOrder }))}
              />
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {education.length > 0 && !isAdding && (
        <div className="grid gap-4">
          {education.map((item) => (
            <Card key={item.id} className="group overflow-hidden bg-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-foreground">{item.degree} in {item.field}</h3>
                    </div>
                    <p className="text-muted-foreground">{item.institution}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}
                    </p>
                    {item.gpa && <p className="text-sm text-muted-foreground">GPA: {item.gpa}</p>}
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => openDeleteDialog(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                
                {item.bulletPoints && item.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                    {item.bulletPoints.map((point, i) => (
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
            <AlertDialogTitle>Delete Education</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this education entry? This action cannot be undone.
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
