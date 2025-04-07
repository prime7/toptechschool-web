import { Resend } from "resend";
import LeanCanvasEmailTemplate from "@/email-templates/LeanCanvasEmailTemplate";
import EmailVerificationTemplate from "@/email-templates/EmailVerificationTemplate";

const FROM_EMAIL = "Toptechschool <support@toptechschool.com>";

export const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailResult = {
  success: boolean;
  data?: Record<string, unknown>;
  error?: {
    message: string;
  };
};

const checkApiKey = (): EmailResult | null => {
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      error: { message: "Missing Resend API key" }
    };
  }
  return null;
};

const handleEmailError = (error: unknown): EmailResult => ({
  success: false,
  error: {
    message: error instanceof Error ? error.message : "Unknown error sending email"
  }
});

export const sendTemplateRequestEmail = async (to: string): Promise<EmailResult> => {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Access your lean Startup Notion template",
      react: LeanCanvasEmailTemplate({ to }),
    });
    
    return { 
      success: true, 
      data: data as unknown as Record<string, unknown>
    };
  } catch (error) {
    return handleEmailError(error);
  }
};

export const sendEmailVerificationEmail = async (to: string, verificationUrl: string): Promise<EmailResult> => {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Verify your email address",
      react: EmailVerificationTemplate({ verificationUrl }),
    });

    return {
      success: true,
      data: data as unknown as Record<string, unknown>
    };
  } catch (error) {
    return handleEmailError(error);
  }
};