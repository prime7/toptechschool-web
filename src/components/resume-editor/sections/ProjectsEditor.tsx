import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { ProjectItem } from '../types';
import { generateId } from '../utils';
import { Plus, Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const emptyProject: Omit<ProjectItem, 'id'> = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  url: '',
  highlights: []
};

const ProjectsEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newHighlight, setNewHighlight] = useState('');
  const [formData, setFormData] = useState<Omit<ProjectItem, 'id'>>(emptyProject);

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
        type: 'UPDATE_PROJECT',
        payload: { id: isEditing, data: formData }
      });
      setIsEditing(null);
    } else {
      dispatch({
        type: 'ADD_PROJECT',
        payload: { id: generateId(), ...formData }
      });
    }
    setFormData(emptyProject);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setFormData(emptyProject);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEdit = (item: ProjectItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      startDate: item.startDate,
      endDate: item.endDate,
      url: item.url || '',
      highlights: [...item.highlights]
    });
    setIsEditing(item.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      dispatch({ type: 'REMOVE_PROJECT', payload: id });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Projects</h2>
      <p className="text-muted-foreground text-sm">
        Add notable projects you've worked on, including personal, academic, and professional projects.
      </p>

      {!isAdding && (
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      )}

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Project' : 'Add Project'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Project name"
                />
              </div>
              <Input
                type="month"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
              <Input
                type="month"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <Input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the project, its purpose, and your role"
                />
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">Key Highlights</p>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                  placeholder="Add a key feature"
                />
                <Button onClick={handleAddHighlight}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center">
                    {highlight}
                    <X
                      className="ml-1 w-3 h-3 cursor-pointer"
                      onClick={() => handleRemoveHighlight(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.projects.length > 0 && !isAdding && (
        <ScrollArea className="space-y-4">
          {state.projects.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.startDate).toLocaleDateString('default', { month: 'short', year: 'numeric' })} - {' '}
                    {new Date(item.endDate).toLocaleDateString('default', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              {item.highlights.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                  {item.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                >
                  View Project
                </a>
              )}
            </Card>
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default ProjectsEditor;
