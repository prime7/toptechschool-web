import { prisma } from "@/lib/prisma";
import { Resume, JobRole, ParsingStatus } from "@prisma/client";
import { getPresignedUrl, getSignedUrlForUpload } from "@/lib/r2";
import { openai } from "@/lib/openai";
import axios from "axios";
import pdf from "pdf-parse";

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
  parsed: ParsingStatus;
};

export class ResumeService {
  static async getUserResumes(userId: string, options?: {
    take?: number;
    orderBy?: "asc" | "desc";
    select?: string[];
  }) {
    return prisma.resume.findMany({
      where: { userId },
      select: options?.select 
        ? Object.fromEntries(options.select.map(field => [field, true]))
        : {
            id: true,
            filename: true,
            jobRole: true,
            createdAt: true,
            updatedAt: true,
          },
      orderBy: options?.orderBy ? { createdAt: options.orderBy } : undefined,
      take: options?.take,
    });
  }

  static async getResumeById(resumeId: string, userId: string) {
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId,
      },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    return resume;
  }

  static async createResume(userId: string, data: {
    filename: string;
    fileType: string;
    jobRole?: JobRole;
  }) {
    const resume = await prisma.resume.create({
      data: {
        userId,
        filename: data.filename,
        fileKey: "",
        jobRole: data.jobRole,
      },
    });

    const key = `resumes/${userId}/${resume.id}/${crypto.randomUUID().slice(0, 6)}.pdf`;
    const signedUrl = await getSignedUrlForUpload(key, data.fileType);
    const encodedKey = encodeURIComponent(key);
    
    await prisma.resume.update({
      where: { id: resume.id },
      data: { fileKey: encodedKey },
    });

    return { signedUrl, resumeId: resume.id };
  }

  static async updateResume(resumeId: string, userId: string, data: {
    filename?: string;
    jobRole?: JobRole;
  }) {
    const resume = await this.getResumeById(resumeId, userId);
    
    return prisma.resume.update({
      where: { id: resumeId },
      data,
    });
  }

  static async deleteResume(resumeId: string, userId: string) {
    const resume = await this.getResumeById(resumeId, userId);
    
    return prisma.resume.delete({
      where: { id: resumeId },
    });
  }

  static async analyzeResume(resumeId: string, userId: string, jobRole?: JobRole): Promise<ResumeAnalysisResult> {
    const resume = await this.getResumeById(resumeId, userId);

    try {
      await prisma.resume.update({
        where: { id: resumeId },
        data: { parsed: "STARTED" },
      });

      const presignedUrl = await getPresignedUrl(resume.fileKey);
      const response = await axios.get(presignedUrl, {
        timeout: 5000,
        responseType: "arraybuffer",
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch resume. Status: ${response.status}`);
      }

      const pdfData = await pdf(response.data);
      const text = pdfData.text;

      const prompt = `Analyze the following resume text and extract structured information.
        TASK:
        1. Extract personal information and contact details
        2. Identify education, experience, skills, and projects
        3. Evaluate the resume's completeness
        4. Provide actionable improvement suggestions based on the target job role: ${resume.jobRole || "General"}

        EXTRACTION REQUIREMENTS:
        - Name: Full name of the candidate
        - Email: Complete email address
        - Phone: Phone number with country code if available
        - Address: Location/city/state/country
        - LinkedIn: Complete LinkedIn URL
        - GitHub: Complete GitHub profile URL
        - Portfolio: Personal website or portfolio URL
        - Education: All educational qualifications with institutions and dates
        - Experience: Work history with company names, positions, dates, and key responsibilities
        - Skills: Technical and soft skills as a list
        - Projects: Notable projects with descriptions

        RESUME TEXT:
        ${text}

        TARGET JOB ROLE:
        ${jobRole || "General"}

        FORMAT RESPONSE AS VALID JSON:
        {
          "content": {
            "name": "string", 
            "email": "string", 
            "phone": "string", 
            "address": "string", 
            "education": "string", 
            "experience": "string", 
            "skills": ["string"], 
            "linkedIn": "string", 
            "projects": ["string"], 
            "portfolioUrl": "string", 
            "githubProfile": "string"
          },
          "analysis": {
            "socials": {
              "email": boolean,
              "phone": boolean, 
              "address": boolean,
              "linkedIn": boolean,
              "github": boolean,
              "portfolio": boolean
            },
            "suggestions": ["string"]
          }
        }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You must respond with valid JSON only. No other text or explanation.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 10000,
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      let llmResult;
      try {
        llmResult = JSON.parse(
          completion.choices[0].message.content || '{"content":{},"analysis":{}}'
        );
      } catch (e) {
        console.error("Failed to parse OpenAI response:", e);
        llmResult = { content: {}, analysis: {} };
      }

      const result: ResumeAnalysisResult = {
        content: llmResult.content,
        analysis: llmResult.analysis,
        parsed: "PARSED",
      };

      await prisma.resume.update({
        where: { id: resumeId },
        data: {
          content: result.content,
          analysis: result.analysis,
          parsed: "PARSED",
        },
      });

      return result;
    } catch (error) {
      await prisma.resume.update({
        where: { id: resumeId },
        data: { parsed: "ERROR" },
      });
      throw error;
    }
  }
} 