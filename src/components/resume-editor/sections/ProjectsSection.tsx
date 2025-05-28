import React from 'react';
import { useResume } from '../context/ResumeContext';
import ProjectsEditor from '../components/ProjectsEditor';
import { ProjectItem } from '../types';

const ProjectsSection: React.FC = () => {
  const { state, dispatch } = useResume();

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

  return (
    <ProjectsEditor
      projects={state.projects || []}
      onAdd={handleAddProject}
      onUpdate={handleUpdateProject}
      onRemove={handleRemoveProject}
    />
  );
};

export default ProjectsSection;
