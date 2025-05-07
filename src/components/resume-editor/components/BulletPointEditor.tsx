import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface BulletPointEditorProps {
  bulletPoints: string[];
  onAdd: (bullet: string) => void;
  onUpdate: (index: number, text: string) => void;
  onRemove: (index: number) => void;
  onReorder?: (bulletPoints: string[]) => void;
}

export function BulletPointEditor({
  bulletPoints,
  onAdd,
  onUpdate,
  onRemove,
  onReorder
}: BulletPointEditorProps) {
  const [newBullet, setNewBullet] = useState('');

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
  };

  const handleMoveBullet = (index: number, direction: 'up' | 'down') => {
    if (!onReorder) return;
    
    const newBulletPoints = [...bulletPoints];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= bulletPoints.length) return;
    
    // Swap the elements
    [newBulletPoints[index], newBulletPoints[newIndex]] = 
    [newBulletPoints[newIndex], newBulletPoints[index]];
    
    onReorder(newBulletPoints);
  };

  return (
    <div className="space-y-2">
      {bulletPoints.map((bullet, index) => (
        <div key={index} className="flex items-start gap-2">
          <Textarea
            value={bullet}
            onChange={(e) => handleUpdateBullet(index, e.target.value)}
            placeholder="Add a bullet point"
            className="min-h-[60px] resize-vertical"
            onBlur={(e) => {
              // Ensure changes are saved on blur
              if (e.target.value !== bullet) {
                handleUpdateBullet(index, e.target.value);
              }
            }}
          />
          
          <div className="flex gap-1 mt-2">
            {onReorder && (
              <>
                <Button

                  size="icon"
                  disabled={index === 0}
                  onClick={() => handleMoveBullet(index, 'up')}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button

                  size="icon"
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
          placeholder="Add a new bullet point"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddBullet();
            }
          }}
        />
        <Button onClick={handleAddBullet}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
} 