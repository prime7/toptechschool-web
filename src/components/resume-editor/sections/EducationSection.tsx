import React from 'react';
import { useResume } from '../context/ResumeContext';
import { EducationEditor } from '../components/EducationEditor';
import { EducationItem } from '../types';

const EducationSection: React.FC = () => {
  const { state, dispatch } = useResume();

  const handleAddEducation = (education: EducationItem) => {
    dispatch({
      type: 'ADD_EDUCATION',
      payload: education
    });
  };

  const handleUpdateEducation = (id: string, data: Omit<EducationItem, 'id'>) => {
    dispatch({
      type: 'UPDATE_EDUCATION',
      payload: { id, data }
    });
  };

  const handleRemoveEducation = (id: string) => {
    dispatch({
      type: 'REMOVE_EDUCATION',
      payload: id
    });
  };

  return (
    <EducationEditor
      education={state.education || []}
      onAdd={handleAddEducation}
      onUpdate={handleUpdateEducation}
      onRemove={handleRemoveEducation}
    />
  );
};

export default EducationSection; 