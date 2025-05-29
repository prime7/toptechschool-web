import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { ListContentEditor } from '../components/ListContentEditor';
import { Button } from '@/components/ui/button';

const SummarySection: React.FC = () => {
  const { state, dispatch, exportUtils } = useResume();
  const { summary, summaryHighlights } = state;
  const [summaryText, setSummaryText] = useState(summary || '');
  const [highlights, setHighlights] = useState<string[]>(summaryHighlights || []);

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

      <div className="flex justify-end gap-2">
        <Button onClick={handleExport} variant="outline" size="sm">Export</Button>
        <Button onClick={handleUpdate}>Update Summary</Button>
      </div>

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
