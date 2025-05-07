import React, { useRef, useEffect, useMemo } from 'react';
import { SectionType } from './types';
import { ResumeProvider } from './context/ResumeContext';
import { useResume } from './context/ResumeContext';
import { PDFViewer } from '@react-pdf/renderer';
import ResumePDFDocument from './ResumePDFDocument';
import Sidebar from './Sidebar';
import PersonalInfoEditor from './sections/PersonalInforEditor';
import SummaryEditor from './sections/SummaryEditor';
import ExperienceEditor from './sections/ExperienceEditor';
import EducationEditor from './sections/EducationsEditor';
import SkillsEditor from './sections/SkillsEditor';
import ProjectsEditor from './sections/ProjectsEditor';
import CertificationsEditor from './sections/CertificationsEditor';
import ReferencesEditor from './sections/ReferencesEditor';
import { useDebounce } from '@/hooks/use-debounce';

const SECTION_COMPONENTS: Record<SectionType, React.ComponentType> = {
  personal: PersonalInfoEditor,
  summary: SummaryEditor,
  experience: ExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor,
  certifications: CertificationsEditor,
  references: ReferencesEditor,
};

export default function ResumeEditor() {
  return (
    <ResumeProvider>
      <ResumeEditorContent />
    </ResumeProvider>
  );
}

function ResumeEditorContent() {
  const [activeSection, setActiveSection] = React.useState<SectionType>('personal');
  const { state } = useResume();
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const ActiveSectionComponent = SECTION_COMPONENTS[activeSection];

  const { debouncedValue: debouncedState, isLoading } = useDebounce(state, 500);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;500;600;700&display=swap');
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [isClient, setIsClient] = React.useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const StablePDFDocument = useMemo(() => (
    <ResumePDFDocument resumeData={debouncedState} />
  ), [debouncedState]);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-row">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 overflow-y-auto p-4">
        <ActiveSectionComponent />
      </div>
      <PDFViewer className="flex-1">
        {StablePDFDocument}
      </PDFViewer>
    </div>
  );
}
