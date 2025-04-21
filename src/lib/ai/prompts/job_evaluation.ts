  import { JobRole } from "@prisma/client";

export const generateJobMatchPrompt = (
  jobDescription: string,
  resumeData: string,
  jobRole: JobRole | null
): string => {
  return [
    `You are an expert job match analyzer with deep knowledge of technical roles and industry requirements.
     Analyze the match between the provided job description and resume.

     Analyze the provided job description and resume to generate a comprehensive evaluation:

     1. Calculate a detailed match score (0-100%) considering:
        - Technical Alignment (70%): Evaluate hard skills, technical qualifications, tools/technologies, certifications
        - Professional Skills (20%): Assess communication, leadership, problem-solving, teamwork abilities
        - Experience Match (10%): Compare years of experience, industry exposure, role responsibilities

     2. Identify key missing elements:
        - Required technical skills/tools not mentioned
        - Essential qualifications or certifications
        - Critical professional competencies
        - Industry-specific keywords

     3. For match scores >50%, provide actionable improvement suggestions:
        - Skill development recommendations
        - Certification opportunities
        - Experience gaps to address
        - Resume presentation improvements

     Return a JSON response with:
     {
       "matchScore": number (0-100),
       "missingKeywords": [string] (key missing elements),
       "suggestions": [string] (actionable improvements),
       "strengths": [string] (notable positives),
       "gaps": [string] (qualification gaps),
       "recommendations": string (prioritized next steps)
     }
    `,
    `Job Description: ${jobDescription}`,
    `Resume: ${resumeData}`,
    ...(jobRole ? [`Role Category: ${jobRole}`] : [])
  ].join("\n\n");
}
