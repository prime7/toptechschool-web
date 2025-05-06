import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { EducationItem } from '../types';
import { Plus, Trash, Edit } from 'lucide-react';
import { generateId } from '../utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { MarkdownPreview } from '@/components/ui/markdown-preview';

const emptyEducation: Omit<EducationItem, 'id'> = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  current: false,
  content: '',
  gpa: ''
};

const EducationEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<EducationItem, 'id'>>(emptyEducation);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, current: checked }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      dispatch({
        type: 'UPDATE_EDUCATION',
        payload: { id: isEditing, data: formData }
      });
      setIsEditing(null);
    } else {
      dispatch({
        type: 'ADD_EDUCATION',
        payload: { id: generateId(), ...formData }
      });
    }
    setFormData(emptyEducation);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setFormData(emptyEducation);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEdit = (item: EducationItem) => {
    setFormData({
      institution: item.institution,
      degree: item.degree,
      field: item.field,
      startDate: item.startDate,
      endDate: item.endDate,
      current: item.current,
      content: item.content,
      gpa: item.gpa || ''
    });
    setIsEditing(item.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'REMOVE_EDUCATION', payload: id });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Education</h2>
          <p className="text-sm text-muted-foreground">
            Add your educational background, including degrees, certifications, and relevant coursework.
          </p>
        </div>
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
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="University or school name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="Bachelor of Science, Certificate, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="field">Field of Study</Label>
                <Input
                  id="field"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  placeholder="Computer Science, Business, etc."
                />
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
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="month"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="month"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={formData.current}
                />
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
              <MarkdownEditor
                id="content"
                value={formData.content}
                onChange={(value: string) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Describe your education, achievements, or relevant coursework"
                minHeight={200}
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
      
      {state.education && state.education.length > 0 && !isAdding && (
        <div className="space-y-4">
          {state.education.map((item, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{item.degree} in {item.field}</h3>
                    <p className="text-muted-foreground">{item.institution}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.startDate).toLocaleDateString('default', { month: 'short', year: 'numeric' })} - {' '}
                      {item.current ? 'Present' : new Date(item.endDate).toLocaleDateString('default', { month: 'short', year: 'numeric' })}
                    </p>
                    {item.gpa && <p className="text-sm text-muted-foreground">GPA: {item.gpa}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the education entry.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {item.content && (
                  <MarkdownPreview 
                    content={item.content} 
                    className="mt-2 text-sm text-muted-foreground" 
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationEditor;