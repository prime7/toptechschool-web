import React from "react";
import { useResume } from "../context/ResumeContext";
import { WorkItem } from "../types";
import { WorkEditor } from "../components/WorkEditor";

const WorkSection: React.FC = () => {
  const { state, dispatch } = useResume();

  const handleAdd = (workItem: WorkItem) => {
    dispatch({
      type: "ADD_EXPERIENCE",
      payload: workItem,
    });
  };

  const handleUpdate = (id: string, data: Omit<WorkItem, "id">) => {
    dispatch({
      type: "UPDATE_EXPERIENCE",
      payload: { id, data },
    });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: "REMOVE_EXPERIENCE", payload: id });
  };

  return (
    <WorkEditor
      title="Work Experience"
      description="Add your work history, starting with your most recent position."
      work={state.work || []}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
    />
  );
};

export default WorkSection;
