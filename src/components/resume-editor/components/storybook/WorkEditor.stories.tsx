import type { Meta, StoryObj } from '@storybook/react';
import { WorkEditor } from '../WorkEditor';
import { useState } from 'react';
import { WorkItem } from '../../types';
import { EmploymentType, JobRole, LocationType } from '@prisma/client';

const meta: Meta<typeof WorkEditor> = {
  title: 'Resume/WorkEditor',
  component: WorkEditor,
  parameters: { layout: 'padded' }
};

export default meta;
type Story = StoryObj<typeof WorkEditor>;

const WorkEditorWithState = () => {
  const [work, setWork] = useState<WorkItem[]>([{
    id: '1',
    company: 'Google',
    position: JobRole.SOFTWARE_ENGINEER,
    location: LocationType.REMOTE,
    employmentType: EmploymentType.FULL_TIME,
    startDate: '2020-01',
    endDate: '2023-12',
    displayOrder: 0,
    description: `Led a team of engineers developing Google's next-generation search infrastructure. Focused on scalability, performance optimization, and implementing machine learning algorithms to improve search relevance.`,
    points: [
      'Led development of new search ranking algorithm improving relevance by 15%',
      'Managed team of 5 engineers and coordinated with cross-functional teams',
      'Reduced infrastructure costs by 25% through optimization initiatives'
    ]
  }]);

  const handleAdd = (newItem: WorkItem) => {
    setWork([...work, newItem]);
  };

  const handleUpdate = (id: string, data: Omit<WorkItem, 'id'>) => {
    setWork(work.map(item => item.id === id ? { id, ...data } : item));
  };

  const handleRemove = (id: string) => {
    setWork(work.filter(item => item.id !== id));
  };

  return (
    <WorkEditor
      work={work}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
    />
  );
};

export const Default: Story = {
  render: () => <WorkEditorWithState />
};
