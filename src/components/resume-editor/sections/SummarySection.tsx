import React, { useState, useEffect } from "react";
import { useResume } from "../context/ResumeContext";
import { ListContentEditor } from "../components/ListContentEditor";
import { Button } from "@/components/ui/button";

const SummarySection: React.FC = () => {
  const { state, dispatch, exportUtils } = useResume();
  const { summary, summaryHighlights } = state;
  const [summaryText, setSummaryText] = useState(summary || "");
  const [highlights, setHighlights] = useState<string[]>(
    summaryHighlights || []
  );

  useEffect(() => {
    setSummaryText(summary || "");
    setHighlights(summaryHighlights || []);
  }, [summary, summaryHighlights]);

  const handleUpdate = () => {
    dispatch({
      type: "UPDATE_SUMMARY",
      payload: summaryText,
    });
    dispatch({
      type: "UPDATE_SUMMARY_HIGHLIGHTS",
      payload: highlights,
    });
  };

  const handleExport = () => {
    handleUpdate();
    exportUtils.exportSection("summary");
  };

  const handleAddHighlight = (highlight: string) => {
    setHighlights((prev) => [...prev, highlight]);
  };

  const handleUpdateHighlight = (index: number, text: string) => {
    setHighlights((prev) => prev.map((item, i) => (i === index ? text : item)));
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorderHighlights = (newOrder: string[]) => {
    setHighlights(newOrder);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Professional Summary</h2>
        <Button onClick={handleExport} size="sm">
          Export
        </Button>
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
      />

      <div className="flex justify-end">
        <Button onClick={handleUpdate}>Update Summary</Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Tips:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>
            Focus on your most relevant skills and achievements in the summary
          </li>
          <li>
            Use highlights to showcase specific accomplishments with numbers
            when possible
          </li>
          <li>
            Tailor your summary and highlights to the job you&apos;re applying
            for
          </li>
          <li>Keep the summary concise but impactful</li>
          <li>Avoid jargon and clichés</li>
        </ul>
      </div>
    </div>
  );
};

export default SummarySection;
