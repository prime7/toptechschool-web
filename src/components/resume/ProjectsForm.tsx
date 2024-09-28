"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface ProjectInfo {
  name: string;
  summary: string;
  outcome: string;
}

const ProjectsForm = () => {
  const [projectsList, setProjectsList] = useState<ProjectInfo[]>([
    { name: "", summary: "", outcome: "" },
  ]);

  // Function to add a new project
  const handleAddProject = () => {
    setProjectsList([...projectsList, { name: "", summary: "", outcome: "" }]);
  };

  // Function to handle field changes
  const handleChange = (
    index: number,
    field: keyof ProjectInfo,
    value: string
  ) => {
    const updatedProjectsList = [...projectsList];
    updatedProjectsList[index] = {
      ...updatedProjectsList[index],
      [field]: value,
    };
    setProjectsList(updatedProjectsList);
  };

  // Function to remove a project entry
  const handleDeleteProject = (index: number) => {
    const updatedProjectsList = projectsList.filter((_, i) => i !== index);
    setProjectsList(updatedProjectsList);
  };

  return (
    <section className="projects py-2">
      <h2 className="text-lg font-semibold">Projects</h2>

      {projectsList.map((project, index) => (
        <div
          key={index}
          className="mb-4 border dark:border-gray-600 p-2 rounded-md"
        >
          <div className="mb-2">
            <Label className="pr-2">Project Name</Label>
            <Input
              type="text"
              required
              placeholder="Enter your project name"
              className="border px-1 w-full"
              value={project.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
          </div>
          <div className="mb-2">
            <Label>Short Summary</Label>
            <Input
              type="text"
              required
              value={project.summary}
              onChange={(e) => handleChange(index, "summary", e.target.value)}
              className="border px-1 w-full"
            />
          </div>
          <div className="mb-2">
            <Label>Successful Outcome</Label>
            <Input
              type="text"
              required
              value={project.outcome}
              onChange={(e) => handleChange(index, "outcome", e.target.value)}
              className="border px-1 w-full"
            />
          </div>

          {/* Delete Button */}
          {projectsList.length > 1 && (
            <Button
              variant="destructive"
              onClick={() => handleDeleteProject(index)}
            >
              Delete Project
            </Button>
          )}
        </div>
      ))}

      {/* Add Another Project Button */}
      <Button onClick={handleAddProject}>Add Another Project</Button>
    </section>
  );
};

export default ProjectsForm;
