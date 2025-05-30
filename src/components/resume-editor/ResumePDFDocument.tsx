'use client'
/* eslint-disable */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer/lib/react-pdf.browser";
import { formatDate } from "@/lib/date-utils";
import type {
  PersonalInfo,
  WorkItem,
  EducationItem,
  ProjectItem,
  ResumeStyle,
  ResumeData,
} from "./types";

const createStyles = (style: ResumeStyle) =>
  StyleSheet.create({
    page: {
      padding: 24,
      fontSize: style.fontSize,
      fontFamily: "Helvetica",
      lineHeight: parseFloat(style.lineHeight.toString()),
    },
    section: {
      marginBottom: style.sectionSpacing * 0.8,
    },
    sectionHeader: {
      fontSize: style.fontSize * 1.2,
      marginBottom: 6,
      fontWeight: "bold",
      color: style.accentColor,
      textAlign: style.sectionHeaderAlignment,
      borderBottom: style.showSectionHorizontalRule
        ? `1pt solid ${style.accentColor}`
        : undefined,
      paddingBottom: style.showSectionHorizontalRule ? 2 : undefined,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 3,
    },
    personalHeaderName: {
      fontSize: style.fontSize * 1.6,
      fontWeight: "bold",
      marginBottom: 6,
    },
    personalHeaderTitle: {
      fontSize: style.fontSize * 1.1,
      marginBottom: 3,
      color: style.accentColor,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      marginBottom: 3,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      fontSize: style.fontSize * 0.85,
    },
    itemHeader: {
      fontWeight: "bold",
      fontSize: style.fontSize * 1.05,
    },
    itemSubHeader: {
      fontSize: style.fontSize * 0.85,
      color: "#666",
    },
    date: {
      fontSize: style.fontSize * 0.85,
      color: "#666",
    },
    description: {
      marginTop: 3,
      fontSize: style.fontSize * 0.85,
      color: "#444",
    },
    bulletPoints: {
      marginTop: 3,
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 2,
    },
    bulletMarker: {
      width: 8,
      fontSize: style.fontSize * 0.85,
    },
    bulletText: {
      flex: 1,
      fontSize: style.fontSize * 0.85,
    },
    skillCategories: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    skillCategory: {
      marginBottom: 4,
    },
    skillCategoryName: {
      fontWeight: "bold",
      marginBottom: 2,
    },
    skillList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    skillItem: {
      backgroundColor: "#f0f0f0",
      borderRadius: 2,
      padding: "1 4",
      fontSize: style.fontSize * 0.8,
    },
  });

const ContactItem = ({
  text,
}: {
  text: string;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10,
      marginBottom: 5,
    }}
  >
    <Text style={{ marginRight: 5 }}>•</Text>
    <Text>{text}</Text>
  </View>
);

const BulletPointsList = ({
  bulletPoints,
  styles,
}: {
  bulletPoints: string[];
  styles: any;
}) => (
  <View style={styles.bulletPoints}>
    {bulletPoints.map((point, index) => (
      <View key={index} style={styles.bulletPoint}>
        <Text style={styles.bulletMarker}>•</Text>
        <Text style={styles.bulletText}>{point}</Text>
      </View>
    ))}
  </View>
);

const PersonalSection = ({
  personal,
  styles,
  alignment,
}: {
  personal: PersonalInfo;
  styles: any;
  alignment: "left" | "center" | "right";
}) => {
  const getTextAlign = () => {
    return { textAlign: alignment } as const;
  };

  const getAlignmentStyles = () => {
    switch (alignment) {
      case "center":
        return { alignItems: "center", justifyContent: "center" } as const;
      case "right":
        return { alignItems: "flex-end", justifyContent: "flex-end" } as const;
      default:
        return {
          alignItems: "flex-start",
          justifyContent: "flex-start",
        } as const;
    }
  };

  return (
    <View style={styles.section}>
      <View style={getAlignmentStyles()}>
        <Text style={[styles.personalHeaderName, getTextAlign()]}>
          {personal.fullName}
        </Text>
        {personal.profession && (
          <Text style={[styles.personalHeaderTitle, getTextAlign()]}>
            {personal.profession}
          </Text>
        )}
      </View>

      <View style={[styles.contactRow, getAlignmentStyles()]}>
        {personal.email && <ContactItem text={personal.email} />}
        {personal.phone && <ContactItem text={personal.phone} />}
        {personal.location && <ContactItem text={personal.location} />}
        {personal.website && <ContactItem text={personal.website} />}
        {personal.linkedin && <ContactItem text={personal.linkedin} />}
        {personal.github && <ContactItem text={personal.github} />}
      </View>
    </View>
  );
};

