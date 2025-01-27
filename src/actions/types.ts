import { Prisma } from "@prisma/client";

export type ResumeField = keyof typeof Prisma.ResumeScalarFieldEnum;

export type ParsedResumeContent = {
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  skills: string[];
  certifications: string;
  languages: string[];
  linkedIn: string;
  summary: string;
  projects: string[];
};

export type ATSAnalysisResult = {
  hasProperFormatting: boolean;
  hasAppropriateLength: boolean;
  hasReasonableLineBreaks: boolean;
  hasSummary: boolean;
  hasCertifications: boolean;
  hasProjects: boolean;
  containsEmail: boolean;
  containsPhone: boolean;
  containsLinkedIn: boolean;
  keywordDensity: Array<{ keyword: string; count: number; density: number }>;
  readabilityScore: number;
  fileType: string;
};

export type ResumeAnalysisData = {
  content?: ParsedResumeContent;
  atsAnalysis?: ATSAnalysisResult;
};
