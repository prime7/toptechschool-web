import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { SkillItem } from '../types';
import { generateId } from '../utils';
import { Plus, Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const emptySkill: Omit<SkillItem, 'id'> = {
  name: '',
  level: 'intermediate'
};

const SkillsEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<SkillItem, 'id'>>(emptySkill);

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLevelChange = (value: string) => {
    setFormData(prev => ({ ...prev, level: value as 'beginner' | 'intermediate' | 'advanced' | 'expert' }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (isEditing) {
      dispatch({
        type: 'UPDATE_SKILL',
        payload: { id: isEditing, data: formData }
      });
      setIsEditing(null);
    } else {
      dispatch({
        type: 'ADD_SKILL',
        payload: { id: generateId(), ...formData }
      });
    }
    setFormData(emptySkill);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setFormData(emptySkill);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEdit = (item: SkillItem) => {
    setFormData({
      name: item.name,
      level: item.level
    });
    setIsEditing(item.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'REMOVE_SKILL', payload: id });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Skills</h2>
      <p className="text-sm text-muted-foreground">
        Add technical skills, soft skills, tools, and technologies you're proficient with.
      </p>

      {!isAdding && (
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Skill
        </Button>
      )}

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Skill' : 'Add Skill'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="JavaScript, Project Management, etc."
                />
              </div>

              <div>
                <Label htmlFor="level">Proficiency Level</Label>
                <Select value={formData.level} onValueChange={handleLevelChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map((level, idx) => (
                      <SelectItem key={idx} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.skills && state.skills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {state.skills.map((item, idx) => (
            <Card key={idx} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{item.name}</span>
                  <Badge variant="secondary" className="mt-1 px-2 w-fit">
                    {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsEditor;