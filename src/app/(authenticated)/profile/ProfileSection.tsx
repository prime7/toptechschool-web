import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  onEdit?: () => void;
  onAdd?: () => void;
  addButtonText?: string;
  className?: string;
  isEmpty?: boolean;
  emptyStateMessage?: string;
  emptyStateAction?: () => void;
  emptyStateActionText?: string;
}

export function ProfileSection({
  title,
  icon,
  children,
  onEdit,
  onAdd,
  addButtonText = "Add",
  className,
  isEmpty = false,
  emptyStateMessage = "No information added yet.",
  emptyStateAction,
  emptyStateActionText = "Add",
}: ProfileSectionProps) {
  return (
    <div className={cn("bg-card p-4 sm:p-5 md:p-6 rounded-lg border border-border", className)}>
      <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          {icon && <div className="text-primary">{icon}</div>}
          <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onAdd && (
            <Button variant="outline" size="sm" onClick={onAdd} className="w-full sm:w-auto">
              <PlusCircle className="h-4 w-4 mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground mb-3 sm:mb-4 px-2">{emptyStateMessage}</p>
          {emptyStateAction && (
            <Button onClick={emptyStateAction} variant="outline" className="w-full sm:w-auto max-w-[200px]">
              <PlusCircle className="h-4 w-4 mr-2" />
              {emptyStateActionText}
            </Button>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
} 