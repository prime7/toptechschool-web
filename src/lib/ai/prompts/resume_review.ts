import { JobRole } from "@prisma/client";

export const generateResumeReviewPrompt = (
  resumeData: string,
  jobRole: JobRole | null
): string => {
  return `
You are an expert resume analyzer with deep knowledge of hiring practices. Analyze the match between the provided job description and resume, then provide a detailed assessment.

Analyze the provided resume and job details to generate a comprehensive evaluation:

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

4. Highlight resume strengths:
   - Notable achievements
   - Valuable skills/expertise
   - Relevant experience
   - Unique qualifications

5. Detail qualification gaps:
   - Missing required skills
   - Experience shortfalls
   - Education/certification needs
   - Industry knowledge gaps

6. Provide prioritized recommendations:
   - Immediate action items
   - Medium-term development goals
   - Long-term career suggestions
   - Resume enhancement tips

Return a JSON response with:
{
  "matchScore": number (0-100),
  "missingKeywords": [string] (key missing elements),
  "suggestions": [string] (actionable improvements),
  "strengths": [string] (notable positives),
  "gaps": [string] (qualification gaps),
  "recommendations": [string] (prioritized next steps)
}
Resume Data: ${resumeData}
${jobRole ? `Job Role: ${jobRole}` : ""}
`;
};