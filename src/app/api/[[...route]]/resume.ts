import { Hono } from "hono";
import { validator } from "hono/validator";
import { prisma } from "@/lib/prisma";
import { parseResumeAndAnalyzeATS } from "@/lib/parser";

const resumeApp = new Hono();

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

resumeApp.get(
  "/:resumeId",
  validator("param", (value, c) => {
    const { resumeId } = value;
    if (!uuidPattern.test(resumeId)) {
      return c.json({ message: "Invalid resumeId format" }, 400);
    }
    return { resumeId };
  }),
  async (c) => {
    try {
      const { resumeId } = c.req.valid("param");
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
      });

      if (!resume) {
        return c.json({ message: "Resume not found" }, 404);
      }

      let response;

      switch (resume.parsed) {
        case "NOT_STARTED":
          parseResumeAndAnalyzeATS(resume.id).catch(console.error);
          response = { message: "Resume parsing initiated" };
          break;
        case "STARTED":
          response = { message: "Resume is being parsed" };
          break;
        case "PARSED":
          response = {
            message: "Resume parsed successfully",
            content: resume.content,
            atsAnalysis: resume.atsAnalysis,
          };
          break;
        case "ERROR":
          response = { message: "Error occurred during parsing" };
          return c.json(response, 500);
        default:
          response = { message: "Unknown resume state" };
          return c.json(response, 500);
      }

      return c.json(response);
    } catch (error) {
      console.error("Error processing resume request:", error);
      return c.json({ message: "Error processing resume request" }, 500);
    }
  }
);

export default resumeApp;
