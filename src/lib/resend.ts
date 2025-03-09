import { Resend } from "resend";
import TemplateRequestEmail from "@/emails/TemplateRequestEmail";

export const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailResult = {
  success: boolean;
  data?: Record<string, unknown>;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
};

export async function sendTemplateRequestEmail(to: string): Promise<EmailResult> {
  // Log environment info for debugging
  console.log(`Sending email in environment: ${process.env.NODE_ENV}`);
  console.log(`RESEND_API_KEY configured: ${!!process.env.RESEND_API_KEY}`);
  
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      error: {
        message: "Missing Resend API key",
        code: "MISSING_API_KEY"
      }
    };
  }

  try {
    const data = await resend.emails.send({
      from: "Toptechschool <support@toptechschool.com>",
      to,
      subject: "Access your lean Startup Notion template",
      react: TemplateRequestEmail({ to }),
    });

    console.log("Email sent successfully:", data);
    
    return { 
      success: true, 
      data: data as unknown as Record<string, unknown>
    };
  } catch (error) {
    // Enhanced error logging
    console.error("Error sending template request email:", error);
    
    // Extract detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error sending email";
    const errorDetails = error instanceof Error ? (error as unknown as { details?: Record<string, unknown> }).details : undefined;
    const errorCode = error instanceof Error ? (error as unknown as { code?: string }).code : undefined;
    
    return { 
      success: false, 
      error: {
        message: errorMessage,
        code: errorCode,
        details: errorDetails
      }
    };
  }
}

