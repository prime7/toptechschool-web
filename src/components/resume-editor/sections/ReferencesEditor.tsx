import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { ReferenceItem } from '../types';
import { generateId } from '../utils';
import { Plus, Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const emptyReference: Omit<ReferenceItem, 'id'> = {
  name: '',
  position: '',
  company: '',
  email: '',
  phone: ''
};

const ReferencesEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ReferenceItem, 'id'>>(emptyReference);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      dispatch({
        type: 'UPDATE_REFERENCE',
        payload: { id: isEditing, data: formData }
      });
      setIsEditing(null);
    } else {
      dispatch({
        type: 'ADD_REFERENCE',
        payload: { id: generateId(), ...formData }
      });
    }
    setFormData(emptyReference);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setFormData(emptyReference);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEdit = (item: ReferenceItem) => {
    setFormData({
      name: item.name,
      position: item.position,
      company: item.company,
      email: item.email,
      phone: item.phone || ''
    });
    setIsEditing(item.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this reference?')) {
      dispatch({ type: 'REMOVE_REFERENCE', payload: id });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">References</h2>
      <p className="text-muted-foreground text-sm">
        Add professional references who can vouch for your skills and experience.
      </p>

      {!isAdding && (
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Reference
        </Button>
      )}

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Reference' : 'Add Reference'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
              />
              <Input
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Position"
              />
              <Input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company"
              />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone (optional)"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.references && state.references.length > 0 && !isAdding && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.references.map((item, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.position} at {item.company}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.email}</p>
                  {item.phone && <p className="text-sm text-muted-foreground">{item.phone}</p>}
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferencesEditor;
