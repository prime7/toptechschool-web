import React from 'react';
import { useResume } from '../context/ResumeContext';
import ProjectsEditor from '../components/ProjectsEditor';
import { ProjectItem } from '../types';
import { Button } from '@/components/ui/button';

const ProjectsSection: React.FC = () => {
  const { state, dispatch, exportUtils } = useResume();

  const handleAddProject = (project: ProjectItem) => {
    dispatch({
      type: 'ADD_PROJECT',
      payload: project
    });
  };

  const handleUpdateProject = (id: string, data: Omit<ProjectItem, 'id'>) => {
    dispatch({
      type: 'UPDATE_PROJECT',
      payload: { id, data }
    });
  };

  const handleRemoveProject = (id: string) => {
    dispatch({
      type: 'REMOVE_PROJECT',
      payload: id
    });
  };

  const handleExport = () => {
    exportUtils.exportSection('projects');
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button onClick={handleExport} size="sm">Export</Button>
      </div>

      <ProjectsEditor
        description="Add notable projects you've worked on, including personal, academic, and professional projects."
        projects={state.projects || []}
        onAdd={handleAddProject}
        onUpdate={handleUpdateProject}
        onRemove={handleRemoveProject}
      />
    </div>
  );
};

export default ProjectsSection;
