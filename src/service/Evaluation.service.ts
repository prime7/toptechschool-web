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
  recommendations: string[];
}

export class EvaluationService extends BaseService {
  private static readonly SYSTEM_PROMPT_JOB_MATCH = "You must respond with valid JSON only. No other text or explanation.";
  private static readonly SYSTEM_PROMPT_RESUME = "You are an expert resume analyzer with deep knowledge of hiring practices. Analyze the match between the provided job description and resume, then provide a detailed assessment.";
  private static readonly DEFAULT_RESPONSE_JOB_MATCH: JobMatchEvaluationResult = {
    matchScore: 0,
    missingKeywords: [],
    suggestions: [],
    strengths: [],
    gaps: [],
    recommendations: "Unable to generate recommendations due to an error."
  };
  private static readonly DEFAULT_RESPONSE_RESUME: ResumeEvaluationResult = {
    matchScore: 0,
    missingKeywords: [],
    suggestions: [],
    strengths: [],
    gaps: [], 
    recommendations: ["Unable to generate recommendations due to an error."]
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
          this.SYSTEM_PROMPT_JOB_MATCH,
          prompt,
          this.DEFAULT_RESPONSE_JOB_MATCH
        );
      },
      "Failed to evaluate job match"
    );
  }

  static async evaluateResume(
    resumeData: string,
    jobRole: JobRole | null
  ): Promise<ResumeEvaluationResult> {
    return this.handleError(
      async () => {
        const prompt = this.buildEvaluationPrompt("", resumeData, jobRole);
        return OpenAIService.getJsonResponse<ResumeEvaluationResult>(
          this.SYSTEM_PROMPT_RESUME,
          prompt,
          this.DEFAULT_RESPONSE_RESUME
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
      Analyze the provided resume and job details to generate a comprehensive evaluation:

      1. Calculate a detailed match score (0-100%) considering:
        - Technical Alignment (70%): Evaluate hard skills, technical qualifications, tools/technologies, certifications
        - Professional Skills (20%): Assess communication, leadership, problem-solving, teamwork abilities
        - Experience Match (10%): Compare years of experience, industry exposure, role responsibilities

      2. Identify key missing elements:
        - Required technical skills/tools not mentioned
        - Essential qualifications or certifications
        - Critical professional competencies
        - Industry-specific keywords

      3. For match scores >50%, provide actionable improvement suggestions:
        - Skill development recommendations
        - Certification opportunities
        - Experience gaps to address
        - Resume presentation improvements

      4. Highlight resume strengths:
        - Notable achievements
        - Valuable skills/expertise
        - Relevant experience
        - Unique qualifications

      5. Detail qualification gaps:
        - Missing required skills
        - Experience shortfalls
        - Education/certification needs
        - Industry knowledge gaps

      6. Provide prioritized recommendations:
        - Immediate action items
        - Medium-term development goals
        - Long-term career suggestions
        - Resume enhancement tips

      Return a JSON response with:
      {
        "matchScore": number (0-100),
        "missingKeywords": [string] (key missing elements),
        "suggestions": [string] (actionable improvements),
        "strengths": [string] (notable positives),
        "gaps": [string] (qualification gaps),
        "recommendations": [string] (prioritized next steps)
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
