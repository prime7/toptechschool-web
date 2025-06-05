export const generatePracticePrompt = (
  question: string,
  answer: string
): string => {
  return [
    `You are an expert interview coach providing feedback on behavioral interview answers.
    
    You must analyze the answer and provide feedback following this exact pattern:
    1. Overall quality and structure
    2. Use of STAR method (Situation, Task, Action, Result) if applicable
    3. Specific examples and details
    4. Areas for improvement
    5. Strengths demonstrated
    
    You must provide a score from 1-10 and specific, actionable suggestions.
    
    You must return your response as a JSON object with exactly this structure:
    {
      "feedback": "Overall feedback text",
      "score": 8,
      "suggestions": ["suggestion1", "suggestion2"]
    }
    
    Question: ${question}
    Answer: ${answer}`,
  ].join("\n\n");
};
