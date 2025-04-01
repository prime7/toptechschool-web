import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { getPresignedUrl } from "@/lib/r2";
import axios from "axios";
import pdf from "pdf-parse";
import { EvaluationService } from "@/service/Evaluation.service";

export const analyzeResume = inngest.createFunction(
  { id: "analyze-resume" },
  { event: "resume/analyze" },
  async ({ event, step }) => {
    const { resumeId, userId, jobRole } = event.data;

    const { text } = await step.run("prepare-resume", async () => {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId },
      });
      if (!resume) throw new Error("Resume not found");
      if (!resume.fileKey) throw new Error("Resume file not found");
      
      await prisma.resume.update({
        where: { id: resumeId },
        data: { parsed: "STARTED" },
      });

      const presignedUrl = await getPresignedUrl(resume.fileKey);
      const response = await axios.get(presignedUrl, {
        timeout: 30000,
        responseType: "arraybuffer",
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch resume. Status: ${response.status}`);
      }

      const pdfData = await pdf(response.data);
      if (!pdfData.text || pdfData.text.trim().length === 0) {
        throw new Error("No text content found in the PDF");
      }

      return { resume, text: pdfData.text };
    });

    const result = await step.run("analyze-and-save", async () => {
      const evaluation = await EvaluationService.evaluateResume(text, jobRole ?? null);
      
      await prisma.resume.update({
        where: { id: resumeId },
        data: {
          analysis: JSON.parse(JSON.stringify(evaluation)),
          parsed: "PARSED",
        },
      });

      return evaluation;
    });

    return result;
  }
);
