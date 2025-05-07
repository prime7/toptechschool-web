import React, { useLayoutEffect, useState } from 'react';
import { useResume } from './context/ResumeContext';
import { formatDate } from '@/lib/date-utils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import useFitContent from './useFitContent';

import type {
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
  CertificationItem,
  ReferenceItem,
  ResumeStyle
} from './types';
import Link from 'next/link';

interface ResumePreviewProps {
  contentRef?: React.RefObject<HTMLDivElement>;
}

const ContactItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center">
    <span className="mr-1.5">{icon}</span>
    <span>{text}</span>
  </div>
)

const SectionHeader = ({ title, style }: { title: string; style: ResumeStyle }) => (
  <h2
    className={cn(
      "mb-3 text-xl font-bold",
      {
        "text-center": style.sectionHeaderAlignment === "center",
        "text-right": style.sectionHeaderAlignment === "right",
        "text-left": style.sectionHeaderAlignment === "left"
      }
    )}
    style={{ 
      color: 'var(--accent-color)',
      pageBreakAfter: 'avoid',
      breakAfter: 'avoid'
    }}
    data-section-header
  >
    {title}
    {style.showSectionHorizontalRule && <hr className="my-2 border-gray-900 border-solid" />}
  </h2>
)

const PersonalSection = ({ personal, style }: { personal: PersonalInfo; style: ResumeStyle }) => {
  const contactItems = [
    { icon: <Mail className="h-4 w-4 text-gray-800" />, text: personal.email },
    { icon: <Phone className="h-4 w-4 text-gray-800" />, text: personal.phone },
    { icon: <MapPin className="h-4 w-4 text-gray-800" />, text: personal.location }
  ];

  if (personal.website) {
    contactItems.push({ icon: <Globe className="h-4 w-4 text-gray-800" />, text: personal.website });
  }

  if (personal.linkedin) {
    contactItems.push({ icon: <Linkedin className="h-4 w-4 text-gray-800" />, text: personal.linkedin });
  }

  if (personal.github) {
    contactItems.push({ icon: <Github className="h-4 w-4 text-gray-800" />, text: personal.github });
  }

  return (
    <div className="mb-4" data-section="personal">
      <div className={cn("flex flex-col", {
        "items-center": style.personalSectionAlignment === "center",
        "items-end": style.personalSectionAlignment === "right",
        "items-start": style.personalSectionAlignment === "left"
      })}>
        <h1 className="text-2xl font-bold text-gray-800">
          {personal.fullName}
        </h1>
        {personal.title && (
          <h2 className="text-lg text-gray-800">
            {personal.title}
          </h2>
        )}
        <div className={cn("flex flex-wrap gap-1 text-gray-800", {
          "justify-center": style.personalSectionAlignment === "center",
          "justify-end": style.personalSectionAlignment === "right",
          "justify-start": style.personalSectionAlignment === "left"
        })}>
          {contactItems.map((item, index) => (
            <ContactItem key={index} icon={item.icon} text={item.text} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SummarySection = ({ summary, style }: { summary: string; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }} data-section="summary">
    <SectionHeader title="Summary" style={style} />
    <div 
      className="text-gray-600 whitespace-pre-line" 
      style={{ 
        whiteSpace: 'pre-line',
        wordBreak: 'break-word' 
      }}
    >
      {summary}
    </div>
  </div>
);

const BulletPointsList = ({ bulletPoints }: { bulletPoints: string[] }) => (
  <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1">
    {bulletPoints.map((bullet, index) => (
      <li key={index} 
        className="whitespace-pre-line" 
        style={{ 
          whiteSpace: 'pre-line',
          wordBreak: 'break-word' 
        }}
      >
        {bullet}
      </li>
    ))}
  </ul>
);

const ExperienceItem = ({ item, isFirst }: { item: ExperienceItem; isFirst?: boolean }) => (
  <div 
    className="mb-4" 
    data-item 
    style={{
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
      pageBreakBefore: isFirst ? 'auto' : 'auto'
    }}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{item.position}</h3>
        <div className="text-gray-600">{item.company}</div>
      </div>
      <div className={cn("text-sm text-gray-800")}>
        {formatDate(item.startDate)} - {item.endDate === undefined || item.endDate === '' ? 'Present' : formatDate(item.endDate)}
      </div>
    </div>
    {item.description && <p className="mt-2 text-gray-600">{item.description}</p>}
    {item.bulletPoints && item.bulletPoints.length > 0 && (
      <BulletPointsList bulletPoints={item.bulletPoints} />
    )}
  </div>
);

const ExperienceSection = ({ experience, style }: { experience: ExperienceItem[]; style: ResumeStyle }) => {
  // Split experiences into chunks that should stay together
  const splitExperiences = () => {
    if (experience.length <= 2) {
      // If 2 or fewer experiences, keep them all together
      return [experience];
    } else {
      // For more experiences, split into chunks that can fit on a page
      const result: ExperienceItem[][] = [];
      let currentChunk: ExperienceItem[] = [];
      
      experience.forEach((exp, index) => {
        // Start a new chunk every 2 experiences
        if (index % 2 === 0 && index > 0) {
          result.push([...currentChunk]);
          currentChunk = [];
        }
        currentChunk.push(exp);
      });
      
      if (currentChunk.length > 0) {
        result.push(currentChunk);
      }
      
      return result;
    }
  };

  const experienceChunks = splitExperiences();

  return (
    <div 
      style={{ marginBottom: 'var(--section-spacing)' }} 
      data-section="experience"
    >
      <SectionHeader title="Experience" style={style} />
      
      {experienceChunks.map((chunk, chunkIndex) => (
        <div 
          key={`chunk-${chunkIndex}`} 
          style={{ 
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
            pageBreakBefore: chunkIndex > 0 ? 'always' : 'auto',
            breakBefore: chunkIndex > 0 ? 'page' : 'auto'
          }}
          className="experience-chunk"
          data-chunk={chunkIndex}
        >
          {chunk.map((item, index) => (
            <ExperienceItem 
              key={item.id || index} 
              item={item} 
              isFirst={index === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const EducationItem = ({ item }: { item: EducationItem }) => (
  <div className="mb-4" data-item>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{item.degree} in {item.field}</h3>
        <div className="text-gray-600">{item.institution}</div>
      </div>
      <div className={cn("text-sm text-gray-500")}>
        {formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}
      </div>
    </div>
    {item.gpa && <div className={cn("mt-1 text-gray-600")}>GPA: {item.gpa}</div>}
    {item.description && <p className="mt-2 text-gray-600">{item.description}</p>}
    {item.bulletPoints && item.bulletPoints.length > 0 && (
      <BulletPointsList bulletPoints={item.bulletPoints} />
    )}
  </div>
);

const EducationSection = ({ education, style }: { education: EducationItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }} data-section="education">
    <SectionHeader title="Education" style={style} />
    {education.map((item, index) => (
      <EducationItem key={index} item={item} />
    ))}
  </div>
);

const SkillsSection = ({ skills, style }: { skills: SkillItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }} data-section="skills">
    <SectionHeader title="Skills" style={style} />
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <Badge key={index} variant="secondary">{skill.name}</Badge>
      ))}
    </div>
  </div>
);

const ProjectItem = ({ project }: { project: ProjectItem }) => (
  <div className="mb-4" data-item>
    <div className="flex justify-between items-start">
      <h3 className="text-lg text-gray-800">
        {project.name}
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-600">
            <ExternalLink className="h-4 w-4 inline" />
          </a>
        )}
      </h3>
    </div>
    {project.description && <p className="mt-2 text-gray-600">{project.description}</p>}
    {project.bulletPoints && project.bulletPoints.length > 0 && (
      <BulletPointsList bulletPoints={project.bulletPoints} />
    )}
  </div>
);

const ProjectsSection = ({ projects, style }: { projects: ProjectItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }} data-section="projects">
    <SectionHeader title="Projects" style={style} />
    {projects.map((project, index) => (
      <ProjectItem key={index} project={project} />
    ))}
  </div>
);

const CertificationItem = ({ cert }: { cert: CertificationItem }) => (
  <div className="mb-4">
    <div className="flex justify-between items-start">
      {cert.url ? (
        <Link href={cert.url} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600">
          {cert.name}
          <ExternalLink className="h-4 w-4 ml-2 inline" />
        </Link>
      ) : (
        <span className="text-gray-800">{cert.name}</span>
      )}
    </div>
  </div>
);

const CertificationsSection = ({ certifications, style }: { certifications: CertificationItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }} data-section="certifications">
    <SectionHeader title="Certifications" style={style} />
    {certifications.map((cert, index) => (
      <CertificationItem key={index} cert={cert} />
    ))}
  </div>
);

const ReferencesSection = ({ references, style }: { references: ReferenceItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }} data-section="references">
    <SectionHeader title="References" style={style} />
    {references.map((ref, index) => (
      <div key={index} className="mb-4">
        <div className="font-semibold text-gray-800">{ref.name}</div>
        <div className="text-gray-600">{ref.position}</div>
        <div className="text-gray-600">{ref.company}</div>
        <div className="text-gray-600">{ref.email}</div>
        <div className="text-gray-600">{ref.phone}</div>
      </div>
    ))}
  </div>
);

const ResumePreview: React.FC<ResumePreviewProps> = ({ contentRef }) => {
  const { state } = useResume();
  const { checkFitOnePage, A4_WIDTH_MM, A4_HEIGHT_MM, PAGE_MARGIN_MM } = useFitContent();
  const [shouldPaginate, setShouldPaginate] = useState(false);
  
  const {
    personal,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    references,
    activeSections,
    style
  } = state;

  const sectionComponents = {
    personal: () => personal && <PersonalSection personal={personal} style={style} />,
    summary: () => summary && <SummarySection summary={summary} style={style} />,
    experience: () => experience && experience.length > 0 && <ExperienceSection experience={experience} style={style} />,
    education: () => education && education.length > 0 && <EducationSection education={education} style={style} />,
    skills: () => skills && skills.length > 0 && <SkillsSection skills={skills} style={style} />,
    projects: () => projects && projects.length > 0 && <ProjectsSection projects={projects} style={style} />,
    certifications: () => certifications && certifications.length > 0 && <CertificationsSection certifications={certifications} style={style} />,
    references: () => references && references.length > 0 && <ReferencesSection references={references} style={style} />
  };

  // A4 size is 210mm × 297mm, or 8.27in × 11.69in
  // For better viewing, we use a scale factor in the UI
  const scaleFactor = 0.8; // 80% of actual A4 size for screen display
  const a4Width = `${A4_WIDTH_MM * scaleFactor}mm`;
  const a4Padding = `${PAGE_MARGIN_MM * scaleFactor}mm`;
  
  // Check content height after render
  useLayoutEffect(() => {
    const checkContentSize = () => {
      if (contentRef?.current) {
        const fits = checkFitOnePage(contentRef.current);
        setShouldPaginate(!fits);
      }
    };
    
    checkContentSize();
    
    // Add resize listener to recheck when window size changes
    window.addEventListener('resize', checkContentSize);
    return () => {
      window.removeEventListener('resize', checkContentSize);
    };
  }, [checkFitOnePage, contentRef, state]);
  
  return (
    <div className="bg-white shadow-lg p-0 overflow-visible flex justify-center">
      <div
        id="resumePreviewContent"
        ref={contentRef}
        className={cn("", {
          "font-inter": style.fontFamily === "inter",
          "font-roboto": style.fontFamily === "roboto",
          "font-poppins": style.fontFamily === "poppins",
          "font-opensans": style.fontFamily === "opensans",
          "allow-pagination": shouldPaginate
        })}
        style={{
          '--accent-color': style.accentColor,
          'fontSize': `${style.fontSize}px`,
          'lineHeight': style.lineHeight,
          '--section-spacing': `${style.sectionSpacing}px`,
          '--resume-font-size': `${style.fontSize}px`,
          '--resume-line-height': style.lineHeight,
          'width': a4Width,
          'height': 'auto',
          'padding': a4Padding,
          'margin': '0 auto',
          'background': 'white',
          'boxShadow': '0 0 10px rgba(0, 0, 0, 0.1)',
          'boxSizing': 'border-box',
          'position': 'relative',
          'maxHeight': shouldPaginate ? 'none' : `${(A4_HEIGHT_MM - PAGE_MARGIN_MM * 2) * scaleFactor}mm`,
          'overflow': shouldPaginate ? 'visible' : 'hidden'
        } as React.CSSProperties}
      >
        {activeSections.map((section) => {
          const Component = sectionComponents[section];
          return Component ? Component() : null;
        })}
      </div>
    </div>
  );
};

export default ResumePreview;