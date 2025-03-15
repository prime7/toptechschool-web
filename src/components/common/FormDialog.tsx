import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormDialogProps {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function FormDialog({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  size = "2xl",
}: FormDialogProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={sizeClasses[size]}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {children}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 