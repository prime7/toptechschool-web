import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Edit, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  onEdit?: () => void;
  onAdd?: () => void;
  className?: string;
  isEmpty?: boolean;
  emptyStateMessage?: string;
}

export function ProfileSection({
  title,
  icon,
  children,
  onEdit,
  onAdd,
  className,
  isEmpty = false,
  emptyStateMessage = "No information added yet.",
}: ProfileSectionProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl border border-border shadow-sm transition-all duration-200 hover:shadow-md",
      "overflow-hidden",
      className
    )}>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-2.5 mb-2 sm:mb-0">
            {icon && (
              <div className="text-primary bg-primary/10 p-1.5 rounded-md">
                {icon}
              </div>
            )}
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight">{title}</h2>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onEdit}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onAdd && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAdd} 
                className="w-full sm:w-auto gap-1 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {isEmpty ? (
          <div className="py-8 sm:py-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-muted rounded-lg bg-muted/5 transition-all duration-200 hover:bg-muted/10">
            <p className="text-muted-foreground mb-3 sm:mb-4 px-4">{emptyStateMessage}</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {children}
          </div>
        )}
      </div>
    </div>
  );
} 