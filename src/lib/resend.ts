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
  console.log(`RESEND_API_KEY length: ${process.env.RESEND_API_KEY?.length || 0}`);
  
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
    // Enhanced error logging with more details
    console.error("Error sending template request email:", error);
    
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    // Check if it's a Resend API error with specific structure
    const resendError = error as { 
      statusCode?: number; 
      name?: string;
      message?: string;
      data?: unknown;
    };
    
    if (resendError.statusCode) {
      console.error("Resend API status code:", resendError.statusCode);
      console.error("Resend API error data:", resendError.data);
    }
    
    // Extract detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error sending email";
    const errorDetails = error instanceof Error 
      ? { 
          ...((error as unknown as { details?: Record<string, unknown> }).details || {}),
          statusCode: (error as unknown as { statusCode?: number }).statusCode,
          data: (error as unknown as { data?: unknown }).data
        } 
      : undefined;
    const errorCode = error instanceof Error 
      ? (error as unknown as { code?: string }).code || error.name 
      : undefined;
    
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

