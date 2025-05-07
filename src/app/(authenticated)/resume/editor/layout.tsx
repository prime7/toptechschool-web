import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Editor | Create Professional Resumes",
  description: "Create, customize, and download professional resumes with our easy-to-use resume editor. Perfect for job seekers and professionals.",
  keywords: ["resume builder", "CV builder", "resume editor", "professional resume", "job application"],
  openGraph: {
    title: "Resume Editor | Create Professional Resumes",
    description: "Create, customize, and download professional resumes with our easy-to-use resume editor.",
    images: ["/og-resume-editor.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Editor | Create Professional Resumes",
    description: "Create, customize, and download professional resumes with our easy-to-use resume editor.",
    images: ["/og-resume-editor.jpg"],
  }
};

export default function ResumeEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 