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
  LanguageItem, 
  ReferenceItem, 
  ResumeStyle 
} from './types';

const ContactItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center">
    <span className="mr-1.5">{icon}</span>
    <span>{text}</span>
  </div>
)

const SectionHeader = ({ title, alignment }: { title: string; alignment: string }) => (
  <h2 className={cn("mb-3 text-xl font-bold", "text-[var(--accent-color)]", {
    "text-center": alignment === "center",
    "text-right": alignment === "right",
    "text-left": alignment === "left"
  })}>{title}</h2>
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
  <div className="mb-6">
    <SectionHeader title="Summary" alignment={style.sectionHeaderAlignment} />
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
        {formatDate(item.startDate)} - {item.endDate === undefined ? 'Present' : formatDate(item.endDate)}
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
  <div className="mb-6">
    <SectionHeader title="Experience" alignment={style.sectionHeaderAlignment} />
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
  <div className="mb-6">
    <SectionHeader title="Education" alignment={style.sectionHeaderAlignment} />
    {education.map((item, index) => (
      <EducationItem key={index} item={item} />
    ))}
  </div>
);

const SkillsSection = ({ skills, style }: { skills: SkillItem[]; style: ResumeStyle }) => (
  <div className="mb-6">
    <SectionHeader title="Skills" alignment={style.sectionHeaderAlignment} />
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
          {skill.name}
        </Badge>
      ))}
    </div>
  </div>
);

const ProjectItem = ({ project }: { project: ProjectItem }) => (
  <div className="mb-4">
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-gray-800">
        {project.name}
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-600">
            <ExternalLink className="h-4 w-4 inline" />
          </a>
        )}
      </h3>
      <div className={cn("text-sm text-gray-500")}>
        {formatDate(project.startDate)} - {formatDate(project.endDate)}
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
  <div className="mb-6">
    <SectionHeader title="Projects" alignment={style.sectionHeaderAlignment} />
    {projects.map((project, index) => (
      <ProjectItem key={index} project={project} />
    ))}
  </div>
);

const CertificationItem = ({ cert }: { cert: CertificationItem }) => (
  <div className="mb-4">
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-gray-800">
        {cert.name}
        {cert.url && (
          <a href={cert.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-600">
            <ExternalLink className="h-4 w-4 inline" />
          </a>
        )}
      </h3>
      <div className={cn("text-sm text-gray-500")}>
        {formatDate(cert.date)}
        {cert.expires && ` - Expires: ${formatDate(cert.expires)}`}
      </div>
    </div>
    <div className={cn('text-gray-600')}>{cert.issuer}</div>
  </div>
);

const CertificationsSection = ({ certifications, style }: { certifications: CertificationItem[]; style: ResumeStyle }) => (
  <div className="mb-6">
    <SectionHeader title="Certifications" alignment={style.sectionHeaderAlignment} />
    {certifications.map((cert, index) => (
      <CertificationItem key={index} cert={cert} />
    ))}
  </div>
);

const LanguagesSection = ({ languages, style }: { languages: LanguageItem[]; style: ResumeStyle }) => (
  <div className="mb-6">
    <SectionHeader title="Languages" alignment={style.sectionHeaderAlignment} />
    {languages.map((lang, index) => (
      <div key={index} className="mb-2 flex justify-between text-gray-600">
        <span>{lang.language}</span>
        <span>{lang.proficiency}</span>
      </div>
    ))}
  </div>
);

const ReferencesSection = ({ references }: { references: ReferenceItem[] }) => (
  <div className="mb-6">
    <h2 className={cn("mb-3")}>References</h2>
    {references.map((ref, index) => (
      <div key={index} className="mb-4">
        <h3>{ref.name}</h3>
        <div>{ref.position} at {ref.company}</div>
        <div>
          {ref.email}
          {ref.phone && ` • ${ref.phone}`}
        </div>
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
    languages,
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
    languages: () => languages.length > 0 && <LanguagesSection languages={languages} style={style} />,
    references: () => references.length > 0 && <ReferencesSection references={references} />
  };

  return (
    <div className="w-[794px] min-h-[1123px] bg-white shadow-lg mx-auto p-8 box-border">
      <div 
        className="h-full"
        style={{
          fontFamily: style.fontFamily === 'inter' ? 'var(--font-inter)' :
                     style.fontFamily === 'roboto' ? 'var(--font-roboto)' :
                     style.fontFamily === 'poppins' ? 'var(--font-poppins)' :
                     style.fontFamily === 'opensans' ? 'var(--font-opensans)' : 'var(--font-inter)',
          fontSize: `${style.fontSize}px`,
          lineHeight: style.lineHeight,
          '--accent-color': style.accentColor,
          '--section-spacing': `${style.sectionSpacing}px`,
        } as React.CSSProperties}
      >
        {activeSections.map((section, index) => (
          <React.Fragment key={section}>
            {sectionComponents[section as keyof typeof sectionComponents]?.()}
            {style.showSectionHorizontalRule && index < activeSections.length - 1 && (
              <hr className="border-t border-gray-600 my-1" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ResumePreview;