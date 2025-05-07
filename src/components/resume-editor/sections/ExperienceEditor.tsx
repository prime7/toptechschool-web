import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { ExperienceItem } from '../types';
import { generateId } from '../utils';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BulletPointEditor } from '../components/BulletPointEditor';

const emptyExperience: Omit<ExperienceItem, 'id'> = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  description: '',
  bulletPoints: []
};

const ExperienceEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ExperienceItem, 'id'>>(emptyExperience);
  const [originalData, setOriginalData] = useState<Omit<ExperienceItem, 'id'>>(emptyExperience);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      dispatch({
        type: 'UPDATE_EXPERIENCE',
        payload: { id: isEditing, data: formData }
      });
      setIsEditing(null);
    } else {
      dispatch({
        type: 'ADD_EXPERIENCE',
        payload: { id: generateId(), ...formData }
      });
    }
    setFormData(emptyExperience);
    setOriginalData(emptyExperience);
    setIsAdding(false);
  };

  const handleCancel = () => {
    if (isEditing) {
      dispatch({
        type: 'UPDATE_EXPERIENCE',
        payload: { id: isEditing, data: originalData }
      });
    }
    setFormData(emptyExperience);
    setOriginalData(emptyExperience);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEdit = (item: ExperienceItem) => {
    const itemData = {
      company: item.company,
      position: item.position,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description || '',
      bulletPoints: item.bulletPoints || []
    };
    setFormData(itemData);
    setOriginalData(itemData);
    setIsEditing(item.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'REMOVE_EXPERIENCE', payload: id });
  };

  const handleAddBullet = (bullet: string) => {
    setFormData(prev => ({
      ...prev,
      bulletPoints: [...prev.bulletPoints, bullet]
    }));
  };

  const handleUpdateBullet = (index: number, text: string) => {
    setFormData(prev => ({
      ...prev,
      bulletPoints: prev.bulletPoints.map((b, i) => i === index ? text : b)
    }));
  };

  const handleRemoveBullet = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bulletPoints: prev.bulletPoints.filter((_, i) => i !== index)
    }));
  };

  const handleReorder = (newOrder: string[]) => {
    setFormData(prev => ({
      ...prev,
      bulletPoints: newOrder
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Work Experience</h2>
          <p className="text-sm text-muted-foreground">
            Add your work history, starting with your most recent position.
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        )}
      </div>
      
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Experience' : 'Add Experience'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Job title"
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
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief overview of your role"
                rows={2}
              />
            </div>
            
            <div className="mt-4 space-y-2">
              <Label>Key Achievements & Responsibilities</Label>
              <BulletPointEditor
                bulletPoints={formData.bulletPoints}
                onAdd={handleAddBullet}
                onUpdate={handleUpdateBullet}
                onRemove={handleRemoveBullet}
                onReorder={handleReorder}
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
      
      {state.experience && state.experience.length > 0 && !isAdding && (
        <div className="space-y-4">
          {state.experience.map((item, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{item.position}</h3>
                    <p className="text-muted-foreground">{item.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.startDate).toLocaleDateString('default', { month: 'short', year: 'numeric' })} - {' '}
                      {item.endDate ? new Date(item.endDate).toLocaleDateString('default', { month: 'short', year: 'numeric' }) : 'Present'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the experience entry.
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
                {item.description && <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>}
                {item.bulletPoints && item.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
                    {item.bulletPoints.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceEditor;