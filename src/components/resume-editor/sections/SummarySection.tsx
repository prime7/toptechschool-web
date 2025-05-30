import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { ListContentEditor } from '../components/ListContentEditor';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react'; // Added Sparkles, Loader2
import AISuggestionsModal from '../components/AISuggestionsModal'; // Added AISuggestionsModal
import { generateSummarySuggestionPrompt } from '@/lib/ai/prompts/summaryPrompts';
import { generateProjectFeatureSuggestionPrompt } from '@/lib/ai/prompts/projectPrompts'; // Using this for highlights based on summary
import { ai } from '@/lib/ai';
import { AnthropicModels } from '@/lib/ai/providers/anthropic';

const SummarySection: React.FC = () => {
  const { state, dispatch, exportUtils } = useResume();
  const { summary, summaryHighlights, work } = state; // Added work for summary generation
  const [summaryText, setSummaryText] = useState(summary || '');
  const [highlights, setHighlights] = useState<string[]>(summaryHighlights || []);

  // AI Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [suggestionType, setSuggestionType] = useState<'summary' | 'highlight' | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  // TODO: Get actual userId
  const userId = "mock-user-id";

  const parseAiResponse = (responseText: string): string[] => {
    if (!responseText) return [];
    // Handles "Option 1:\n[Text]\nOption 2:\n[Text]" and numbered lists.
    const options = responseText.split(/Option \d+:/g).map(s => s.trim()).filter(s => s.length > 0);
    if (options.length > 1) return options;

    return responseText
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);
  };

  useEffect(() => {
    setSummaryText(summary || '');
    setHighlights(summaryHighlights || []);
  }, [summary, summaryHighlights]);

  const handleUpdate = () => {
    dispatch({
      type: 'UPDATE_SUMMARY',
      payload: summaryText
    });
    dispatch({
      type: 'UPDATE_SUMMARY_HIGHLIGHTS',
      payload: highlights
    });
  };

  const handleExport = () => {
    // First update the current state to the global state
    handleUpdate();
    // Then auto-fill from profile
    exportUtils.exportSection('summary');
  };

  const handleAddHighlight = (highlight: string) => {
    setHighlights(prev => [...prev, highlight]);
  };

  const handleUpdateHighlight = (index: number, text: string) => {
    setHighlights(prev => prev.map((item, i) => i === index ? text : item));
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(prev => prev.filter((_, i) => i !== index));
  };

  const handleReorderHighlights = (newOrder: string[]) => {
    setHighlights(newOrder);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Professional Summary</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              setSuggestionType("summary");
              setIsLoadingSuggestions(true);
              try {
                const prompt = generateSummarySuggestionPrompt(work || []);
                const response = await ai.generateResponse({
                  prompt,
                  model: AnthropicModels.HAIKU,
                  requestType: 'summary_suggestion',
                  userId,
                });
                const suggestions = parseAiResponse(response.text);
                setCurrentSuggestions(suggestions.length > 0 ? suggestions : ["No suggestions."]);
              } catch (error) {
                console.error("Failed to get summary suggestions:", error);
                setCurrentSuggestions(["Error fetching suggestions."]);
              } finally {
                setIsLoadingSuggestions(false);
                setIsModalOpen(true);
              }
            }}
            title="Get AI Suggestions for Summary"
            disabled={isLoadingSuggestions}
          >
            {isLoadingSuggestions && suggestionType === 'summary' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
            )}
            Suggest Summary
          </Button>
          <Button onClick={handleExport} size="sm">Export</Button>
        </div>
      </div>

      <ListContentEditor
        showDescription={true}
        description={summaryText}
        onDescriptionChange={setSummaryText}
        descriptionLabel="Professional Summary"
        descriptionPlaceholder="Write a compelling summary of your professional background, skills, and career goals..."
        bulletPoints={highlights}
        onAdd={handleAddHighlight}
        onUpdate={handleUpdateHighlight}
        onRemove={handleRemoveHighlight}
        onReorder={handleReorderHighlights}
        bulletPlaceholder="Add a key highlight or achievement"
        addButtonText="Add Highlight"
      />
      <div className="flex justify-between items-center mt-2">
        <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSuggestionType("highlight");
              // TODO: Replace with actual API call for highlight suggestions
              setCurrentSuggestions([
                "AI Suggested Highlight 1",
                "AI Suggested Highlight 2: Impactful achievement.",
              ]);
              setIsModalOpen(true);
            }}
            title="Get AI Suggestions for Highlights"
          >
            <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
            Suggest Highlight
          </Button>
        <Button onClick={handleUpdate}>Update Summary & Highlights</Button>
      </div>

      <AISuggestionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        suggestions={currentSuggestions}
        title={suggestionType === 'summary' ? 'AI Summary Suggestions' : 'AI Highlight Suggestions'}
        onAccept={(suggestion) => {
          if (suggestionType === 'summary') {
            setSummaryText(suggestion);
          } else if (suggestionType === 'highlight') {
            handleAddHighlight(suggestion);
          }
          // Consider calling handleUpdate() here or let user click the main update button
          setIsModalOpen(false);
          setCurrentSuggestions([]);
          setSuggestionType(null);
        }}
      />

      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Tips:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Focus on your most relevant skills and achievements in the summary</li>
          <li>Use highlights to showcase specific accomplishments with numbers when possible</li>
          <li>Tailor your summary and highlights to the job you&apos;re applying for</li>
          <li>Keep the summary concise but impactful</li>
          <li>Avoid jargon and clichés</li>
        </ul>
      </div>
    </div>
  );
};

export default SummarySection;
