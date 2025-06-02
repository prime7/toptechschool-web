export const generatePracticePrompt = (
  question: string,
  answer: string
): string => {
  return [
    `You are an expert interview coach providing feedback on behavioral interview answers. 
    Analyze the answer and provide constructive feedback focusing on:
    1. Overall quality and structure
    2. Use of STAR method (Situation, Task, Action, Result) if applicable
    3. Specific examples and details
    4. Areas for improvement
    5. Strengths demonstrated
    
    Provide a score from 1-10 and specific, actionable suggestions.
    
    Return your response as a JSON object with the following structure:
    {
      "feedback": "Overall feedback text",
      "score": 8,
      "suggestions": ["suggestion1", "suggestion2"]
    }`,
    `Please provide feedback on this interview answer:
    
    Question: ${question}`,
    `Answer: ${answer}`,
  ].join("\n\n");
};
