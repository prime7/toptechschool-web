/**
 * Generates a prompt for improving a project description.
 * @param projectDescription The existing project description.
 * @returns A string prompt for an AI model.
 */
export function generateProjectDescriptionSuggestionPrompt(projectDescription: string): string {
  return `
Review the following project description for a resume:
"${projectDescription}"

Suggest three improved versions of this project description.
Each suggestion should:
1. Clearly explain the project's purpose and its main goal.
2. Briefly mention the key technologies or methodologies used if relevant.
3. Highlight your specific role or contribution if it's a team project (assume it might be, so phrase generally).
4. Emphasize the impact or outcome of the project, if known.
5. Be concise, ideally 2-4 sentences long.
6. Maintain a professional and engaging tone.

Return the suggestions as a numbered list. For example:
1. Improved version 1...
2. Improved version 2...
3. Improved version 3...
`;
}

/**
 * Generates a prompt for suggesting project features or achievements as bullet points.
 * @param projectDescription The existing project description to provide context.
 * @returns A string prompt for an AI model.
 */
export function generateProjectFeatureSuggestionPrompt(projectDescription: string): string {
  return `
Based on the following project description:
"${projectDescription}"

Suggest three distinct key features, achievements, or technical contributions related to this project that could be listed as bullet points on a resume.
Each suggestion should:
1. Start with a strong action verb if describing an achievement or contribution.
2. Be specific and results-oriented if possible (e.g., "Implemented X feature which improved Y by Z%").
3. Focus on aspects that showcase technical skills, problem-solving abilities, or significant contributions.
4. Be concise, suitable for a bullet point format.

Return the suggestions as a numbered list. For example:
1. Suggested feature/achievement 1...
2. Suggested feature/achievement 2...
3. Suggested feature/achievement 3...
`;
}
