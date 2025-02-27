export interface EvaluateJobInput {
  resumeId: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  jobDesc: string;
}

export interface EvaluateJobResponse {
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
}
