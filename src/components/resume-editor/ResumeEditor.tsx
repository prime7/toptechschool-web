"use client";

import React from "react";
import { SectionType, ResumeData } from "./types";
import {
  useResume,
  blankResumeData,
  // initialResumeData,
  ResumeProvider,
} from "./context/ResumeContext";
import { PDFViewer } from "@react-pdf/renderer/lib/react-pdf.browser";
import ResumePDFDocument from "./ResumePDFDocument";
import Sidebar from "./Sidebar";
import {
  EducationSection,
  WorkSection,
  PersonalInfoSection,
  ProjectsSection,
  SummarySection,
} from "./sections";
import { useDebounce } from "@/hooks/use-debounce";

const SECTION_COMPONENTS: Record<SectionType, React.ComponentType> = {
  personal: PersonalInfoSection,
  summary: SummarySection,
  work: WorkSection,
  education: EducationSection,
  projects: ProjectsSection,
};

interface ResumeEditorProps {
  data?: ResumeData;
}

export default function ResumeEditor({ data }: ResumeEditorProps) {
  return (
    <ResumeProvider initialState={blankResumeData} userData={data}>
      <ResumeEditorContent />
    </ResumeProvider>
  );
}

function ResumeEditorContent() {
  const [activeSection, setActiveSection] =
    React.useState<SectionType>("personal");
  const { state } = useResume();
  const [key, setKey] = React.useState(0);
  const { debouncedValue: debouncedState } = useDebounce(state, 500); // Reduced debounce time for better responsiveness
  const prevDebouncedStateRef = React.useRef("");

  // Force PDF re-render on any state changes
  React.useEffect(() => {
    const newStateString = JSON.stringify({
      personal: debouncedState.personal,
      summary: debouncedState.summary,
      summaryHighlights: debouncedState.summaryHighlights,
      work: debouncedState.work,
      education: debouncedState.education,
      projects: debouncedState.projects,
      activeSections: debouncedState.activeSections,
    });

    if (newStateString !== prevDebouncedStateRef.current) {
      setKey((prev) => prev + 1);
      prevDebouncedStateRef.current = newStateString;
    }
  }, [debouncedState]);

  const ActiveSectionComponent = SECTION_COMPONENTS[activeSection];

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-row">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 overflow-y-auto p-4">
        <ActiveSectionComponent />
      </div>
      <div className="flex-1 relative">
        <PDFViewer key={key} className="w-full h-full">
          <ResumePDFDocument resumeData={debouncedState} />
        </PDFViewer>
      </div>
    </div>
  );
}
