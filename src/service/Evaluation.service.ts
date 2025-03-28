import { JobRole } from "@prisma/client";
import { OpenAIService } from "./OpenAI.service";

export interface JobMatchEvaluationResult {
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  gaps: string[];
  recommendations: string;
}

export interface ResumeEvaluationResult {
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
    const systemPrompt = "You must respond with valid JSON only. No other text or explanation.";

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

    const messages = [
      prompt,
      `Job Description: ${jobDescription}`,
      `Resume Data: ${resumeData}`,
      `Job Role: ${jobRole}`,
    ];

    const defaultResponse: JobMatchEvaluationResult = {
      matchScore: 0,
      missingKeywords: [],
      suggestions: [],
      strengths: [],
      gaps: [],
      recommendations: "Unable to generate recommendations due to an error."
    };

    return OpenAIService.getJsonResponse<JobMatchEvaluationResult>(
      systemPrompt,
      messages,
      defaultResponse
    );
  }

  static async evaluateResume(
    resumeData: string,
    jobRole: JobRole | null
  ): Promise<JobMatchEvaluationResult> {
    const systemPrompt = "You must respond with valid JSON only. No other text or explanation.";

    const prompt = `
      Analyze the following resume data and provide a detailed evaluation of the candidate's skills and experience.
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

    const messages = [
      prompt,
      `Resume Data: ${resumeData}`,
      `Job Role: ${jobRole}`,
    ];

    const defaultResponse: JobMatchEvaluationResult = {
      matchScore: 0,
      missingKeywords: [],
      suggestions: [],
      strengths: [],
      gaps: [],
      recommendations: "Unable to generate recommendations due to an error."
    };

    return OpenAIService.getJsonResponse<JobMatchEvaluationResult>(
      systemPrompt,
      messages,
      defaultResponse
    );
  }
} 
