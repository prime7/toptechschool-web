import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface ListContentEditorProps {
  bulletPoints: string[];
  onAdd: (bullet: string) => void;
  onUpdate: (index: number, text: string) => void;
  onRemove: (index: number) => void;
  onReorder?: (bulletPoints: string[]) => void;
  
  // Optional description functionality
  description?: string;
  onDescriptionChange?: (description: string) => void;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
  showDescription?: boolean;
  
  // Customization options
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
  description = '',
  onDescriptionChange,
  descriptionLabel = 'Description',
  descriptionPlaceholder = 'Enter description...',
  showDescription = false,
  bulletPlaceholder = 'Add a new bullet point',
  addButtonText = 'Add',
  className = ''
}: ListContentEditorProps) {
  const [newBullet, setNewBullet] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleAddBullet = () => {
    if (newBullet.trim()) {
      onAdd(newBullet.trim());
      setNewBullet('');
    }
  };

  const handleUpdateBullet = (index: number, text: string) => {
    onUpdate(index, text);
  };

  const handleRemoveBullet = (index: number) => {
    onRemove(index);
    if (focusedIndex === index) {
      setFocusedIndex(null);
    }
  };

  const handleMoveBullet = (index: number, direction: 'up' | 'down') => {
    if (!onReorder) return;
    
    const newBulletPoints = [...bulletPoints];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= bulletPoints.length) return;
    
    [newBulletPoints[index], newBulletPoints[newIndex]] = 
    [newBulletPoints[newIndex], newBulletPoints[index]];
    
    onReorder(newBulletPoints);
    setFocusedIndex(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (index === bulletPoints.length - 1) {
        setNewBullet(bulletPoints[index]);
        handleRemoveBullet(index);
        const inputElement = document.querySelector(`input[placeholder="${bulletPlaceholder}"]`);
        if (inputElement instanceof HTMLInputElement) {
          inputElement.focus();
        }
      } else {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
        if (nextInput instanceof HTMLInputElement) {
          nextInput.focus();
        }
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
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
      
      <div className="space-y-2">
        {bulletPoints.map((bullet, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={bullet}
              onChange={(e) => handleUpdateBullet(index, e.target.value)}
              placeholder="Add a bullet point"
              className={`${focusedIndex === index ? 'ring-2 ring-primary' : ''}`}
              data-index={index}
              onFocus={() => setFocusedIndex(index)}
              onBlur={(e) => {
                if (e.target.value !== bullet) {
                  handleUpdateBullet(index, e.target.value);
                }
                setFocusedIndex(null);
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
            
            <div className="flex">
              {onReorder && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => handleMoveBullet(index, 'up')}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={index === bulletPoints.length - 1}
                    onClick={() => handleMoveBullet(index, 'down')}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveBullet(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="flex gap-2">
          <Input
            value={newBullet}
            onChange={(e) => setNewBullet(e.target.value)}
            placeholder={bulletPlaceholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddBullet();
              }
            }}
          />
          <Button onClick={handleAddBullet}>
            <Plus className="h-4 w-4 mr-1" />
            {addButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
} 