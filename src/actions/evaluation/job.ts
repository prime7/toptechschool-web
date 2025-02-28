import { openai } from "@/lib/openai";

export async function evaluateJob(jobDescription: string, resumeData: string) {
  const prompt = `
    Analyze the match between the following job description and the resume skills.
    Provide:
    1. A match score (percentage 0-100).
    2. Missing keywords in the resume.
    3. Suggestions for improvement if the match score exceeds 50%.

    Format your response as a valid JSON object with the following structure:
    {
      "matchScore": "number",
      "missingKeywords": ["string"],
      "suggestions": ["string"]
    }
  `;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You must respond with valid JSON only. No other text or explanation.",
      },
      { role: "user", content: prompt },
      { role: "user", content: `Job Description: ${jobDescription}` },
      { role: "user", content: `Resume Data: ${resumeData}` },
    ],
    max_tokens: 10000,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  let llmResult;
  try {
    llmResult = JSON.parse(
      response.choices[0].message.content ||
        '{"matchScore":0,"missingKeywords":[],"suggestions":[]}'
    );
  } catch (e) {
    console.error("Failed to parse OpenAI response:", e);
    llmResult = { matchScore: 0, missingKeywords: [], suggestions: [] };
  }

  return llmResult;
}
