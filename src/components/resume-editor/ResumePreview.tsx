import React from 'react';
import { useResume } from './context/ResumeContext';
import { formatDate } from '@/lib/date-utils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';
import { SectionType, TemplateType } from './types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  template?: TemplateType;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ template: overrideTemplate }) => {
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
    template: contextTemplate,
    activeSections
  } = state;

  const template = overrideTemplate || contextTemplate;

  const renderSection = (sectionId: SectionType, content: JSX.Element | null) => {
    if (!activeSections.includes(sectionId) || !content) return null;
    return content;
  };

  const templateStyles = {
    professional: {
      fontFamily: 'font-sans',
      heading: 'text-lg font-semibold border-b pb-1 text-blue-600 border-blue-200',
      section: '',
      badge: '',
      card: '',
      text: 'text-gray-900',
      muted: 'text-gray-600',
      accent: '',
      border: 'border-gray-200',
      background: 'bg-gray-50'
    },
    minimal: {
      fontFamily: 'font-serif',
      heading: 'text-lg font-semibold text-blue-600',
      section: '',
      badge: '',
      card: '',
      text: 'text-gray-900',
      muted: 'text-gray-600',
      accent: '',
      border: 'border-gray-200',
      background: 'bg-gray-50'
    },
  };

  const currentStyle = templateStyles[template as keyof typeof templateStyles] || templateStyles.professional;

  const renderPersonalInfo = () => {
    const contactItems = [
      { icon: <Mail className="h-4 w-4" />, text: personal.email },
      { icon: <Phone className="h-4 w-4" />, text: personal.phone },
      { icon: <MapPin className="h-4 w-4" />, text: personal.location }
    ];

    if (personal.website) {
      contactItems.push({ icon: <Globe className="h-4 w-4" />, text: personal.website });
    }

    if (personal.linkedin) {
      contactItems.push({ icon: <Linkedin className="h-4 w-4" />, text: personal.linkedin });
    }

    if (personal.github) {
      contactItems.push({ icon: <Github className="h-4 w-4" />, text: personal.github });
    }

    return (
      <div className={cn("mb-6")}>
        <h1 className={cn("text-3xl font-bold text-gray-900", 'mb-1')}>
          {personal.fullName}
        </h1>
        {personal.title && (
          <h2 className={cn("text-xl text-gray-700", 'mb-3')}>
            {personal.title}
          </h2>
        )}
        <div className={cn("flex flex-wrap gap-4")}>
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <span className="mr-1.5">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3", currentStyle.heading)}>Summary</h2>
        <p className={currentStyle.text}>{summary}</p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!experience.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3", currentStyle.heading)}>Experience</h2>
        {experience.map((item) => (
          <div key={item.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className={currentStyle.text}>{item.position}</h3>
                <div className={currentStyle.muted}>{item.company}</div>
              </div>
              <div className={cn("text-sm", currentStyle.muted)}>
                {formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}
              </div>
            </div>
            <p className={cn("mt-2", currentStyle.text)}>{item.description}</p>
            <ul className="mt-2 list-disc list-inside">
              {item.highlights.map((highlight, index) => (
                <li key={index} className={currentStyle.text}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderEducation = () => {
    if (!education.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3", currentStyle.heading)}>Education</h2>
        {education.map((item) => (
          <div key={item.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className={currentStyle.text}>{item.degree} in {item.field}</h3>
                <div className={currentStyle.muted}>{item.institution}</div>
              </div>
              <div className={cn("text-sm", currentStyle.muted)}>
                {formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}
              </div>
            </div>
            {item.gpa && <div className={cn("mt-1", currentStyle.muted)}>GPA: {item.gpa}</div>}
            {item.description && <p className={cn("mt-2", currentStyle.text)}>{item.description}</p>}
          </div>
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (!skills.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3", currentStyle.heading)}>Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className={currentStyle.badge}>
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!projects.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3", currentStyle.heading)}>Projects</h2>
        {projects.map((project) => (
          <div key={project.id} className="mb-4">
            <div className="flex justify-between items-start">
              <h3 className={currentStyle.text}>
                {project.name}
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="ml-2">
                    <ExternalLink className="h-4 w-4 inline" />
                  </a>
                )}
              </h3>
              <div className={cn("text-sm", currentStyle.muted)}>
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </div>
            </div>
            <p className={cn("mt-2", currentStyle.text)}>{project.description}</p>
            <ul className="mt-2 list-disc list-inside">
              {project.highlights.map((highlight, index) => (
                <li key={index} className={currentStyle.text}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderCertifications = () => {
    if (!certifications.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3", currentStyle.heading)}>Certifications</h2>
        {certifications.map((cert) => (
          <div key={cert.id} className="mb-4">
            <div className="flex justify-between items-start">
              <h3 className={currentStyle.text}>
                {cert.name}
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="ml-2">
                    <ExternalLink className="h-4 w-4 inline" />
                  </a>
                )}
              </h3>
              <div className={cn("text-sm", currentStyle.muted)}>
                {formatDate(cert.date)}
                {cert.expires && ` - Expires: ${formatDate(cert.expires)}`}
              </div>
            </div>
            <div className={currentStyle.muted}>{cert.issuer}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderLanguages = () => {
    if (!languages.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3", currentStyle.heading)}>Languages</h2>
        {languages.map((lang) => (
          <div key={lang.id} className="mb-2 flex justify-between">
            <span className={currentStyle.text}>{lang.language}</span>
            <span className={currentStyle.muted}>{lang.proficiency}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderReferences = () => {
    if (!references.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3", currentStyle.heading)}>References</h2>
        {references.map((ref) => (
          <div key={ref.id} className="mb-4">
            <h3 className={currentStyle.text}>{ref.name}</h3>
            <div className={currentStyle.muted}>{ref.position} at {ref.company}</div>
            <div className={currentStyle.muted}>
              {ref.email}
              {ref.phone && ` • ${ref.phone}`}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn(
      "max-w-2xl mx-auto px-6 py-8 shadow-sm print:shadow-none",
      currentStyle.fontFamily,
      currentStyle.background,
    )}>
      {renderPersonalInfo()}

      <div className={cn(currentStyle.section)}>
        {activeSections.map((section) => {
          switch (section) {
            case 'summary':
              return renderSection('summary', renderSummary());
            case 'experience':
              return renderSection('experience', renderExperience());
            case 'education':
              return renderSection('education', renderEducation());
            case 'skills':
              return renderSection('skills', renderSkills());
            case 'projects':
              return renderSection('projects', renderProjects());
            case 'certifications':
              return renderSection('certifications', renderCertifications());
            case 'languages':
              return renderSection('languages', renderLanguages());
            case 'references':
              return renderSection('references', renderReferences());
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default ResumePreview;