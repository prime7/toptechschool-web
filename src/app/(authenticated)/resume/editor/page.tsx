'use client';
import { ResumeEditor } from "@/components/resume-editor";
import { ResumeProvider } from "@/components/resume-editor/context/ResumeContext";

export default function ResumeEditorPage() {
  return (
    <ResumeProvider>
      <ResumeEditor />
    </ResumeProvider>
  );
}
