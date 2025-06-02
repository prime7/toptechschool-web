"use client";
/* eslint-disable */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
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

Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
});

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.woff2",
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFd2JQEk.woff2",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2",
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/opensans/v35/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVIUwaEQbjB_mQ.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v35/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVIGwaEQbjB_mQ.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v35/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVIZwaEQbjB_mQ.woff2",
      fontWeight: 700,
    },
  ],
});

const createStyles = (style: ResumeStyle) =>
  StyleSheet.create({
    page: {
      padding: 24,
      fontSize: style.fontSize,
      // fontFamily: style.fontFamily,
      fontFamily: "Helvetica",
      // "Helvetica" (default)
      // "Times-Roman"
      // "Courier"
      // If you want to use a custom font (like "Open Sans" or "Roboto"), you must register it first using the Font.register API from @react-pdf/renderer, and provide the font file (usually .ttf or .otf) in your public directory or import it directly.
      lineHeight: parseFloat(style.lineHeight.toString()),
    },
    section: {
      marginBottom: style.sectionSpacing,
    },
    sectionHeader: {
      fontSize: style.fontSize * 1.2,
      fontWeight: "bold",
      color: style.accentColor,
      borderBottom: style.showSectionHorizontalRule
        ? `1px solid ${style.accentColor}`
        : undefined,
      paddingBottom: style.showSectionHorizontalRule ? 2 : 3,
      marginBottom: 3
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
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
    centerRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      fontSize: style.fontSize * 0.85,
    },
    date: {
      fontSize: style.fontSize * 0.85,
    },
    description: {
      marginTop: 3,
      fontSize: style.fontSize * 0.85,
    },
    bulletPoints: {
      marginTop: 1,
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 1,
    },
    bulletMarker: {
      width: 16,
      fontSize: style.fontSize,
    },
    bulletText: {
      flex: 1,
      fontSize: style.fontSize,
    },
    title: {
      flexDirection: 'row',
      fontWeight: "semibold",
      fontSize: style.fontSize * 1.05,
    }
  });

const ContactItem = ({
  text,
  isFirst = false,
}: {
  text: string;
  isFirst?: boolean;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10,
    }}
  >
    {!isFirst && <Text style={{ marginRight: 5 }}>•</Text>}
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
}: {
  personal: PersonalInfo;
  styles: any;
}) => {
  return (
    <View style={styles.section}>
      <View style={{ alignItems: "center" }}>
        <Text style={[styles.personalHeaderName]}>{personal.fullName}</Text>
        {personal.profession && (
          <Text style={styles.personalHeaderTitle}>{personal.profession}</Text>
        )}
      </View>

      <View style={[styles.centerRow]}>
        {personal.email && <ContactItem text={personal.email} isFirst={true} />}
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
  summaryHighlights,
  styles,
}: {
  summary: string;
  summaryHighlights?: string[];
  styles: any;
}) => (
  <View style={styles.section} wrap={false}>
    <Text style={styles.sectionHeader}>Highlights</Text>
    <Text>{summary}</Text>
    {summaryHighlights && summaryHighlights.length > 0 && (
      <BulletPointsList bulletPoints={summaryHighlights} styles={styles} />
    )}
  </View>
);

const WorkItem = ({ item, styles }: { item: WorkItem; styles: any }) => (
  <View style={{ marginBottom: styles.sectionSpacing * 0.5 }} wrap={false}>
    <View style={styles.row}>
      <View style={styles.title}>
        <Text>
          {item.position} - {item.company}{" "}
        </Text>
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

const WorkSection = ({
  work,
  styles,
}: {
  work: WorkItem[];
  styles: any;
}) => {
  const chunks: WorkItem[][] = [];
  let currentChunk: WorkItem[] = [];
  let currentChunkLength = 0;

  const estimateItemSize = (item: WorkItem) => {
    return 0.5 + (item.description ? 0.2 : 0) + item.points.length * 0.15;
  };

  work.forEach((item) => {
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
            <WorkItem key={index} item={item} styles={styles} />
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
        <Text style={styles.title}>{item.degree}</Text>
        <Text>{item.institution}</Text>
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
  <View wrap={false}>
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{project.name}</Text>
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
      0.5 + (item.description ? 0.2 : 0) + (item.points?.length || 0) * 0.15
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
    summaryHighlights,
    work,
    education,
    projects,
    style,
    activeSections,
  } = resumeData;

  const styles = createStyles(style);
  const documentTitle = `Resume - ${resumeData.personal.fullName}`;
  const documentAuthor = resumeData.personal.fullName;

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
          <PersonalSection personal={personal} styles={styles} />
        )}

        {activeSections.includes("summary") &&
          ((summary && summary.trim() !== "") ||
           (summaryHighlights && summaryHighlights.length > 0)) && (
            <SummarySection
              summary={summary || ""}
              summaryHighlights={summaryHighlights}
              styles={styles}
            />
          )}

        {activeSections.includes("work") && work && work.length > 0 && (
          <WorkSection work={work} styles={styles} />
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
