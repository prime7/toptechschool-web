import React from 'react';
import { useResume } from '../context/ResumeContext';
import { WorkItem } from '../types';
import { WorkEditor } from '../components/WorkEditor';

const WorkSection: React.FC = () => {
  const { state, dispatch } = useResume();

  const handleAdd = (workItem: WorkItem) => {
    dispatch({
      type: 'ADD_EXPERIENCE',
      payload: workItem
    });
  };

  const handleUpdate = (id: string, data: Omit<WorkItem, 'id'>) => {
    dispatch({
      type: 'UPDATE_EXPERIENCE',
      payload: { id, data }
    });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_EXPERIENCE', payload: id });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Work Experience</h2>
        <p className="text-sm text-muted-foreground">
          Add your work history, starting with your most recent position.
        </p>
      </div>
      
      <WorkEditor
        work={state.work || []}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
        title=""
        description=""
      />
    </div>
  );
};

export default WorkSection;