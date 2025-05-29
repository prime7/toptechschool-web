export const generateResumeReviewPrompt = (
   inputs: { resumeData: string, profession: string | null }
 ): string => {
   const { resumeData, profession } = inputs;
 
   return `
   As an expert Technical Recruiter and Hiring Manager, your task is to identify key missing elements in the resume. Focus on actionable improvements directly aligned with the general '${profession || 'software_industry'}' category.
   --- RESUME DATA (Parsed Text) ---
    ${resumeData}
   --- END RESUME DATA ---
 
   --- ANALYSIS AND OUTPUT REQUIREMENTS ---
   Generate a valid JSON object with the following structure. Ensure the output is properly formatted JSON with no trailing commas, properly quoted keys, and escaped strings where needed.
 
   {
      "overallScore": "number (0-100 representing the overall quality of the resume)",
      "detailedAreasForImprovement": [
         {
            "area": "string (e.g., 'Technical Skills', 'Work Experience', 'Education', 'Projects', 'Achievements')",
            "referenceText": "string (Exact text from resume that needs improvement - limit to 100 characters)",
            "improvedText": "string (Specific, concise improved version with stronger action verbs and quantifiable results)",
            "relevanceToRoleCategory": "string (Specific explanation of how this improvement increases marketability for the role)"
         }
      ],
      "missingSkills": [ "string (Critical skills not found in the resume)" ],
      "redFlags": ["string (Major issues identified)"]
   }
 
   Focus on providing clear, actionable advice for the user to improve the resume. Only highlight key improvements directly affecting the candidate's suitability for the role.
   `;
 };