import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import type { ResumeData } from "../types";
import {
  PersonalSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
} from "../ResumePDFDocument";

interface DefaultLayoutProps {
  resumeData: ResumeData;
  styles: any; // Replace 'any' with a more specific type if available
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  resumeData,
  styles,
}) => {
  const {
    personal,
    summary,
    work,
    education,
    projects,
    style, // from resumeData
    activeSections,
  } = resumeData;

  return (
    <Page size="A4" style={styles.page} wrap>
      {activeSections.includes("personal") && (
        <PersonalSection
          personal={personal}
          styles={styles}
          alignment={style.personalSectionAlignment}
        />
      )}

      {activeSections.includes("summary") &&
        summary &&
        summary.trim() !== "" && (
          <SummarySection summary={summary} styles={styles} />
        )}

      {activeSections.includes("work") &&
        work &&
        work.length > 0 && (
          <ExperienceSection experience={work} styles={styles} />
        )}

      {activeSections.includes("education") &&
        education &&
        education.length > 0 && (
          <EducationSection education={education} styles={styles} />
        )}

      {activeSections.includes("projects") &&
        projects &&
        projects.length > 0 && (
          <ProjectsSection projects={projects} styles={styles} />
        )}
    </Page>
  );
};

export default DefaultLayout;
