import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { LanguageItem } from '../types';
import { generateId } from '../utils';
import { Plus, Trash, Edit } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';

const emptyLanguage: Omit<LanguageItem, 'id'> = {
  language: '',
  proficiency: 'professional'
};

const proficiencyLevels = [
  { value: 'elementary', label: 'Elementary' },
  { value: 'limited', label: 'Limited Working' },
  { value: 'professional', label: 'Professional Working' },
  { value: 'full', label: 'Full Professional' },
  { value: 'native', label: 'Native / Bilingual' }
];

const LanguagesEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<LanguageItem, 'id'>>(emptyLanguage);

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.language.trim()) return;

    if (isEditing) {
      dispatch({
        type: 'UPDATE_LANGUAGE',
        payload: { id: isEditing, data: formData }
      });
      setIsEditing(null);
    } else {
      dispatch({
        type: 'ADD_LANGUAGE',
        payload: { id: generateId(), ...formData }
      });
    }

    setFormData(emptyLanguage);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setFormData(emptyLanguage);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEdit = (item: LanguageItem) => {
    setFormData({
      language: item.language,
      proficiency: item.proficiency
    });
    setIsEditing(item.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'REMOVE_LANGUAGE', payload: id });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Languages</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add languages you speak and your proficiency level.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Language
            </Button>
          )}

          {isAdding && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Language' : 'Add Language'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    placeholder="e.g. English, Spanish"
                  />
                </div>
                <div>
                  <Label htmlFor="proficiency">Proficiency Level</Label>
                  <Select
                    value={formData.proficiency}
                    onValueChange={(value) => handleChange('proficiency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {isEditing ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          )}

          {state.languages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {state.languages.map((item) => (
                <Card key={item.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">{item.language}</div>
                    <div className="text-sm text-muted-foreground">
                      {
                        proficiencyLevels.find((level) => level.value === item.proficiency)?.label ||
                        item.proficiency
                      }
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguagesEditor;
