import React from 'react';
import { useResume } from './context/ResumeContext';
import { formatDate } from '@/lib/date-utils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
    style={{ color: 'var(--accent-color)' }}
  >
    {title}
    {style.showSectionHorizontalRule && <hr className="my-2 border-gray-900 border-solid" />}
  </h2>
)

const PersonalSection = ({ personal, style }: { personal: PersonalInfo; style: ResumeStyle }) => {
  const contactItems = [
    { icon: <Mail className="h-4 w-4 text-gray-600" />, text: personal.email },
    { icon: <Phone className="h-4 w-4 text-gray-600" />, text: personal.phone },
    { icon: <MapPin className="h-4 w-4 text-gray-600" />, text: personal.location }
  ];

  if (personal.website) {
    contactItems.push({ icon: <Globe className="h-4 w-4 text-gray-600" />, text: personal.website });
  }

  if (personal.linkedin) {
    contactItems.push({ icon: <Linkedin className="h-4 w-4 text-gray-600" />, text: personal.linkedin });
  }

  if (personal.github) {
    contactItems.push({ icon: <Github className="h-4 w-4 text-gray-600" />, text: personal.github });
  }

  return (
    <div className={cn("mb-6")}>
      <div className={cn("flex flex-col", {
        "items-center": style.personalSectionAlignment === "center",
        "items-end": style.personalSectionAlignment === "right",
        "items-start": style.personalSectionAlignment === "left"
      })}>
        <h1 className={cn('mb-1 text-2xl font-bold text-gray-800')}>
          {personal.fullName}
        </h1>
        {personal.title && (
          <h2 className={cn('mb-3 text-lg text-gray-600')}>
            {personal.title}
          </h2>
        )}
        <div className={cn("flex flex-wrap gap-4 text-gray-600", {
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
  <div style={{ marginBottom: 'var(--section-spacing)' }}>
    <SectionHeader title="Summary" style={style} />
    <p className="text-gray-600">{summary}</p>
  </div>
);

const ExperienceItem = ({ item }: { item: ExperienceItem }) => (
  <div className="mb-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{item.position}</h3>
        <div className="text-gray-600">{item.company}</div>
      </div>
      <div className={cn("text-sm text-gray-500")}>
        {formatDate(item.startDate)} - {item.endDate === undefined || item.endDate === '' ? 'Present' : formatDate(item.endDate)}
      </div>
    </div>
    <p className="text-gray-600">{item.description}</p>
    <ul className="mt-2 list-disc list-inside text-gray-600">
      {item.highlights.map((highlight: string, index: number) => (
        <li key={index}>{highlight}</li>
      ))}
    </ul>
  </div>
);

const ExperienceSection = ({ experience, style }: { experience: ExperienceItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }}>
    <SectionHeader title="Experience" style={style} />
    {experience.map((item, index) => (
      <ExperienceItem key={index} item={item} />
    ))}
  </div>
);

const EducationItem = ({ item }: { item: EducationItem }) => (
  <div className="mb-4">
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
    {item.description && <p className={cn("mt-2 text-gray-600")}>{item.description}</p>}
  </div>
);

const EducationSection = ({ education, style }: { education: EducationItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }}>
    <SectionHeader title="Education" style={style} />
    {education.map((item, index) => (
      <EducationItem key={index} item={item} />
    ))}
  </div>
);

const SkillsSection = ({ skills, style }: { skills: SkillItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }}>
    <SectionHeader title="Skills" style={style} />
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <Badge key={index} variant="secondary">{skill.name}</Badge>
      ))}
    </div>
  </div>
);

const ProjectItem = ({ project }: { project: ProjectItem }) => (
  <div className="mb-4">
    <div className="flex justify-between items-start">
      <h3 className="text-lg text-gray-800">
        {project.name}
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-600">
            <ExternalLink className="h-4 w-4 inline" />
          </a>
        )}
      </h3>
      <div className={cn("text-sm text-gray-500")}>
        {formatDate(project.startDate)}{project.endDate ? ` - ${formatDate(project.endDate)}` : ''}
      </div>
    </div>
    <p className="text-gray-600">{project.description}</p>
    <ul className="mt-2 list-disc list-inside text-gray-600">
      {project.highlights.map((highlight: string, index: number) => (
        <li key={index}>{highlight}</li>
      ))}
    </ul>
  </div>
);

const ProjectsSection = ({ projects, style }: { projects: ProjectItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }}>
    <SectionHeader title="Projects" style={style} />
    {projects.map((project, index) => (
      <ProjectItem key={index} project={project} />
    ))}
  </div>
);

const CertificationItem = ({ cert }: { cert: CertificationItem }) => (
  <div className="mb-4">
    <div className="flex justify-between items-start">
      <Link href={cert.url || ''} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600">
        {cert.name}
        <ExternalLink className="h-4 w-4 ml-2 inline" />
      </Link>
    </div>
  </div>
);

const CertificationsSection = ({ certifications, style }: { certifications: CertificationItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }}>
    <SectionHeader title="Certifications" style={style} />
    {certifications.map((cert, index) => (
      <CertificationItem key={index} cert={cert} />
    ))}
  </div>
);

const ReferencesSection = ({ references, style }: { references: ReferenceItem[]; style: ResumeStyle }) => (
  <div style={{ marginBottom: 'var(--section-spacing)' }}>
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

const ResumePreview: React.FC = () => {
  const { state } = useResume();
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
    experience: () => experience.length > 0 && <ExperienceSection experience={experience} style={style} />,
    education: () => education.length > 0 && <EducationSection education={education} style={style} />,
    skills: () => skills.length > 0 && <SkillsSection skills={skills} style={style} />,
    projects: () => projects.length > 0 && <ProjectsSection projects={projects} style={style} />,
    certifications: () => certifications.length > 0 && <CertificationsSection certifications={certifications} style={style} />,
    references: () => references.length > 0 && <ReferencesSection references={references} style={style} />
  };

  return (
    <div className="bg-white shadow-lg p-8 overflow-visible">
      <div
        id="resumePreviewContent"
        className={cn("max-w-full", {
          "font-inter": style.fontFamily === "inter",
          "font-roboto": style.fontFamily === "roboto",
          "font-poppins": style.fontFamily === "poppins",
          "font-opensans": style.fontFamily === "opensans"
        })}
        style={{
          '--accent-color': style.accentColor,
          'fontSize': `${style.fontSize}px`,
          'lineHeight': style.lineHeight,
          '--section-spacing': `${style.sectionSpacing}px`,
          '--resume-font-size': `${style.fontSize}px`,
          '--resume-line-height': style.lineHeight
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