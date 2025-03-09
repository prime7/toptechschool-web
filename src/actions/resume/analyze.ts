"use server";

import { prisma } from "@/lib/prisma";
import axios from "axios";
import pdf from "pdf-parse";
import { ResumeAnalysisResult } from "./types";
import { getPresignedUrl } from "@/lib/r2";
import { openai } from "@/lib/openai";
import { JobRole } from "@prisma/client";

export async function analyzeResume(
  resumeId: string,
  jobRole?: JobRole
): Promise<ResumeAnalysisResult> {
  try {
    await prisma.resume.update({
      where: { id: resumeId },
      data: { parsed: "STARTED" },
    });

    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume) throw new Error("Resume not found");

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
      }

      IMPORTANT:
      - For missing information, use null or empty arrays
      - Evaluate each social media presence as true/false based on whether valid information was found
      - Provide 3-5 specific, actionable suggestions to improve the resume
      - Ensure suggestions are relevant to the target job role when specified`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You must respond with valid JSON only. No other text or explanation.",
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
