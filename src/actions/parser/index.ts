"use server";

import { prisma } from "@/lib/prisma";
import axios from "axios";
import pdf from "pdf-parse";
import { ResumeContent, ResumeAnalysis } from "./types";
import { getPresignedUrl } from "@/lib/r2";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseResumeAndAnalyzeATS(
  resumeId: string
): Promise<ResumeContent & { analysis: ResumeAnalysis }> {
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

    // Calculate metrics using utility functions
    const readabilityScore = calculateReadabilityScore(text);
    const documentFormatting = analyzeDocumentFormatting(text);

    const prompt = `Extract, analyze and provide keyword analysis for the following resume text. Provide:
1. Structured fields:
- Name
- Email 
- Phone
- Address
- LinkedIn URL
- GitHub URL
- Portfolio URL

2. Content sections:
- Education history
- Work experience
- Skills list
- Certifications
- Languages
- Projects
- Professional summary
- Years of experience (numeric)

3. ATS Analysis:
- Content quality evaluation
- Skills categorization (technical vs soft)

4. Keyword Analysis:
Analyze the frequency and relevance of key terms in the resume.

Resume text:
${text}

Format your response as a valid JSON object with the following structure:
{
  "content": {
    "name": "string",
    "email": "string",
    "phone": "string", 
    "address": "string",
    "linkedIn": "string",
    "githubProfile": "string",
    "portfolioUrl": "string",
    "education": "string",
    "experience": "string",
    "skills": ["string"],
    "certifications": ["string"],
    "languages": ["string"],
    "projects": ["string"],
    "summary": "string",
    "yearsOfExperience": "number"
  },
  "analysis": {
    "contentQuality": {
      "hasProfessionalSummary": "boolean",
      "contactInfoPresent": {
        "email": "boolean",
        "phone": "boolean",
        "address": "boolean",
        "linkedIn": "boolean",
        "github": "boolean",
        "portfolio": "boolean"
      },
      "skillsSection": {
        "technicalSkills": ["string"],
        "softSkills": ["string"],
        "certifications": ["string"]
      }
    },
    "keywordAnalysis": [{
      "term": "string",
      "occurrences": "number",
      "frequencyPercentage": "number",
      "relevanceScore": "number",
      "context": "string"
    }]
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You must respond with valid JSON only. No other text or explanation."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      max_tokens: 10000,
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    let llmResult;
    try {
      llmResult = JSON.parse(completion.choices[0].message.content || '{"content":{},"analysis":{}}');
    } catch (e) {
      console.error("Failed to parse OpenAI response:", e);
      llmResult = {"content":{},"analysis":{}};
    }

    // Combine LLM results with calculated metrics
    const result = {
      content: llmResult.content,
      analysis: {
        ...llmResult.analysis,
        documentFormatting,
        hasProperFormatting: documentFormatting.isProperlyFormatted,
        hasAppropriateLength: documentFormatting.hasOptimalLength,
        hasReasonableLineBreaks: documentFormatting.hasAppropriateSpacing,
        containsEmail:
          llmResult.analysis.contentQuality.contactInfoPresent.email,
        containsPhone:
          llmResult.analysis.contentQuality.contactInfoPresent.phone,
        containsLinkedIn:
          llmResult.analysis.contentQuality.contactInfoPresent.linkedIn,
        readabilityScore,
        fileType: "pdf",
        fileSize: response.data.length,
        contentQuality: {
          ...llmResult.analysis.contentQuality,
          keywordAnalysis: llmResult.analysis.keywordAnalysis,
        },
      },
    };

    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        content: result.content,
        analysis: result.analysis,
        parsed: "PARSED",
      },
    });

    return { ...result.content, analysis: result.analysis };
  } catch (error) {
    await prisma.resume.update({
      where: { id: resumeId },
      data: { parsed: "ERROR" },
    });
    throw error;
  }
}

function analyzeDocumentFormatting(text: string) {
  // Check proper formatting
  const hasConsistentSpacing = /^(?:[^\n]*\n){2,}[^\n]*$/.test(text);
  const hasProperMargins = text.split('\n').every(line => line.length < 100);
  
  // Check length
  const wordCount = text.split(/\s+/).length;
  const hasOptimalLength = wordCount >= 300 && wordCount <= 700;

  // Check spacing
  const lineSpacing = text.split('\n').length / wordCount;
  const hasAppropriateSpacing = lineSpacing >= 0.05 && lineSpacing <= 0.1;

  // Check font consistency by looking for markdown-style formatting
  const fontStyles = text.match(/[*_~`].*?[*_~`]/g) || [];
  const fontConsistency = fontStyles.length < 3;

  // Check margins by looking at line length variance
  const lineVariance = Math.max(...text.split('\n').map(l => l.length)) - 
                      Math.min(...text.split('\n').map(l => l.length));
  const marginAlignment = lineVariance < 20;

  // Check section headers
  const sectionHeaders = /^[A-Z][^a-z]{2,}.*?$/m.test(text);

  // Check bullet points
  const bulletPoints = /^[\s]*[•\-\*][\s].*$/m.test(text);

  return {
    isProperlyFormatted: hasConsistentSpacing && hasProperMargins,
    hasOptimalLength,
    hasAppropriateSpacing,
    fontConsistency,
    marginAlignment,
    sectionHeaders,
    bulletPoints
  };
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  return word.match(/[aeiouy]{1,2}/g)?.length || 1;
}

function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/);
  const words = text.split(/\s+/);
  const syllables = words.reduce(
    (count, word) => count + countSyllables(word),
    0
  );

  const averageWordsPerSentence = words.length / sentences.length;
  const averageSyllablesPerWord = syllables / words.length;

  // Flesch-Kincaid Grade Level
  const readabilityScore =
    0.39 * averageWordsPerSentence + 11.8 * averageSyllablesPerWord - 15.59;

  return Math.round(readabilityScore * 10) / 10; // Round to one decimal place
}
