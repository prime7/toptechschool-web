import type { Meta, StoryObj } from '@storybook/react';
import { BulletPointEditor } from '../BulletPointEditor';
import { useState } from 'react';

const meta: Meta<typeof BulletPointEditor> = {
  title: 'Resume/BulletPointEditor',
  component: BulletPointEditor,
  parameters: { layout: 'padded' },
  argTypes: {
    bulletPoints: {
      description: 'Array of bullet point strings',
      control: { type: 'object' }
    },
    onAdd: {
      description: 'Callback when a new bullet point is added',
      action: 'onAdd'
    },
    onUpdate: {
      description: 'Callback when a bullet point is updated',
      action: 'onUpdate'
    },
    onRemove: {
      description: 'Callback when a bullet point is removed',
      action: 'onRemove'
    },
    onReorder: {
      description: 'Optional callback for reordering bullet points',
      action: 'onReorder'
    }
  }
};

export default meta;
type Story = StoryObj<typeof BulletPointEditor>;

const DefaultTemplate = () => {
  const [bulletPoints, setBulletPoints] = useState([
    'Developed responsive web applications using React and TypeScript',
    'Implemented RESTful APIs with Node.js and Express',
    'Collaborated with cross-functional teams in Agile environment',
    'Optimized application performance resulting in 40% faster load times'
  ]);

  const handleAdd = (bullet: string) => {
    setBulletPoints(prev => [...prev, bullet]);
  };

  const handleUpdate = (index: number, text: string) => {
    setBulletPoints(prev => prev.map((item, i) => i === index ? text : item));
  };

  const handleRemove = (index: number) => {
    setBulletPoints(prev => prev.filter((_, i) => i !== index));
  };

  const handleReorder = (newOrder: string[]) => {
    setBulletPoints(newOrder);
  };

  return (
    <BulletPointEditor
      bulletPoints={bulletPoints}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      onReorder={handleReorder}
    />
  );
};

const EmptyTemplate = () => {
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);

  const handleAdd = (bullet: string) => {
    setBulletPoints(prev => [...prev, bullet]);
  };

  const handleUpdate = (index: number, text: string) => {
    setBulletPoints(prev => prev.map((item, i) => i === index ? text : item));
  };

  const handleRemove = (index: number) => {
    setBulletPoints(prev => prev.filter((_, i) => i !== index));
  };

  const handleReorder = (newOrder: string[]) => {
    setBulletPoints(newOrder);
  };

  return (
    <BulletPointEditor
      bulletPoints={bulletPoints}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      onReorder={handleReorder}
    />
  );
};

export const Default: Story = {
  render: () => <DefaultTemplate />
};

export const Empty: Story = {
  render: () => <EmptyTemplate />
};
