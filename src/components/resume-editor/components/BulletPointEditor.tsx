import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, Loader2 } from 'lucide-react'; // Added Sparkles, Loader2
import AISuggestionsModal from './AISuggestionsModal'; // Added AISuggestionsModal import
import { generateBulletPointSuggestionPrompt } from '@/lib/ai/prompts/bulletPointPrompts';
import { ai } from '@/lib/ai';
import { AnthropicModels } from '@/lib/ai/providers/anthropic'; // Assuming this path

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
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // State for AI Suggestions Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  // TODO: Get actual userId, perhaps from a context or session
  const userId = "mock-user-id";

  const parseAiResponse = (responseText: string): string[] => {
    if (!responseText) return [];
    return responseText
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim()) // Remove numbering like "1. "
      .filter(line => line.length > 0);
  };

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
        const inputElement = document.querySelector('input[placeholder="Add a new bullet point"]');
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
          <Button
            size="icon"
            variant="ghost"
            onClick={async () => {
              setEditingIndex(index);
              setIsLoadingSuggestions(true);
              try {
                const prompt = generateBulletPointSuggestionPrompt(bulletPoints[index]);
                const response = await ai.generateResponse({
                  prompt,
                  model: AnthropicModels.HAIKU,
                  requestType: 'bullet_point_suggestion',
                  userId,
                });
                const suggestions = parseAiResponse(response.text);
                setCurrentSuggestions(suggestions.length > 0 ? suggestions : ["No suggestions generated."]);
              } catch (error) {
                console.error("Failed to get AI suggestions:", error);
                setCurrentSuggestions(["Error fetching suggestions."]);
              } finally {
                setIsLoadingSuggestions(false);
                setIsModalOpen(true);
              }
            }}
            title="Get AI Suggestions"
            disabled={isLoadingSuggestions && editingIndex === index}
          >
            {isLoadingSuggestions && editingIndex === index ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-yellow-500" />
            )}
          </Button>
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

      <AISuggestionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        suggestions={currentSuggestions}
        onAccept={(suggestion) => {
          if (editingIndex !== null) {
            onUpdate(editingIndex, suggestion);
          }
          setIsModalOpen(false);
          setEditingIndex(null);
          setCurrentSuggestions([]);
        }}
      />
      
      <div className="flex gap-2">
        <Input
          value={newBullet}
          onChange={(e) => setNewBullet(e.target.value)}
          placeholder="Add a new bullet point"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
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