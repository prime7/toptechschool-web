import { JobRole } from "@prisma/client";
import { OpenAIService } from "./OpenAI.service";
import { BaseService } from "./Base.service";

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

export class EvaluationService extends BaseService {
  private static readonly SYSTEM_PROMPT = "You must respond with valid JSON only. No other text or explanation.";
  private static readonly DEFAULT_RESPONSE: JobMatchEvaluationResult = {
    matchScore: 0,
    missingKeywords: [],
    suggestions: [],
    strengths: [],
    gaps: [],
    recommendations: "Unable to generate recommendations due to an error."
  };

  static async evaluateJobMatch(
    jobDescription: string,
    resumeData: string,
    jobRole: JobRole | null
  ): Promise<JobMatchEvaluationResult> {
    return this.handleError(
      async () => {
        const prompt = this.buildEvaluationPrompt(jobDescription, resumeData, jobRole);
        return OpenAIService.getJsonResponse<JobMatchEvaluationResult>(
          this.SYSTEM_PROMPT,
          prompt,
          this.DEFAULT_RESPONSE
        );
      },
      "Failed to evaluate job match"
    );
  }

  static async evaluateResume(
    resumeData: string,
    jobRole: JobRole | null
  ): Promise<JobMatchEvaluationResult> {
    return this.handleError(
      async () => {
        const prompt = this.buildEvaluationPrompt("", resumeData, jobRole);
        return OpenAIService.getJsonResponse<JobMatchEvaluationResult>(
          this.SYSTEM_PROMPT,
          prompt,
          this.DEFAULT_RESPONSE
        );
      },
      "Failed to evaluate resume"
    );
  }

  private static buildEvaluationPrompt(
    jobDescription: string,
    resumeData: string,
    jobRole: JobRole | null
  ): string[] {
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

    return [
      prompt,
      ...(jobDescription ? [`Job Description: ${jobDescription}`] : []),
      `Resume Data: ${resumeData}`,
      ...(jobRole ? [`Job Role: ${jobRole}`] : []),
    ];
  }
} 
