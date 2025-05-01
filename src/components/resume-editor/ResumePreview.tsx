import React from 'react';
import { useResume } from './context/ResumeContext';
import { formatDate } from '@/lib/date-utils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';
import { SectionType } from './types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


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
    activeSections
  } = state;

  const renderSection = (sectionId: SectionType, content: JSX.Element | null) => {
    if (!activeSections.includes(sectionId) || !content) return null;
    return content;
  };

  const renderPersonalInfo = () => {
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
        <div>
          <h1 className={cn('mb-1 text-2xl font-bold text-gray-800')}>
            {personal.fullName}
          </h1>
          {personal.title && (
            <h2 className={cn('mb-3 text-lg text-gray-600')}>
              {personal.title}
            </h2>
          )}
          <div className={cn("flex flex-wrap justify-center gap-4 text-gray-600")}>
            {contactItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-1.5">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3 text-xl font-bold text-gray-800")}>Summary</h2>
        <p className="text-gray-600">{summary}</p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!experience.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3 text-xl font-bold text-gray-800")}>Experience</h2>
        {experience.map((item) => (
          <div key={item.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.position}</h3>
                <div className="text-gray-600">{item.company}</div>
              </div>
              <div className={cn("text-sm text-gray-500")}>
                {formatDate(item.startDate)} - {item.current ? 'Present' : formatDate(item.endDate)}
              </div>
            </div>
            <p className="text-gray-600">{item.description}</p>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              {item.highlights.map((highlight, index) => (
                <li key={index} className={cn('')}>{highlight}</li>
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
        <h2 className={cn("mb-3 text-xl font-bold text-gray-800")}>Education</h2>
        {education.map((item) => (
          <div key={item.id} className="mb-4">
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
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (!skills.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3 text-xl font-bold text-gray-800")}>Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="bg-gray-100 text-gray-800">
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
        <h2 className={cn("mb-3 text-xl font-bold text-gray-800")}>Projects</h2>
        {projects.map((project) => (
          <div key={project.id} className="mb-4">
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
              {project.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
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
        <h2 className={cn("mb-3 text-xl font-bold text-gray-800")}>Certifications</h2>
        {certifications.map((cert) => (
          <div key={cert.id} className="mb-4">
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
        ))}
      </div>
    );
  };

  const renderLanguages = () => {
    if (!languages.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3 text-xl font-bold text-gray-800")}>Languages</h2>
        {languages.map((lang) => (
          <div key={lang.id} className="mb-2 flex justify-between text-gray-600">
            <span>{lang.language}</span>
            <span>{lang.proficiency}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderReferences = () => {
    if (!references.length) return null;
    return (
      <div className="mb-6">
        <h2 className={cn("mb-3")}>References</h2>
        {references.map((ref) => (
          <div key={ref.id} className="mb-4">
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
  };

  return (
    <div className={cn(
      "max-w-2xl mx-auto px-6 py-8 shadow-sm print:shadow-none flex-1",
      "font-sans",
      "bg-white",
    )}>
      {renderPersonalInfo()}

      <div className={cn("section")}>
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