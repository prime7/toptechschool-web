import React, { useState } from "react";
import { ProjectItem } from "../types";
import { generateId } from "../utils";
import { Plus, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ListContentEditor } from "./ListContentEditor";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectsEditorProps {
  projects: ProjectItem[];
  onAdd: (project: ProjectItem) => void;
  onUpdate: (id: string, data: Omit<ProjectItem, "id">) => void;
  onRemove: (id: string) => void;
  title?: string;
  description?: string;
}

const emptyProject: Omit<ProjectItem, "id"> = {
  name: "",
  description: "",
  points: [],
  url: "",
  displayOrder: 0,
};

const ProjectsEditor: React.FC<ProjectsEditorProps> = ({
  projects,
  onAdd,
  onUpdate,
  onRemove,
  title = "Projects",
  description = "Add notable projects you've worked on, including personal, academic, and professional projects.",
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] =
    useState<Omit<ProjectItem, "id">>(emptyProject);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      onUpdate(isEditing, formData);
      setIsEditing(null);
    } else {
      onAdd({ id: generateId(), ...formData });
    }
    setFormData(emptyProject);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setFormData(emptyProject);
    setIsDialogOpen(false);
    setIsEditing(null);
  };

  const handleEdit = (item: ProjectItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      points: item.points,
      url: item.url || "",
      displayOrder: item.displayOrder,
    });
    setIsEditing(item.id);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => setDeleteId(id);

  const confirmDelete = () => {
    if (deleteId) {
      onRemove(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr,auto] gap-4 items-start mb-1">
        <div className="space-y-0.5">
          {title && (
            <h2 className="text-xl font-semibold leading-none">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Button size="sm" onClick={() => setIsDialogOpen(true)} className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Project" : "Add Project"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your project information."
                : "Add a new project to your resume."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                Project Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Project name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm">
                Project URL
              </Label>
              <Input
                id="url"
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Description & Key Features</Label>
              <ListContentEditor
                description={formData.description}
                onDescriptionChange={(description) =>
                  setFormData((prev) => ({ ...prev, description }))
                }
                bulletPoints={formData.points || []}
                onAdd={(bullet) =>
                  setFormData((prev) => ({
                    ...prev,
                    points: [...prev.points, bullet],
                  }))
                }
                onUpdate={(index, text) =>
                  setFormData((prev) => ({
                    ...prev,
                    points: prev.points.map((b, i) => (i === index ? text : b)),
                  }))
                }
                onRemove={(index) =>
                  setFormData((prev) => ({
                    ...prev,
                    points: prev.points.filter((_, i) => i !== index),
                  }))
                }
                onReorder={(newOrder) =>
                  setFormData((prev) => ({ ...prev, points: newOrder }))
                }
                showDescription={true}
                descriptionLabel="Description"
                descriptionPlaceholder="Describe the project, its purpose, and your role"
                bulletPlaceholder="Add a key feature or achievement"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {projects && projects.length > 0 && (
        <div className="grid gap-1.5">
          {projects.map((item, idx) => (
            <Card key={idx} className="group overflow-hidden shadow-sm">
              <CardContent className="p-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-medium leading-none">{item.name}</h3>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline mt-0.5 block"
                      >
                        {item.url}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => openDeleteDialog(item.id)}
                    >
                      <Trash className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1 leading-snug">
                    {item.description}
                  </p>
                )}

                {item.points && item.points.length > 0 && (
                  <ul className="list-disc pl-4 mt-1 text-sm text-muted-foreground leading-snug">
                    {item.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectsEditor;
