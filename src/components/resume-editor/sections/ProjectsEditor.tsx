import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { ProjectItem } from '../types';
import { generateId } from '../utils';
import { Plus, Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BulletPointEditor } from '../components/BulletPointEditor';
import { Textarea } from '@/components/ui/textarea';

const emptyProject: Omit<ProjectItem, 'id'> = {
  name: '',
  description: '',
  bulletPoints: [],
  url: ''
};

const ProjectsEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ProjectItem, 'id'>>(emptyProject);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      bulletPoints: item.bulletPoints,
      url: item.url || ''
    });
    setIsEditing(item.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch({ type: 'REMOVE_PROJECT', payload: id });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Projects</h2>
      <p className="text-muted-foreground text-sm">
        Add notable projects you&apos;ve worked on, including personal, academic, and professional projects.
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
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Describe the project, its purpose, and your role"
                  className="min-h-[200px]"
                />
              </div>
              <div className="md:col-span-2">
                <BulletPointEditor
                  bulletPoints={formData.bulletPoints || []}
                  onAdd={(bullet) => setFormData(prev => ({ ...prev, bulletPoints: [...prev.bulletPoints, bullet] }))}
                  onUpdate={(index, text) => setFormData(prev => ({ ...prev, bulletPoints: prev.bulletPoints.map((b, i) => i === index ? text : b) }))}
                  onRemove={(index) => setFormData(prev => ({ ...prev, bulletPoints: prev.bulletPoints.filter((_, i) => i !== index) }))}
                  onReorder={(newOrder) => setFormData(prev => ({ ...prev, bulletPoints: newOrder }))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.projects && state.projects.length > 0 && !isAdding && (
        <div className="space-y-4 mt-4">
          {state.projects.map((item, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">
                      {item.name}
                    </h3>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                        {item.url}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {item.description && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </div>
                )}
                
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
    </div>
  );
};

export default ProjectsEditor;
