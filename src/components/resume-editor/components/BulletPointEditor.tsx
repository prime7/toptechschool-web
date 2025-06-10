import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Edit3, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulletPointEditorProps {
  bulletPoints: string[];
  onAdd: (bullet: string) => void;
  onUpdate: (index: number, text: string) => void;
  onRemove: (index: number) => void;
  onReorder?: (bulletPoints: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
}

interface BulletItem {
  id: string;
  text: string;
  isEditing?: boolean;
}

export function BulletPointEditor({
  bulletPoints,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
  placeholder,
  addButtonText,
}: BulletPointEditorProps) {
  const [newBullet, setNewBullet] = useState("");
  const [items, setItems] = useState<BulletItem[]>(
    bulletPoints.map((text, i) => ({ id: i.toString(), text }))
  );
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(bulletPoints.map((text, i) => ({ id: i.toString(), text })));
  }, [bulletPoints]);

  const handleAddBullet = () => {
    if (newBullet.trim()) {
      onAdd(newBullet.trim());
      setNewBullet("");
    }
  };

  const handleUpdateBullet = (index: number, text: string) => {
    onUpdate(index, text);
  };

  const handleStartEditing = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isEditing: true }
          : { ...item, isEditing: false }
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedItem || !onReorder) return;

    const draggedIndex = items.findIndex((item) => item.id === draggedItem);
    if (draggedIndex === -1) return;

    const newItems = [...items];
    const [draggedItemData] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItemData);

    setItems(newItems);
    onReorder(newItems.map((item) => item.text));
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-1">
      <div className="rounded-md bg-card text-card-foreground">
        {items.map((item, index) => (
          <div key={item.id}>
            <BulletItemComponent
              item={item}
              index={index}
              isDraggedOver={dragOverIndex === index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onUpdate={(text) => handleUpdateBullet(index, text)}
              onRemove={() => onRemove(index)}
              onStartEdit={() => handleStartEditing(item.id)}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={newBullet}
          onChange={(e) => setNewBullet(e.target.value)}
          placeholder={placeholder || "Add a new bullet point"}
          className="h-8 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddBullet();
            }
          }}
        />
        <Button onClick={handleAddBullet} size="sm" className="flex-shrink-0">
          <Plus className="h-3.5 w-3.5 mr-1" />
          {addButtonText || "Add"}
        </Button>
      </div>
    </div>
  );
}

interface BulletItemProps {
  item: BulletItem;
  index: number;
  isDraggedOver: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onUpdate: (text: string) => void;
  onRemove: () => void;
  onStartEdit: () => void;
}

const BulletItemComponent: React.FC<BulletItemProps> = ({
  item,
  index,
  isDraggedOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onUpdate,
  onRemove,
  onStartEdit,
}) => {
  const [editText, setEditText] = useState(item.text);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (item.isEditing && inputRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (inputRef.current) {
          // Reset height first to properly calculate scrollHeight
          inputRef.current.style.height = "32px";
          inputRef.current.style.height = inputRef.current.scrollHeight + "px";
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
    }
  }, [item.isEditing]);

  useEffect(() => {
    setEditText(item.text);
  }, [item.text]);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(editText.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-2 py-1.5 px-2 rounded-sm transition-colors",
        isDraggedOver && "bg-muted/50",
        !isDraggedOver && "hover:bg-muted/30 data-[dragging=true]:bg-muted/30"
      )}
      draggable={!item.isEditing}
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      data-dragging={isDraggedOver}
    >
      <div
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>

      <div className="flex-1 min-w-0">
        {item.isEditing ? (
          <textarea
            ref={inputRef}
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height =
                e.currentTarget.scrollHeight + "px";
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            rows={1}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            style={{
              minHeight: "32px",
              height: "auto",
              overflow: "hidden",
            }}
            placeholder="Enter bullet point..."
          />
        ) : (
          <button
            type="button"
            onClick={onStartEdit}
            className="w-full text-left py-1 text-sm text-foreground/90 hover:text-primary break-words whitespace-pre-line truncate line-clamp-3"
            title={item.text}
          >
            {item.text || "Click to edit..."}
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!item.isEditing && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onStartEdit}
              className="h-7 w-7 p-0"
              aria-label="Edit bullet point"
            >
              <Edit3 className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-7 w-7 p-0"
              aria-label="Remove bullet point"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
