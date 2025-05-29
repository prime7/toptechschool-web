import React from "react";
import { useResume } from "../context/ResumeContext";
import { WorkItem } from "../types";
import { WorkEditor } from "../components/WorkEditor";
import { Button } from "@/components/ui/button";

const WorkSection: React.FC = () => {
  const { state, dispatch, exportUtils } = useResume();

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

  const handleExport = () => {
    exportUtils.exportSection('work');
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <Button onClick={handleExport} size="sm">Export</Button>
      </div>

      <WorkEditor
        description="Add your work history, starting with your most recent position."
        work={state.work || []}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default WorkSection;
