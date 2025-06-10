import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BulletPointEditor } from "./BulletPointEditor";

interface ListContentEditorProps {
  bulletPoints: string[];
  onAdd: (bullet: string) => void;
  onUpdate: (index: number, text: string) => void;
  onRemove: (index: number) => void;
  onReorder?: (bulletPoints: string[]) => void;

  description?: string;
  onDescriptionChange?: (description: string) => void;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
  showDescription?: boolean;

  bulletPlaceholder?: string;
  addButtonText?: string;
  className?: string;
}

export function ListContentEditor({
  bulletPoints,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
  description = "",
  onDescriptionChange,
  descriptionLabel = "Description",
  descriptionPlaceholder = "Enter description...",
  showDescription = false,
  bulletPlaceholder = "Add a new bullet point",
  addButtonText = "Add",
  className = "",
}: ListContentEditorProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {showDescription && onDescriptionChange && (
        <div className="space-y-2">
          <Label className="text-sm">{descriptionLabel}</Label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder={descriptionPlaceholder}
            className="min-h-[80px]"
          />
        </div>
      )}

      <BulletPointEditor
        bulletPoints={bulletPoints}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onReorder={onReorder}
        placeholder={bulletPlaceholder}
        addButtonText={addButtonText}
      />
    </div>
  );
}
