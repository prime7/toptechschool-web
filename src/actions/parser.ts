"use server";

import { prisma } from "@/lib/prisma";
import axios from "axios";
import pdf from "pdf-parse";
import { ParsedResumeContent, ATSAnalysisResult } from "./types";
import { getPresignedUrl } from "@/lib/r2";

export async function parseResumeAndAnalyzeATS(
  resumeId: string
): Promise<ParsedResumeContent & { atsAnalysis: ATSAnalysisResult }> {
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

    const parsedContent = extractResumeContent(text);
    const atsAnalysis = analyzeATSFriendliness(text);

    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        content: parsedContent,
        atsAnalysis: atsAnalysis,
        parsed: "PARSED",
      },
    });

    return { ...parsedContent, atsAnalysis };
  } catch (error) {
    await prisma.resume.update({
      where: { id: resumeId },
      data: { parsed: "ERROR" },
    });
    throw error;
  }
}

function extractResumeContent(text: string): ParsedResumeContent {
  return {
    name: text.match(/Name:\s*(.*)/i)?.[1]?.trim() || "Unknown",
    email: text.match(/Email:\s*([\w.-]+@[\w.-]+\.\w+)/i)?.[1]?.trim() || "Unknown",
    phone:
      text.match(
        /Phone:\s*(\+?1?\s*\(?[0-9]{3}[\s.-]?\)?[0-9]{3}[\s.-]?[0-9]{4})/i
      )?.[1]?.trim() || "Unknown",
    address: text.match(/Address:\s*(.*)/i)?.[1]?.trim() || "Unknown",
    education: text.match(/Education:[\s\S]*?(?=\n\n|\Z)/i)?.[0]?.trim() || "Not found",
    experience:
      text.match(/Experience:[\s\S]*?(?=\n\n|\Z)/i)?.[0]?.trim() || "Not found",
    skills:
      text
        .match(/Skills:[\s\S]*?(?=\n\n|\Z)/i)?.[0]
        ?.split(",")
        .map((s) => s.trim()) || [],
    certifications:
      text.match(/Certifications:[\s\S]*?(?=\n\n|\Z)/i)?.[0]?.trim() || "Not found",
    languages:
      text
        .match(/Languages:[\s\S]*?(?=\n\n|\Z)/i)?.[0]
        ?.split(",")
        .map((s) => s.trim()) || [],
    linkedIn: text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0]?.trim() || "Not found",
    summary: text.match(/Summary:[\s\S]*?(?=\n\n|\Z)/i)?.[0]?.trim() || "Not found",
    projects:
      text
        .match(/Projects:[\s\S]*?(?=\n\n|\Z)/i)?.[0]
        ?.split("\n")
        .map((s) => s.trim()) || [],
  };
}

function analyzeATSFriendliness(text: string): ATSAnalysisResult {
  const lineBreaks = text.split(/\n/).length;
  const wordCount = text.split(/\s+/).length;

  return {
    hasProperFormatting: !text.match(/\btable\b|\bfont\b|\bheader\b|\bfooter\b/i),
    hasAppropriateLength: wordCount > 300 && wordCount < 20000,
    hasReasonableLineBreaks: lineBreaks < 200,
    containsEmail: !!text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/),
    containsPhone: !!text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/),
    containsLinkedIn: !!text.match(/linkedin\.com\/in\/[\w-]+/i),
    keywordDensity: calculateKeywordDensity(text),
    readabilityScore: calculateReadabilityScore(text),
    fileType: "PDF",
    hasSummary: !!text.match(/Summary:[\s\S]*?(?=\n\n|\Z)/i),
    hasCertifications: !!text.match(/Certifications:[\s\S]*?(?=\n\n|\Z)/i),
    hasProjects: !!text.match(/Projects:[\s\S]*?(?=\n\n|\Z)/i),
  };
}

function calculateKeywordDensity(
  text: string
): Array<{ keyword: string; count: number; density: number }> {
  const commonKeywords = [
    "experience",
    "skills",
    "education",
    "project",
    "achievement",
    "responsibility",
    "leadership",
    "communication",
    "technical",
    "analytical",
  ];
  const wordCount = text.split(/\s+/).length;
  const keywordCounts = commonKeywords.map((keyword) => ({
    keyword,
    count: (text.match(new RegExp(`\\b${keyword}\\b`, "gi")) || []).length,
    density:
      ((text.match(new RegExp(`\\b${keyword}\\b`, "gi")) || []).length /
        wordCount) *
      100,
  }));
  return keywordCounts;
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

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  return word.match(/[aeiouy]{1,2}/g)?.length || 1;
}