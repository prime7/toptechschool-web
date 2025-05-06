import React, { useState, useRef } from 'react';
import { SectionType } from './types';
import { ResumeProvider } from './context/ResumeContext';
import Sidebar from './Sidebar';
import ResumePreview from './ResumePreview';
import PersonalInfoEditor from './sections/PersonalInforEditor';
import SummaryEditor from './sections/SummaryEditor';
import ExperienceEditor from './sections/ExperienceEditor';
import EducationEditor from './sections/EducationsEditor';
import SkillsEditor from './sections/SkillsEditor';
import ProjectsEditor from './sections/ProjectsEditor';
import CertificationsEditor from './sections/CertificationsEditor';
import ReferencesEditor from './sections/ReferencesEditor';
import { usePDF } from 'react-to-pdf';

const sectionComponents: Record<SectionType, React.ComponentType> = {
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
  const [activeSection, setActiveSection] = useState<SectionType>('personal');
  const [isExporting, setIsExporting] = useState(false);
  const ActiveSectionComponent = sectionComponents[activeSection];
  const { toPDF, targetRef } = usePDF({
    filename: 'resume.pdf',
    page: { format: 'a4', orientation: 'portrait' }
  });

  const handleExportPDF = async () => {
    setIsExporting(true);
    toPDF();
    setIsExporting(false);
  };

  return (
    <ResumeProvider>
      <div className="flex flex-row h-[calc(100vh-5rem)]">
        <div>
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onExportPDF={handleExportPDF}
          />
        </div>
        <div className="flex-1 p-6">
          <ActiveSectionComponent />
        </div>
        <div className="flex-1 overflow-y-scroll">
          <div ref={targetRef}>
            <ResumePreview isPrintMode={isExporting} />
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
}
