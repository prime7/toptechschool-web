import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { ExperienceItem } from '../types';
import { generateId } from '../utils';
import { Plus, Trash2, Pencil, X, Building, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

const emptyExperience: Omit<ExperienceItem, 'id'> = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  highlights: []
};

const ExperienceEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newHighlight, setNewHighlight] = useState('');
  const [formData, setFormData] = useState<Omit<ExperienceItem, 'id'>>(emptyExperience);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
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
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setFormData(emptyExperience);
    setIsModalOpen(false);
    setIsEditing(null);
  };

  const handleEdit = (item: ExperienceItem) => {
    setFormData({
      company: item.company,
      position: item.position,
      startDate: item.startDate,
      endDate: item.endDate,
      current: item.current,
      description: item.description,
      highlights: [...item.highlights]
    });
    setIsEditing(item.id);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      dispatch({ type: 'REMOVE_EXPERIENCE', payload: deleteId });
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('default', { month: 'short', year: 'numeric' });
  };

  const addNewExperience = () => {
    setIsEditing(null);
    setFormData(emptyExperience);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Work Experience</h2>
        <p className="text-muted-foreground mt-1">
          Add your work history, starting with your most recent position.
        </p>
      </div>

      <Button onClick={addNewExperience} variant="default" size="sm" className="flex gap-1">
        <Plus className="h-4 w-4" />
        <span>Add Experience</span>
      </Button>

      {state.experience.length === 0 && !isModalOpen && (
        <Alert className="bg-muted/50 text-muted-foreground border border-dashed border-muted">
          <Building className="h-4 w-4" />
          <AlertDescription>
            You haven't added any work experience yet. Add your work history to showcase your professional background.
          </AlertDescription>
        </Alert>
      )}

      {state.experience.length > 0 && (
        <div className="grid gap-4">
          {state.experience.map((item) => (
            <Card key={item.id} className="group overflow-hidden bg-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium text-foreground">{item.position}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{item.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}
                      </span>
                    </div>
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

                {item.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                )}

                {item.highlights.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {item.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
            <DialogDescription>
              Enter your work experience details below
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Job title"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="month"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
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
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, current: checked === true }))
                    }
                  />
                  <Label htmlFor="current" className="text-sm font-normal">
                    I currently work here
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe your role and responsibilities"
              />
            </div>

            <div className="grid gap-2">
              <Label>Key Achievements</Label>
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add a key achievement"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                />
                <Button onClick={handleAddHighlight} type="button">
                  Add
                </Button>
              </div>

              {formData.highlights.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {formData.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <span className="flex-1 text-sm">{highlight}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => handleRemoveHighlight(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this experience? This action cannot be undone.
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
};

export default ExperienceEditor;