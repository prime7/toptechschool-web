"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  Trash2Icon,
  EditIcon,
  BriefcaseIcon,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type ResumeProps = {
  id: string;
  filename: string;
  createdAt: string | Date;
  jobRole?: string;
};

export default function Resume({
  id,
  filename,
  createdAt,
  jobRole,
}: ResumeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFilename, setNewFilename] = useState(filename);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/resume/${id}`);
      toast({
        title: "Resume deleted successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Failed to delete resume",
      });
    }
  };
  
  const handleUpdateFilename = async () => {
    try {
      await axios.patch(`/api/resume/${id}`, {
        filename: newFilename,
      });
      toast({
        title: "Resume updated successfully",
      });
      router.refresh();
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to update resume",
      });
    }
  };

  return (
    <div className="flex flex-col rounded-lg border border-border hover:bg-muted/30 transition-colors group">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium group-hover:text-primary transition-colors">
              {filename}
            </p>
            <div className="flex items-center mt-1 gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                {createdAt
                  ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
                  : "No date"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full"
                aria-label="Rename resume"
              >
                <EditIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Resume</DialogTitle>
                <DialogDescription>
                  Enter a new name for your resume.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="filename">Resume Name</Label>
                <Input
                  id="filename"
                  value={newFilename}
                  onChange={(e) => setNewFilename(e.target.value)}
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateFilename}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full"
                aria-label="Delete resume"
              >
                <Trash2Icon className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your resume &quot;{filename}
                  &quot;. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {jobRole && (
        <div className="px-4 pb-2 -mt-1">
          <div className="flex items-center text-sm">
            <BriefcaseIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span className="text-primary font-medium">
              {jobRole.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      )}

      <Link
        href={`/resume/${id}`}
        className="flex items-center justify-center p-2 mt-1 border-t border-border bg-muted/30 hover:bg-muted transition-colors"
      >
        <span className="text-sm font-medium mr-1">View Details</span>
        <ChevronRightIcon className="h-4 w-4 text-primary" />
      </Link>
    </div>
  );
}
