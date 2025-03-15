import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface TimelineItemProps {
  title: string;
  subtitle: string;
  dateRange: string;
  description?: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: ReactNode;
}

export function TimelineItem({
  title,
  subtitle,
  dateRange,
  description,
  onEdit,
  onDelete,
  children,
}: TimelineItemProps) {
  return (
    <div className="relative pl-6 border-l-2 border-muted pb-6 last:pb-0">
      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5" />
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground">{subtitle}</p>
          <p className="text-sm text-muted-foreground">{dateRange}</p>
          {description && <p className="mt-2">{description}</p>}
          {children}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 