import { BaseService } from "./Base.service";
import {
  ai,
  generateJobMatchPrompt,
  generateResumeReviewPrompt,
  generatePracticePrompt,
} from "@/lib/ai/index";

export interface JobMatchEvaluationResult {
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  gaps: string[];
  recommendations: string;
}

export interface ResumeEvaluationResult {
  overallScore: number;
  detailedAreasForImprovement: Array<{
    area: string;
    referenceText: string;
    improvedText: string;
    relevanceToRoleCategory: string;
  }>;
  missingSkills: string[];
  redFlags: string[];
}

export interface PracticeAnswerAnalysisResult {
  score: number;
  feedback: string;
  suggestions: string[];
}

export class EvaluationService extends BaseService {
  private static readonly DEFAULT_RESPONSES = {
    jobMatch: {
      matchScore: 0,
      missingKeywords: [],
      suggestions: [],
      strengths: [],
      gaps: [],
      recommendations: "Unable to generate recommendations due to an error.",
    } as JobMatchEvaluationResult,

    resume: {
      overallScore: 0,
      detailedAreasForImprovement: [],
      missingSkills: [],
      redFlags: [],
    } as ResumeEvaluationResult,

    practice: {
      score: 0,
      feedback: "",
      suggestions: [],
    } as PracticeAnswerAnalysisResult,
  };

  static async evaluateJobMatch(
    jobDescription: string,
    resumeData: string,
    profession: string | null,
    userId: string
  ): Promise<JobMatchEvaluationResult> {
    return this.handleError(async () => {
      try {
        const prompt = generateJobMatchPrompt(
          jobDescription,
          resumeData,
          profession
        );
        const response = await ai.generateResponse({
          prompt,
          model: "claude-3-haiku-20240307",
          requestType: "job_evaluation",
          maxTokens: 4096,
          userId,
        });
        return JSON.parse(response.text) as JobMatchEvaluationResult;
      } catch {
        return this.DEFAULT_RESPONSES.jobMatch;
      }
    }, "Failed to evaluate job match");
  }

  static async evaluateResume(
    resumeData: string,
    profession: string | null,
    userId: string
  ): Promise<ResumeEvaluationResult> {
    return this.handleError(async () => {
      try {
        const prompt = generateResumeReviewPrompt({ resumeData, profession });
        const response = await ai.generateResponse({
          prompt: prompt,
          model: "claude-3-5-haiku-20241022",
          requestType: "resume_review",
          userId,
          provider: "anthropic",
        });
        return JSON.parse(response.text) as ResumeEvaluationResult;
      } catch (error) {
        console.error("Error evaluating resume", error);
        return this.DEFAULT_RESPONSES.resume;
      }
    }, "Failed to evaluate resume");
  }

  static async analyzePracticeAnswer(
    questionId: string,
    answer: string,
    userId: string
  ): Promise<PracticeAnswerAnalysisResult> {
    return this.handleError(async () => {
      try {
        const prompt = generatePracticePrompt(questionId, answer);
        const response = await ai.generateResponse({
          prompt,
          model: "claude-3-5-haiku-20241022",
          requestType: "practice_evaluation",
          userId,
        });
        return JSON.parse(response.text) as PracticeAnswerAnalysisResult;
      } catch {
        return this.DEFAULT_RESPONSES.practice;
      }
    }, "Failed to analyze practice answer");
  }
}
