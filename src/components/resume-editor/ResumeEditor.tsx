import React, { useState } from 'react';
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
import LanguagesEditor from './sections/LanguagesEditor';
import ReferencesEditor from './sections/ReferencesEditor';

const sectionComponents: Record<SectionType, React.ComponentType> = {
  personal: PersonalInfoEditor,
  summary: SummaryEditor,
  experience: ExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor,
  certifications: CertificationsEditor,
  languages: LanguagesEditor,
  references: ReferencesEditor,
};

export default function ResumeEditor() {
  const [activeSection, setActiveSection] = useState<SectionType>('personal');
  const ActiveSectionComponent = sectionComponents[activeSection];

  return (
    <ResumeProvider>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div className="flex-1 p-8 overflow-y-auto">
          <ActiveSectionComponent />
        </div>
        <ResumePreview />
      </div>
    </ResumeProvider>
  );
}
