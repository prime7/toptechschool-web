import OpenAI from "openai";
import { EvaluateJobInput, EvaluateJobResponse } from "./types";
import { getUserResume } from "../resume";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function evaluateJob(
  input: EvaluateJobInput
): Promise<EvaluateJobResponse> {
  const { resumeId, jobDesc } = input;

  const resume = await getUserResume(resumeId);
  if (!resume || !resume.analysis) {
    throw new Error("Resume not found or not analyzed");
  }

  const resumeSkills =
    resume.analysis.contentQuality.skillsSection.technicalSkills;
  const resumeKeywords = resumeSkills.map((skill) => skill.toLowerCase());

  const prompt = `
    Analyze the match between the following job description and the resume skills.
    Provide:
    1. A match score (percentage 0-100).
    2. Missing keywords in the resume.
    3. Suggestions for improvement if the match score exceeds 50%.

    Job Description:
    ${jobDesc}

    Resume Skills:
    ${resumeKeywords.join(", ")}

    Format your response as a valid JSON object with the following structure:
    {
      "matchScore": "number",
      "missingKeywords": ["string"],
      "suggestions": ["string"]
    }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You must respond with valid JSON only. No other text or explanation.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 1000,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  let llmResult: EvaluateJobResponse;
  try {
    llmResult = JSON.parse(
      completion.choices[0].message.content ||
        '{"matchScore":0,"missingKeywords":[],"suggestions":[]}'
    );
  } catch (e) {
    console.error("Failed to parse OpenAI response:", e);
    llmResult = { matchScore: 0, missingKeywords: [], suggestions: [] };
  }

  return llmResult;
}
