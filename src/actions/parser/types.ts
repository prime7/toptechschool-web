import { Prisma } from "@prisma/client";

export type ResumeFields = keyof typeof Prisma.ResumeScalarFieldEnum;

export type ResumeContent = {
  name: string; // Name of the candidate
  email: string; // Professional email address
  phone: string; // Properly formatted phone number
  address: string; // City/State or full address
  education: string; // Highest degree or relevant certifications
  experience: string; // Professional experience summary
  skills: string[]; // List of skills or competencies
  certifications: string[]; // Relevant certifications or licenses
  languages: string[]; // Languages spoken fluently
  linkedIn: string; // Valid LinkedIn profile URL
  summary: string; // Professional summary or objective
  projects: string[]; // List of projects or relevant work
  portfolioUrl?: string; // Personal website/portfolio URL
  githubProfile?: string; // Valid GitHub profile URL
  yearsOfExperience?: number; // Years of professional experience
};

export type ResumeAnalysis = {
  documentFormatting: {
    isProperlyFormatted: boolean; // Checks for proper formatting like margins, fonts, spacing
    hasOptimalLength: boolean; // Checks if resume length is within 1-2 pages (300-700 words)
    hasAppropriateSpacing: boolean; // Checks for consistent line spacing (1.0-1.15)
    fontConsistency: boolean; // Checks for max 2 professional fonts (e.g. Arial, Calibri)
    marginAlignment: boolean; // Checks for standard margins (0.5-1 inch)
    sectionHeaders: boolean; // Checks for clear section headers with consistent formatting
    bulletPoints: boolean; // Checks for consistent bullet point style and alignment
  };
  contentQuality: {
    hasProfessionalSummary: boolean; // Checks for 3-5 sentence professional summary
    contactInfoPresent: {
      email: boolean; // Professional email address
      phone: boolean; // Properly formatted phone number
      address: boolean; // City/State or full address
      linkedIn: boolean; // Valid LinkedIn profile URL
      github: boolean; // Valid GitHub profile URL
      portfolio: boolean; // Personal website/portfolio URL
    };
    keywordAnalysis: Array<{
      term: string; // The keyword or phrase from job description
      occurrences: number; // Number of times the term appears
      frequencyPercentage: number; // Percentage of total keywords (aim for 3-5%)
      relevanceScore: number; // Match score against job requirements (0-100)
      context: string; // Surrounding text to verify proper usage
    }>;
    skillsSection: {
      technicalSkills: string[]; // List of technical/hard skills
      softSkills: string[]; // List of soft/interpersonal skills
      certifications: string[]; // List of relevant certifications
    };
  };
  hasProperFormatting: boolean; // Regex check for consistent spacing/newlines/formatting
  hasAppropriateLength: boolean; // Check for 300-700 words total
  hasReasonableLineBreaks: boolean; // Check for consistent paragraph breaks (no large gaps)
  containsEmail: boolean; // RFC 5322 email format validation
  containsPhone: boolean; // E.164 international phone number format
  containsLinkedIn: boolean; // Valid linkedin.com/in/* URL format
  readabilityScore?: number; // Flesch-Kincaid readability score (aim for 8-10)
  fileType: string; // PDF, DOCX, etc.
  fileSize: number; // Size in bytes (recommend < 1MB)
};

export type ResumeAnalysisResult = {
  content: ResumeContent;
  analysis: ResumeAnalysis;
  metadata: {
    analyzedAt: Date;
    confidenceScore: number;
    processingTime: number;
  };
};
