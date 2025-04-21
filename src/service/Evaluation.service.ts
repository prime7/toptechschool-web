import { JobRole } from "@prisma/client";
import { BaseService } from "./Base.service";
import { getPracticeSet } from "@/actions/practice";
import { ai, generateJobMatchPrompt, generateResumeReviewPrompt, generatePracticePrompt } from "@/lib/ai/index";

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

export interface QuestionAnalysis {
  questionText: string;
  answer: string;
  feedback: string;
  improvement: string;
}

export interface PracticeTestAnalysisResult {
  questionAnalysis: QuestionAnalysis[];
}

export class EvaluationService extends BaseService {
  private static readonly DEFAULT_RESPONSES = {
    jobMatch: {
      matchScore: 0,
      missingKeywords: [],
      suggestions: [],
      strengths: [],
      gaps: [],
      recommendations: "Unable to generate recommendations due to an error."
    } as JobMatchEvaluationResult,

    resume: {
      matchScore: 0,
      missingKeywords: [],
      suggestions: [],
      strengths: [],
      gaps: [],
      recommendations: ["Unable to generate recommendations due to an error."]
    } as ResumeEvaluationResult,

    practice: {
      questionAnalysis: []
    } as PracticeTestAnalysisResult
  };

  static async evaluateJobMatch(
    jobDescription: string,
    resumeData: string,
    jobRole: JobRole | null,
    userId: string
  ): Promise<JobMatchEvaluationResult> {
    return this.handleError(
      async () => {
        try {
          const prompt = generateJobMatchPrompt(jobDescription, resumeData, jobRole);
          const response = await ai.generateResponse({
            prompt,
            model: "claude-3-haiku-20240307",
            requestType: "job_evaluation",
            userId
          });
          return JSON.parse(response.text) as JobMatchEvaluationResult;
        } catch {
          return this.DEFAULT_RESPONSES.jobMatch;
        }
      },
      "Failed to evaluate job match"
    );
  }

  static async evaluateResume(
    resumeData: string,
    jobRole: JobRole | null,
    userId: string
  ): Promise<ResumeEvaluationResult> {
    return this.handleError(
      async () => {
        try {
          const prompt = generateResumeReviewPrompt(resumeData, jobRole);
          const response = await ai.generateResponse({
            prompt: prompt,
            model: "claude-3-haiku-20240307",
            requestType: "resume_review",
            userId,
            provider: "anthropic"
          });
          return JSON.parse(response.text) as ResumeEvaluationResult;
        } catch {
          return this.DEFAULT_RESPONSES.resume;
        }
      },
      "Failed to evaluate resume"
    );
  }

  static async analyzePracticeTest(
    practiceTestId: string,
    items: { question: string; answer: string }[],
    userId: string
  ): Promise<PracticeTestAnalysisResult> {
    return this.handleError(
      async () => {
        try {
          const practiceSet = await getPracticeSet(practiceTestId);
          if (!practiceSet) {
            throw new Error("Practice set not found");
          }

          const prompt = generatePracticePrompt(practiceSet.prompt, items);
          const response = await ai.generateResponse({
            prompt,
            model: "claude-3-haiku-20240307",
            requestType: "practice_evaluation",
            userId
          });
          return JSON.parse(response.text) as PracticeTestAnalysisResult;
        } catch {
          return this.DEFAULT_RESPONSES.practice;
        }
      },
      "Failed to analyze practice test"
    );
  }
} 
