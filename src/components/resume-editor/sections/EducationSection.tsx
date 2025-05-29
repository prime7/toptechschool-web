import React from 'react';
import { useResume } from '../context/ResumeContext';
import { EducationEditor } from '../components/EducationEditor';
import { EducationItem } from '../types';
import { Button } from '@/components/ui/button';

const EducationSection: React.FC = () => {
  const { state, dispatch, exportUtils } = useResume();

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

  const handleExport = () => {
    exportUtils.exportSection('education');
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button onClick={handleExport} size="sm">Export</Button>
      </div>

      <EducationEditor
        description="Add your educational background, including degrees, certifications, and relevant coursework."
        education={state.education || []}
        onAdd={handleAddEducation}
        onUpdate={handleUpdateEducation}
        onRemove={handleRemoveEducation}
      />
    </div>
  );
};

export default EducationSection; 