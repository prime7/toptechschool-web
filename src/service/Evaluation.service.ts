import { openai } from "@/lib/openai";
import { JobRole } from "@prisma/client";

export interface JobMatchEvaluationResult {
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  gaps: string[];
  recommendations: string;
}

export class EvaluationService {
  static async evaluateJobMatch(
    jobDescription: string, 
    resumeData: string, 
    jobRole: JobRole | null
  ): Promise<JobMatchEvaluationResult> {
    const prompt = `
      Analyze the match between the following job description and the resume skills.
      Provide:
      1. A match score (percentage 0-100).
      2. Missing keywords in the resume.
      3. Suggestions for improvement if the match score exceeds 50%.
      4. Strengths from the resume that match the job description.
      5. A detailed recommendation paragraph.

      Format your response as a valid JSON object with the following structure:
      {
        "matchScore": number,
        "missingKeywords": ["string"],
        "suggestions": ["string"],
        "strengths": ["string"],
        "gaps": ["string"],
        "recommendations": "string"
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
        { role: "user", content: `Job Role: ${jobRole}` },
      ],
      max_tokens: 10000,
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    let llmResult;
    try {
      llmResult = JSON.parse(
        response.choices[0].message.content ||
          '{"matchScore":0,"missingKeywords":[],"suggestions":[],"strengths":[],"gaps":[],"recommendations":""}'
      );
    } catch (e) {
      console.error("Failed to parse OpenAI response:", e);
      llmResult = { 
        matchScore: 0, 
        missingKeywords: [], 
        suggestions: [],
        strengths: [],
        gaps: [],
        recommendations: "Unable to generate recommendations due to an error."
      };
    }

    return llmResult;
  }
} 