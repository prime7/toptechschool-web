import TemplateRequestEmail from "@/emails/TemplateRequestEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTemplateRequestEmail(to: string) {
  try {
    const result = await resend.emails.send({
      from: "Toptechschool <onboarding@resend.dev>",
      to,
      subject: "Access your lean Startup Notion template",
      react: TemplateRequestEmail({ to }),
    });
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error sending template request email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to send email" 
    };
  }
}
