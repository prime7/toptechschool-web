import React from "react";
import { SectionType } from "./types";
import {
  useResume,
  blankResumeData,
  ResumeProvider,
} from "./context/ResumeContext";
import { PDFViewer } from "@react-pdf/renderer";
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

export default function ResumeEditor() {
  return (
    <ResumeProvider initialState={blankResumeData}>
      <ResumeEditorContent />
    </ResumeProvider>
  );
}

function ResumeEditorContent() {
  const [activeSection, setActiveSection] =
    React.useState<SectionType>("personal");
  const { state } = useResume();

  const ActiveSectionComponent = SECTION_COMPONENTS[activeSection];

  const { debouncedValue: debouncedState } = useDebounce(state, 1500);

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
        <PDFViewer className="w-full h-full">
          <ResumePDFDocument resumeData={debouncedState} />
        </PDFViewer>
      </div>
    </div>
  );
}
