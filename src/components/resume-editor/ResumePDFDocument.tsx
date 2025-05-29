/* eslint-disable */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
} from "@react-pdf/renderer";
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

// SVG icons as components
const MailIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8228C20.3769 21.912 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27103 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.21649 3.36163C2.30511 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83227 2.0003 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.11 3.72C9.23679 4.68007 9.47345 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5266 19.3199 14.7632 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LocationIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const WebsiteIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12H22"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LinkedinIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 9H2V21H6V9Z"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GithubIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M9 19C4.7 20.4 4.7 16.5 3 16M15 21V17.5C15 16.5 15.1 16.1 14.5 15.5C17.3 15.2 20 14.1 20 9.50001C19.9988 8.30498 19.5325 7.15732 18.7 6.30001C19.0905 5.26198 19.0545 4.11158 18.6 3.10001C18.6 3.10001 17.5 2.80001 15.1 4.40001C13.0672 3.87093 10.9328 3.87093 8.9 4.40001C6.5 2.80001 5.4 3.10001 5.4 3.10001C4.94548 4.11158 4.90953 5.26198 5.3 6.30001C4.46745 7.15732 4.00122 8.30498 4 9.50001C4 14.1 6.7 15.2 9.5 15.5C8.9 16.1 8.9 16.7 9 17.5V21"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ContactItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
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
    <View style={{ marginRight: 5 }}>{icon}</View>
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
        {personal.email && (
          <ContactItem icon={<MailIcon />} text={personal.email} />
        )}
        {personal.phone && (
          <ContactItem icon={<PhoneIcon />} text={personal.phone} />
        )}
        {personal.location && (
          <ContactItem icon={<LocationIcon />} text={personal.location} />
        )}
        {personal.website && (
          <ContactItem icon={<WebsiteIcon />} text={personal.website} />
        )}
        {personal.linkedin && (
          <ContactItem icon={<LinkedinIcon />} text={personal.linkedin} />
        )}
        {personal.github && (
          <ContactItem icon={<GithubIcon />} text={personal.github} />
        )}
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