const SummarySection = ({
  summary,
  styles,
}: {
  summary: string;
  styles: any;
}) => (
  <View style={styles.section} wrap={false}>
    <Text style={styles.sectionHeader}>Summary</Text>
    <Text>{summary}</Text>
  </View>
);

const ExperienceItem = ({
  item,
  styles,
}: {
  item: WorkItem;
  styles: any;
}) => (
  <View style={{ marginBottom: 10 }} wrap={false}>
    <View style={styles.row}>
      <View>
        <Text style={styles.itemHeader}>{item.position}</Text>
        <Text style={styles.itemSubHeader}>{item.company}</Text>
      </View>
      <Text style={styles.date}>
        {formatDate(item.startDate)} -{" "}
        {item.endDate ? formatDate(item.endDate) : "Present"}
      </Text>
    </View>
    {item.description && (
      <Text style={styles.description}>{item.description}</Text>
    )}
    {item.points && item.points.length > 0 && (
      <BulletPointsList bulletPoints={item.points} styles={styles} />
    )}
  </View>
);

const ExperienceSection = ({
  experience,
  styles,
}: {
  experience: WorkItem[];
  styles: any;
}) => {
  const chunks: WorkItem[][] = [];
  let currentChunk: WorkItem[] = [];
  let currentChunkLength = 0;

  const estimateItemSize = (item: WorkItem) => {
    return 0.5 + (item.description ? 0.2 : 0) + item.points.length * 0.15;
  };

  experience.forEach((item) => {
    const itemSize = estimateItemSize(item);

    if (currentChunkLength + itemSize > 5) {
      if (currentChunk.length > 0) {
        chunks.push([...currentChunk]);
        currentChunk = [];
        currentChunkLength = 0;
      }
    }

    currentChunk.push(item);
    currentChunkLength += itemSize;
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return (
    <>
      {chunks.map((chunk, chunkIndex) => (
        <View
          key={`chunk-${chunkIndex}`}
          style={styles.section}
          break={chunkIndex > 0}
        >
          {chunkIndex === 0 && (
            <Text style={styles.sectionHeader}>Experience</Text>
          )}
          {chunk.map((item, index) => (
            <ExperienceItem key={index} item={item} styles={styles} />
          ))}
        </View>
      ))}
    </>
  );
};

const EducationItem = ({
  item,
  styles,
}: {
  item: EducationItem;
  styles: any;
}) => (
  <View style={{ marginBottom: 10 }} wrap={false}>
    <View style={styles.row}>
      <View>
        <Text style={styles.itemHeader}>{item.degree}</Text>
        <Text style={styles.itemSubHeader}>{item.institution}</Text>
      </View>
      <Text style={styles.date}>
        {formatDate(item.startDate)} -{" "}
        {item.endDate ? formatDate(item.endDate) : "Present"}
      </Text>
    </View>
    {item.description && (
      <Text style={styles.description}>{item.description}</Text>
    )}
    {item.points && item.points.length > 0 && (
      <BulletPointsList bulletPoints={item.points} styles={styles} />
    )}
  </View>
);

const EducationSection = ({
  education,
  styles,
}: {
  education: EducationItem[];
  styles: any;
}) => {
  const chunks: EducationItem[][] = [];
  let currentChunk: EducationItem[] = [];
  let currentChunkLength = 0;

  const estimateItemSize = (item: EducationItem) => {
    return (
      0.5 + (item.description ? 0.2 : 0) + (item.points?.length || 0) * 0.15
    );
  };

  education.forEach((item) => {
    const itemSize = estimateItemSize(item);

    if (currentChunkLength + itemSize > 5) {
      if (currentChunk.length > 0) {
        chunks.push([...currentChunk]);
        currentChunk = [];
        currentChunkLength = 0;
      }
    }

    currentChunk.push(item);
    currentChunkLength += itemSize;
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return (
    <>
      {chunks.map((chunk, chunkIndex) => (
        <View
          key={`edu-chunk-${chunkIndex}`}
          style={styles.section}
          break={chunkIndex > 0}
        >
          {chunkIndex === 0 && (
            <Text style={styles.sectionHeader}>Education</Text>
          )}
          {chunk.map((item, index) => (
            <EducationItem key={index} item={item} styles={styles} />
          ))}
        </View>
      ))}
    </>
  );
};

const ProjectItem = ({
  project,
  styles,
}: {
  project: ProjectItem;
  styles: any;
}) => (
  <View style={{ marginBottom: 10 }} wrap={false}>
    <View style={styles.row}>
      <View>
        <Text style={styles.itemHeader}>{project.name}</Text>
      </View>
      {project.url && <Text style={styles.date}>{project.url}</Text>}
    </View>
    {project.description && (
      <Text style={styles.description}>{project.description}</Text>
    )}
    {project.points && project.points.length > 0 && (
      <BulletPointsList bulletPoints={project.points} styles={styles} />
    )}
  </View>
);

const ProjectsSection = ({
  projects,
  styles,
}: {
  projects: ProjectItem[];
  styles: any;
}) => {
  const chunks: ProjectItem[][] = [];
  let currentChunk: ProjectItem[] = [];
  let currentChunkLength = 0;

  const estimateItemSize = (item: ProjectItem) => {
    return (
      0.5 +
      (item.description ? 0.2 : 0) +
      (item.points?.length || 0) * 0.15
    );
  };

  projects.forEach((item) => {
    const itemSize = estimateItemSize(item);

    if (currentChunkLength + itemSize > 5) {
      if (currentChunk.length > 0) {
        chunks.push([...currentChunk]);
        currentChunk = [];
        currentChunkLength = 0;
      }
    }

    currentChunk.push(item);
    currentChunkLength += itemSize;
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return (
    <>
      {chunks.map((chunk, chunkIndex) => (
        <View
          key={`proj-chunk-${chunkIndex}`}
          style={styles.section}
          break={chunkIndex > 0}
        >
          {chunkIndex === 0 && (
            <Text style={styles.sectionHeader}>Projects</Text>
          )}
          {chunk.map((project, index) => (
            <ProjectItem key={index} project={project} styles={styles} />
          ))}
        </View>
      ))}
    </>
  );
};

interface ResumePDFDocumentProps {
  resumeData: ResumeData;
}

const ResumePDFDocument: React.FC<ResumePDFDocumentProps> = ({
  resumeData,
}) => {
  const {
    personal,
    summary,
    work,
    education,
    projects,
    style,
    activeSections,
  } = resumeData;

  const styles = React.useMemo(
    () => createStyles(style),
    [
      style.fontSize,
      style.lineHeight,
      style.sectionSpacing,
      style.accentColor,
      style.sectionHeaderAlignment,
      style.showSectionHorizontalRule,
    ]
  );

  const documentTitle = `Resume - ${personal.fullName}`;
  const documentAuthor = personal.fullName;

  return (
    <Document
      title={documentTitle}
      author={documentAuthor}
      creator="Resume Editor"
      producer="Resume Editor"
      keywords={`resume, ${personal.fullName}, ${personal.profession || ""}`}
    >
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
    </Document>
  );
};

export default React.memo(ResumePDFDocument);
