import type { Meta, StoryObj } from '@storybook/react';
import ProjectsEditor from '../ProjectsEditor';
import { ResumeProvider } from '../../context/ResumeContext';
import { generateId } from '../../utils';
import { ProjectItem, SectionType, ResumeData } from '../../types';
import { defaultStyle } from '../../constants';

const meta: Meta<typeof ProjectsEditor> = {
  title: 'Resume/ProjectsEditor',
  component: ProjectsEditor,
  parameters: { layout: 'padded' }
};

export default meta;
type Story = StoryObj<typeof ProjectsEditor>;

const mockProjects: ProjectItem[] = [
  {
    id: generateId(),
    name: 'E-commerce Platform',
    description: 'Developed a full-featured e-commerce platform using React, Node.js, and MongoDB. Built with modern web technologies and focused on performance optimization.',
    points: [
      'Implemented user authentication and authorization system',
      'Created responsive product catalog with search and filtering',
      'Built shopping cart and secure checkout process',
      'Developed admin dashboard for inventory and order management'
    ],
    url: 'https://github.com/johndoe/ecommerce',
    displayOrder: 0,
  },
  {
    id: generateId(),
    name: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team collaboration features.',
    points: [
      'Real-time collaboration using WebSocket connections',
      'Drag-and-drop task organization with React DnD',
      'Advanced filtering and search capabilities',
      'Mobile-responsive design with PWA features'
    ],
    url: 'https://taskmanager.example.com',
    displayOrder: 1,
  }
];

const ProjectsEditorWithProvider = () => {
  const initialData: ResumeData = {
    activeSections: ['personal', 'summary', 'work', 'education', 'projects'] as SectionType[],
    personal: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      profession: 'Senior Software Engineer',
      website: 'https://johndoe.dev',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
    },
    summary: 'Experienced software engineer with expertise in full-stack development.',
    work: [],
    education: [],
    projects: mockProjects,
    style: defaultStyle,
  };

  return (
    <ResumeProvider initialState={initialData}>
      <ProjectsEditor
        projects={mockProjects}
        onAdd={() => {}}
        onUpdate={() => {}}
        onRemove={() => {}}
      />
    </ResumeProvider>
  );
};

export const Default: Story = {
  render: () => <ProjectsEditorWithProvider />
};

export const Empty: Story = {
  render: () => {
    const emptyData: ResumeData = {
      activeSections: ['personal', 'summary', 'work', 'education', 'projects'] as SectionType[],
      personal: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        profession: 'Senior Software Engineer',
      },
      summary: 'Experienced software engineer with expertise in full-stack development.',
      work: [],
      education: [],
      projects: [],
      style: defaultStyle,
    };

    return (
      <ResumeProvider initialState={emptyData}>
        <ProjectsEditor
          projects={[]}
          onAdd={() => {}}
          onUpdate={() => {}}
          onRemove={() => {}}
        />
      </ResumeProvider>
    );
  }
};
