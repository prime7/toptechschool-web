import { Prisma } from "@prisma/client";

export type ResumeFields = keyof typeof Prisma.ResumeScalarFieldEnum;

export type ResumeContent = {
  name: string; 
  email: string; 
  phone: string; 
  address: string; 
  education: string; 
  experience: string; 
  skills: string[]; 
  linkedIn: string; 
  projects: string[]; 
  portfolioUrl?: string; 
  githubProfile?: string; 
};

export type ResumeAnalysis = {
  socials: {
    email: boolean;
    phone: boolean; 
    address: boolean;
    linkedIn: boolean;
    github: boolean;
    portfolio: boolean;
  };
  suggestions: string[];
};

export type ResumeAnalysisResult = {
  content: ResumeContent;
  analysis: ResumeAnalysis;
  parsed: boolean;
};
