import type { Meta, StoryObj } from '@storybook/react';
import { ListContentEditor } from '../ListContentEditor';
import { useState } from 'react';

const meta: Meta<typeof ListContentEditor> = {
  title: 'Resume/ListContentEditor',
  component: ListContentEditor,
  parameters: { layout: 'padded' },
  argTypes: {
    bulletPoints: {
      description: 'Array of bullet point strings',
      control: { type: 'object' }
    },
    descriptionLabel: {
      description: 'Label for the description field',
      control: { type: 'text' }
    },
    bulletPlaceholder: {
      description: 'Placeholder text for bullet point inputs',
      control: { type: 'text' }
    },
    addButtonText: {
      description: 'Text for the add button',
      control: { type: 'text' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof ListContentEditor>;

// Just bullet points (like original BulletPointEditor)
const BulletPointsOnlyTemplate = () => {
  const [bulletPoints, setBulletPoints] = useState([
    'Developed responsive web applications using React and TypeScript',
    'Implemented RESTful APIs with Node.js and Express',
    'Collaborated with cross-functional teams in Agile environment'
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
    <ListContentEditor
      bulletPoints={bulletPoints}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      onReorder={handleReorder}
      showDescription={false}
    />
  );
};

// Empty state
const EmptyTemplate = () => {
  const [description, setDescription] = useState('');
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
    <ListContentEditor
      showDescription={true}
      description={description}
      onDescriptionChange={setDescription}
      descriptionLabel="Description"
      descriptionPlaceholder="Enter description..."
      bulletPoints={bulletPoints}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      onReorder={handleReorder}
    />
  );
};

// Custom styling example
const CustomTemplate = () => {
  const [description, setDescription] = useState('Project Summary');
  const [bulletPoints, setBulletPoints] = useState([
    'Built a full-stack e-commerce platform',
    'Integrated payment processing with Stripe'
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

  return (
    <ListContentEditor
      showDescription={true}
      description={description}
      onDescriptionChange={setDescription}
      descriptionLabel="Project Name"
      descriptionPlaceholder="Enter project name..."
      bulletPoints={bulletPoints}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      bulletPlaceholder="Add project detail"
      addButtonText="Add Detail"
      className="border rounded-lg p-4 bg-gray-50"
    />
  );
};

export const BulletPointsOnly: Story = {
  render: () => <BulletPointsOnlyTemplate />
};

export const Empty: Story = {
  render: () => <EmptyTemplate />
};

export const CustomStyling: Story = {
  render: () => <CustomTemplate />
}; 