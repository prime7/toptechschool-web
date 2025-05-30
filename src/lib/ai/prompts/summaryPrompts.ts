import type { WorkItem } from '../../../components/resume-editor/types'; // Adjust path as needed

/**
 * Generates a prompt for creating a professional summary based on work experience.
 * @param workExperience An array of WorkItem objects.
 * @returns A string prompt for an AI model.
 */
export function generateSummarySuggestionPrompt(workExperience: WorkItem[]): string {
  const experienceStrings = workExperience.map(job => {
    let jobString = `Position: ${job.position}\nCompany: ${job.company}\n`;
    if (job.description) {
      jobString += `Description: ${job.description}\n`;
    }
    if (job.points && job.points.length > 0) {
      jobString += `Key Achievements/Responsibilities:\n${job.points.map(p => `- ${p}`).join('\n')}\n`;
    }
    return jobString;
  });

  return `
Based on the following work experience, please craft three distinct professional summary options for a resume.
Each summary should be concise (3-4 sentences), tailored for a general professional audience,
and highlight key skills, achievements, and overall career trajectory.

Work Experience:
---
${experienceStrings.join('\n---\n')}
---

Desired Output Format:
Provide each summary option clearly separated, for example:

Option 1:
[Summary Text]

Option 2:
[Summary Text]

Option 3:
[Summary Text]

Focus on synthesizing the experience into compelling narratives that would capture a recruiter's attention.
Avoid simply listing job titles. Instead, emphasize transferable skills and significant accomplishments.
`;
}
