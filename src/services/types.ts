import { Prisma } from "@prisma/client";

export type ResumeFields = keyof typeof Prisma.ResumeScalarFieldEnum;

interface ResumeContent {
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  skills: string[];
  certifications: string;
  languages: string[];
}

interface ATSAnalysis {
  hasProperFormatting: boolean;
  hasAppropriateLength: boolean;
  hasReasonableLineBreaks: boolean;
  containsEmail: boolean;
  containsPhone: boolean;
  containsLinkedIn: boolean;
  keywordDensity: Array<{ keyword: string; count: number; density: number }>;
  readabilityScore: number;
  fileType: string;
}
export type ResumeDetailData = {
  content?: ResumeContent;
  atsAnalysis?: ATSAnalysis;
};
