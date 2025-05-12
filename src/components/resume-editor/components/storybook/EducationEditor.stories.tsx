import type { Meta, StoryObj } from '@storybook/react';
import { EducationEditor } from '../EducationEditor';
import { useState } from 'react';
import { EducationItem } from '../../types';

const meta: Meta<typeof EducationEditor> = {
  title: 'Resume/EducationEditor',
  component: EducationEditor,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof EducationEditor>;

const EducationEditorWithState = () => {
  const [education, setEducation] = useState<EducationItem[]>([
    {
      id: '1',
      institution: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2018-09',
      endDate: '2022-06',
      current: false,
      gpa: '3.8',
      bulletPoints: [
        'Graduated with honors',
        'Specialized in Artificial Intelligence',
        'Relevant coursework: Machine Learning, Deep Learning, Computer Vision'
      ]
    }
  ]);

  const handleAdd = (newItem: EducationItem) => {
    setEducation([...education, newItem]);
  };

  const handleUpdate = (id: string, data: Omit<EducationItem, 'id'>) => {
    setEducation(education.map(item => 
      item.id === id ? { id, ...data } : item
    ));
  };

  const handleRemove = (id: string) => {
    setEducation(education.filter(item => item.id !== id));
  };

  return (
    <EducationEditor
      education={education}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
    />
  );
};

export const Default: Story = {
  render: () => <EducationEditorWithState />
};