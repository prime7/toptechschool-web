import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const SummaryEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const { summary } = state;
  const [summaryText, setSummaryText] = useState(summary || '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummaryText(e.target.value);
  };

  const handleUpdate = () => {
    dispatch({
      type: 'UPDATE_SUMMARY',
      payload: summaryText
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Professional Summary</h2>
      <p className="text-sm text-muted-foreground">
        Write a short, compelling summary of your professional background, skills, and career goals.
        You can use new lines to format your summary for better readability.
      </p>

      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={summaryText}
          onChange={handleChange}
          className="min-h-[150px] resize-vertical"
          placeholder="Experienced software engineer with a passion for creating elegant solutions to complex problems..."
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleUpdate}>Update Summary</Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Tips:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Focus on your most relevant skills and achievements</li>
          <li>Tailor your summary to the job you&apos;re applying for</li>
          <li>Use action verbs and quantify your achievements when possible</li>
          <li>Organize your summary with new lines for better readability</li>
          <li>Avoid jargon and clichés</li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryEditor;
