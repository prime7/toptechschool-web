import React from 'react';
import { useResume } from '../context/ResumeContext';
import { MarkdownEditor } from '@/components/ui/markdown-editor';

const SummaryEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const { summary } = state;

  const handleChange = (value: string) => {
    dispatch({
      type: 'UPDATE_SUMMARY',
      payload: value
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Professional Summary</h2>
      <p className="text-sm text-muted-foreground">
        Write a short, compelling summary of your professional background, skills, and career goals.
        Keep it between 3-5 sentences for optimal readability.
      </p>

      <div>
        <MarkdownEditor
          id="summary"
          value={summary || ''}
          onChange={(value: string) => handleChange(value)}
          minHeight={200}
          placeholder="Experienced software engineer with a passion for creating elegant solutions to complex problems..."
          label="Summary"
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Tips:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Focus on your most relevant skills and achievements</li>
          <li>Tailor your summary to the job you're applying for</li>
          <li>Use action verbs and quantify your achievements when possible</li>
          <li>Avoid jargon and clichés</li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryEditor;
