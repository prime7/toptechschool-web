import React from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  Trash2Icon,
  EditIcon,
  BriefcaseIcon,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ResumeProps = {
  id: string;
  filename: string;
  createdAt: string | Date;
  jobRole?: string;
};

export default async function Resume({
  id,
  filename,
  createdAt,
  jobRole,
}: ResumeProps) {
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
                  ? new Date(createdAt).toLocaleDateString()
                  : "No date"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full"
            aria-label="Rename resume"
          >
            <EditIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full"
            aria-label="Delete resume"
          >
            <Trash2Icon className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
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
