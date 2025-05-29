"use client";

import { useTransition, useOptimistic } from "react";
import { User, Project } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import ProjectsEditor from "@/components/resume-editor/components/ProjectsEditor";
import { ProjectItem } from "@/components/resume-editor/types";

interface ProfileProjectProps {
  user: User & { projects: Project[] };
  onSave: (data: Partial<User & { projects: Omit<Project, "id">[] }>) => Promise<User>;
}

const projectToProjectItem = (project: Project): ProjectItem => ({
  id: project.id,
  name: project.name,
  description: project.description || "",
  points: project.points || [],
  url: project.url || "",
  displayOrder: project.displayOrder,
});

const projectItemToProject = (projectItem: Omit<ProjectItem, "id">, userId: string): Omit<Project, "id"> => ({
  userId,
  name: projectItem.name,
  description: projectItem.description || null,
  points: projectItem.points,
  url: projectItem.url || null,
  displayOrder: projectItem.displayOrder,
});

export default function ProfileProject({ user, onSave }: ProfileProjectProps) {
  const [, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [optimisticProjects, updateOptimisticProjects] = useOptimistic(
    user.projects.map(projectToProjectItem),
    (state, newProjects: ProjectItem[]) => newProjects
  );

  const saveProjects = async (projectItems: ProjectItem[]) => {
    startTransition(async () => {
      try {
        const formattedProjects = projectItems.map(item => projectItemToProject(item, user.id));
        await onSave({ projects: formattedProjects });
        
        toast({
          title: "Projects updated",
          description: "Your projects have been updated successfully.",
        });
      } catch (error) {
        console.error("Failed to update projects:", error);
        toast({
          title: "Update failed",
          description: "There was a problem updating your projects. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleAdd = (projectItem: ProjectItem) => {
    const newProjects = [...optimisticProjects, projectItem];
    updateOptimisticProjects(newProjects);
    saveProjects(newProjects);
  };

  const handleUpdate = (id: string, data: Omit<ProjectItem, "id">) => {
    const updatedProjects = optimisticProjects.map(item => 
      item.id === id ? { ...item, ...data } : item
    );
    updateOptimisticProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  const handleRemove = (id: string) => {
    const filteredProjects = optimisticProjects.filter(item => item.id !== id);
    updateOptimisticProjects(filteredProjects);
    saveProjects(filteredProjects);
  };

  return (
    <ProjectsEditor
      projects={optimisticProjects}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onRemove={handleRemove}
      title="Projects"
      description=""
    />
  );
}
