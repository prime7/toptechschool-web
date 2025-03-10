import { Resend } from "resend";
import LeanCanvasEmailTemplate from "@/email-templates/LeanCanvasEmailTemplate";

export const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailResult = {
  success: boolean;
  data?: Record<string, unknown>;
  error?: {
    message: string;
  };
};

export async function sendTemplateRequestEmail(to: string): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      error: {
        message: "Missing Resend API key"
      }
    };
  }

  try {
    const data = await resend.emails.send({
      from: "Toptechschool <support@toptechschool.com>",
      to,
      subject: "Access your lean Startup Notion template",
      react: LeanCanvasEmailTemplate({ to }),
    });
    
    return { 
      success: true, 
      data: data as unknown as Record<string, unknown>
    };
  } catch (error) {
    return { 
      success: false, 
      error: {
        message: error instanceof Error ? error.message : "Unknown error sending email"
      }
    };
  }
}
