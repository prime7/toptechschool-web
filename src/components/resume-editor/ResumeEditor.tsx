import Sidebar from "./Sidebar";
import ResumePreview from "./ResumePreview";
import { useState } from "react";
import { SectionType } from "./types";
import PersonalInfoEditor from "./sections/PersonalInforEditor";
import SummaryEditor from "./sections/SummaryEditor";
import ExperienceEditor from "./sections/ExperienceEditor";
import EducationEditor from "./sections/EducationsEditor";
import SkillsEditor from "./sections/SkillsEditor";
import ProjectsEditor from "./sections/ProjectsEditor";
import CertificationsEditor from "./sections/CertificationsEditor";
import LanguagesEditor from "./sections/LanguagesEditor";
import ReferencesEditor from "./sections/ReferencesEditor";

export default function ResumeEditor() {
  const [activeSection, setActiveSection] = useState<SectionType>('personal');

  const renderSectionEditor = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoEditor />;
      case 'summary':
        return <SummaryEditor />;
      case 'experience':
        return <ExperienceEditor />;
      case 'education':
        return <EducationEditor />;
      case 'skills':
        return <SkillsEditor />;
      case 'projects':
        return <ProjectsEditor />;
      case 'certifications':
        return <CertificationsEditor />;
      case 'languages':
        return <LanguagesEditor />;
      case 'references':
        return <ReferencesEditor />;
      default:
        return <PersonalInfoEditor />;
    }
  };
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 p-8">
        {renderSectionEditor()}
      </div>
      <ResumePreview />
    </div>
  );
}

