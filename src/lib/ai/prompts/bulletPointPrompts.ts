/**
 * Generates a prompt for improving a single bullet point.
 * @param bulletPoint The existing bullet point text.
 * @returns A string prompt for an AI model.
 */
export function generateBulletPointSuggestionPrompt(bulletPoint: string): string {
  return `
Review the following resume bullet point for clarity, impact, and conciseness:
"${bulletPoint}"

Suggest three improved versions of this bullet point.
Each suggestion should:
1. Start with a strong action verb.
2. Quantify achievements whenever possible (e.g., "Increased sales by 15%" or "Reduced costs by 10%").
3. Highlight specific skills or accomplishments relevant to a professional resume.
4. Be concise and impactful, ideally one to two lines long.
5. Maintain a professional tone.

Return the suggestions as a numbered list. For example:
1. Improved version 1...
2. Improved version 2...
3. Improved version 3...
`;
}
