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

const registerFonts = () => {
  const fonts = [
    { family: "Anonymous Pro", src: "/fonts/AnonymousPro-Regular.ttf" },
    { family: "Open Sans", src: "/fonts/OpenSans-Regular.ttf" },
    { family: "Poppins", src: "/fonts/Poppins-Regular.ttf" },
  ];

  fonts.forEach((font) => Font.register(font));
};

registerFonts();

const createStyles = (style: ResumeStyle) => {
  const {
    fontSize,
    fontFamily,
    lineHeight,
    pagePaddingX,
    pagePaddingY,
    sectionSpacing,
    accentColor,
    showSectionHorizontalRule,
  } = style;

  return StyleSheet.create({
    page: {
      padding: `${pagePaddingY}px ${pagePaddingX}px`,
      fontSize,
      fontFamily,
      lineHeight: parseFloat(lineHeight.toString()),
    },
    section: {
      marginBottom: sectionSpacing,
    },
    sectionHeader: {
      fontSize: fontSize * 1.2,
      fontWeight: "bold",
      color: accentColor,
      borderBottom: showSectionHorizontalRule
        ? `1px solid ${accentColor}`
        : undefined,
      paddingBottom: showSectionHorizontalRule ? 2 : 3,
      marginBottom: 3,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    centerRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    title: {
      flexDirection: "row",
      fontWeight: "semibold",
      fontSize: fontSize * 1.05,
    },
    date: {
      fontSize: fontSize * 0.85,
    },
    description: {
      marginTop: 3,
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
      fontSize,
    },
    bulletText: {
      flex: 1,
      fontSize,
    },
    // Personal section specific styles
    personalName: {
      fontSize: fontSize * 1.6,
      fontWeight: "bold",
      marginBottom: 6,
    },
    personalTitle: {
      fontSize: fontSize * 1.1,
      marginBottom: 3,
      color: accentColor,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      fontSize: fontSize * 0.85,
      marginRight: 10,
    },
  });
};

// Reusable Components
interface BaseItemProps {
  styles: any;
  isLast?: boolean;
  marginBottom?: number;
}

interface ListItemProps extends BaseItemProps {
  children: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({
  children,
  styles,
  isLast = false,
  marginBottom = 6,
}) => (
  <View style={{ marginBottom: isLast ? 0 : marginBottom }} wrap={false}>
    {children}
  </View>
);

interface ContactItemProps {
  text: string;
  isFirst?: boolean;
}

const ContactItem: React.FC<ContactItemProps> = ({ text, isFirst = false }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
    {!isFirst && <Text style={{ marginRight: 5 }}>•</Text>}
    <Text>{text}</Text>
  </View>
);

interface BulletPointsListProps {
  bulletPoints: string[];
  styles: any;
}

const BulletPointsList: React.FC<BulletPointsListProps> = ({
  bulletPoints,
  styles,
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

interface DateRangeProps {
  startDate: string;
  endDate?: string;
  styles: any;
}

const DateRange: React.FC<DateRangeProps> = ({
  startDate,
  endDate,
  styles,
}) => (
  <Text style={styles.date}>
    {formatDate(startDate)} - {endDate ? formatDate(endDate) : "Present"}
  </Text>
);

interface SectionHeaderProps {
  title: string;
  styles: any;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, styles }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

// Section Components
interface PersonalSectionProps {
  personal: PersonalInfo;
  styles: any;
}

const PersonalSection: React.FC<PersonalSectionProps> = ({
  personal,
  styles,
}) => {
  const {
    fullName,
    profession,
    email,
    phone,
    location,
    website,
    linkedin,
    github,
  } = personal;

  const contactFields = [
    { value: email, isFirst: true },
    { value: phone },
    { value: location },
    { value: website },
    { value: linkedin },
    { value: github },
  ].filter((field) => field.value);

  return (
    <View style={styles.section}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.personalName}>{fullName}</Text>
        {profession && <Text style={styles.personalTitle}>{profession}</Text>}
      </View>
      <View style={styles.centerRow}>
        {contactFields.map((field, index) => (
          <ContactItem
            key={index}
            text={field.value!}
            isFirst={field.isFirst || false}
          />
        ))}
      </View>
    </View>
  );
};

interface SummarySectionProps {
  summary: string;
  summaryHighlights?: string[];
  styles: any;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  summary,
  summaryHighlights,
  styles,
}) => (
  <View style={styles.section} wrap={false}>
    <SectionHeader title="Highlights" styles={styles} />
    <Text>{summary}</Text>
    {summaryHighlights && summaryHighlights.length > 0 && (
      <BulletPointsList bulletPoints={summaryHighlights} styles={styles} />
    )}
  </View>
);

interface WorkItemComponentProps {
  item: WorkItem;
  styles: any;
  isLast?: boolean;
}

const WorkItemComponent: React.FC<WorkItemComponentProps> = ({
  item,
  styles,
  isLast = false,
}) => (
  <ListItem styles={styles} isLast={isLast}>
    <View style={styles.row}>
      <Text style={styles.title}>
        {item.position} - {item.company}
      </Text>
      <DateRange
        startDate={item.startDate}
        endDate={item.endDate}
        styles={styles}
      />
    </View>
    {item.description && (
      <Text style={styles.description}>{item.description}</Text>
    )}
    {item.points && item.points.length > 0 && (
      <BulletPointsList bulletPoints={item.points} styles={styles} />
    )}
  </ListItem>
);

interface EducationItemComponentProps extends BaseItemProps {
  item: EducationItem;
}

const EducationItemComponent: React.FC<EducationItemComponentProps> = ({
  item,
  styles,
  isLast = false,
}) => (
  <ListItem styles={styles} isLast={isLast}>
    <View style={styles.row}>
      <Text style={styles.title}>
        {item.degree} - {item.institution}
      </Text>
      <DateRange
        startDate={item.startDate}
        endDate={item.endDate}
        styles={styles}
      />
    </View>
    {item.description && (
      <Text style={styles.description}>{item.description}</Text>
    )}
    {item.points && item.points.length > 0 && (
      <BulletPointsList bulletPoints={item.points} styles={styles} />
    )}
  </ListItem>
);

interface ProjectItemComponentProps extends BaseItemProps {
  item: ProjectItem;
}

const ProjectItemComponent: React.FC<ProjectItemComponentProps> = ({
  item,
  styles,
  isLast = false,
}) => (
  <ListItem styles={styles} isLast={isLast}>
    <View style={styles.row}>
      <Text style={styles.title}>{item.name}</Text>
      {item.url && <Text style={styles.date}>{item.url}</Text>}
    </View>
    {item.description && (
      <Text style={styles.description}>{item.description}</Text>
    )}
    {item.points && item.points.length > 0 && (
      <BulletPointsList bulletPoints={item.points} styles={styles} />
    )}
  </ListItem>
);

// Chunking utility
interface ChunkableItem {
  description?: string;
  points?: string[];
}

const createChunks = <T extends ChunkableItem>(
  items: T[],
  maxChunkSize: number = 5
): T[][] => {
  const chunks: T[][] = [];
  let currentChunk: T[] = [];
  let currentChunkLength = 0;

  const estimateItemSize = (item: T): number => {
    return (
      0.5 + (item.description ? 0.2 : 0) + (item.points?.length || 0) * 0.15
    );
  };

  items.forEach((item) => {
    const itemSize = estimateItemSize(item);

    if (
      currentChunkLength + itemSize > maxChunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push([...currentChunk]);
      currentChunk = [];
      currentChunkLength = 0;
    }

    currentChunk.push(item);
    currentChunkLength += itemSize;
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
};

// Section Components with Chunking
interface ChunkedSectionProps<T extends ChunkableItem> {
  items: T[];
  styles: any;
  sectionTitle: string;
  ItemComponent: React.FC<ItemComponentProps<T>>;
  maxChunkSize?: number;
}

const ChunkedSection = <T extends ChunkableItem>({
  items,
  styles,
  sectionTitle,
  ItemComponent,
  maxChunkSize = 5,
}: ChunkedSectionProps<T>) => {
  const chunks = createChunks(items, maxChunkSize);

  return (
    <>
      {chunks.map((chunk, chunkIndex) => (
        <View
          key={`${sectionTitle.toLowerCase()}-chunk-${chunkIndex}`}
          style={styles.section}
          break={chunkIndex > 0}
        >
          {chunkIndex === 0 && (
            <SectionHeader title={sectionTitle} styles={styles} />
          )}
          {chunk.map((item, index) => (
            <ItemComponent
              key={index}
              item={item}
              styles={styles}
              isLast={index === chunk.length - 1}
            />
          ))}
        </View>
      ))}
    </>
  );
};

interface SimpleSectionProps<T> {
  items: T[];
  styles: any;
  sectionTitle: string;
  ItemComponent: React.FC<ItemComponentProps<T>>;
}

const SimpleSection = <T,>({
  items,
  styles,
  sectionTitle,
  ItemComponent,
}: SimpleSectionProps<T>) => (
  <View style={styles.section}>
    <SectionHeader title={sectionTitle} styles={styles} />
    {items.map((item, index) => (
      <ItemComponent
        key={index}
        item={item}
        styles={styles}
        isLast={index === items.length - 1}
      />
    ))}
  </View>
);

// Section Configuration
interface ItemComponentProps<T = any> {
  item: T;
  styles: any;
  isLast?: boolean;
}

interface SectionConfig<T = any> {
  key: string;
  title: string;
  component: React.FC<ItemComponentProps<T>>;
  chunked?: boolean;
}

const sectionConfigs = {
  work: {
    key: "work",
    title: "Experience",
    component: WorkItemComponent,
    chunked: true,
  },
  education: {
    key: "education",
    title: "Education",
    component: EducationItemComponent,
    chunked: false,
  },
  projects: {
    key: "projects",
    title: "Projects",
    component: ProjectItemComponent,
    chunked: true,
  },
} as const;

// Main Document Component
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

  const documentMeta = {
    title: `Resume - ${personal.fullName}`,
    author: personal.fullName,
    creator: "Resume Editor",
    producer: "Resume Editor",
    keywords: `resume, ${personal.fullName}, ${personal.profession || ""}`,
  };

  const renderSection = (sectionType: string) => {
    switch (sectionType) {
      case "personal":
        return <PersonalSection personal={personal} styles={styles} />;

      case "summary":
        if (
          (summary && summary.trim()) ||
          (summaryHighlights && summaryHighlights.length > 0)
        ) {
          return (
            <SummarySection
              summary={summary || ""}
              summaryHighlights={summaryHighlights}
              styles={styles}
            />
          );
        }
        return null;

      case "work":
        if (work && work.length > 0) {
          const config = sectionConfigs.work;
          return (
            <ChunkedSection
              items={work}
              styles={styles}
              sectionTitle={config.title}
              ItemComponent={config.component}
            />
          );
        }
        return null;

      case "education":
        if (education && education.length > 0) {
          const config = sectionConfigs.education;
          return (
            <SimpleSection
              items={education}
              styles={styles}
              sectionTitle={config.title}
              ItemComponent={config.component}
            />
          );
        }
        return null;

      case "projects":
        if (projects && projects.length > 0) {
          const config = sectionConfigs.projects;
          return (
            <ChunkedSection
              items={projects}
              styles={styles}
              sectionTitle={config.title}
              ItemComponent={config.component}
            />
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <Document {...documentMeta}>
      <Page size="A4" style={styles.page} wrap>
        {activeSections.map((section, idx) => (
          <React.Fragment key={`${section}-${idx}`}>
            {renderSection(section)}
          </React.Fragment>
        ))}
      </Page>
    </Document>
  );
};

export default React.memo(ResumePDFDocument);
