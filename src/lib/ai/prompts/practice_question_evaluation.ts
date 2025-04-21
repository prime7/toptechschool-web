export const generatePracticePrompt = (
  practiceSetPrompt: string,
  items: { question: string; answer: string }[]
): string => {
  return [
    `You are an expert practice question evaluator with deep knowledge in technical assessments.
    Analyze each question and answer pair with the following criteria:
    - Technical accuracy and correctness
    - Completeness of the response
    - Clarity and communication
    - Best practices and patterns
    - Code quality (if applicable)

    Provide specific, actionable feedback that helps improve understanding and performance.

    Your response must be valid JSON matching the PracticeTestAnalysisResult type.`,
    practiceSetPrompt,
    ...items.map(item => `Question: ${item.question}\nAnswer: ${item.answer}`)
  ].join("\n\n");
}

