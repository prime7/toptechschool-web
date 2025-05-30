import { prisma } from '@/lib/prisma';
import type {
  ResumeData,
  PersonalInfo,
  WorkItem,
  EducationItem,
  ProjectItem
} from '@/components/resume-editor/types'; // Adjust path if necessary

interface SharedResumePageProps {
  params: {
    sharedId: string;
  };
}

// Helper function to render bullet points (example)
const renderBulletPoints = (points: string[] | undefined) => {
  if (!points || points.length === 0) return null;
  return (
    <ul className="list-disc list-inside ml-4 mb-2">
      {points.map((point, i) => (
        <li key={i} className="text-sm">{point}</li>
      ))}
    </ul>
  );
};

export default async function SharedResumePage({ params }: SharedResumePageProps) {
  const { sharedId } = params;

  if (!sharedId) {
    return <div className="container mx-auto p-4 text-center">Invalid share link.</div>;
  }

  const resume = await prisma.resume.findUnique({
    where: {
      sharedId: sharedId,
      isPublic: true,
    },
    select: {
      content: true, // Assuming content stores ResumeData JSON
      // Potentially select other fields if needed for display, e.g., resume.profession
    },
  });

  if (!resume || !resume.content) {
    return (
      <div className="container mx-auto p-4 text-center min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Resume not found or not publicly shared.</p>
      </div>
    );
  }

  // Type assertion, ensure 'content' is valid ResumeData
  // In a real app, you might want to validate this data structure, e.g., with Zod.
  const resumeData = resume.content as ResumeData;
  const { personal, summary, work, education, projects, activeSections, style } = resumeData;

  // Basic styling (can be expanded or moved to a global CSS / Tailwind)
  const sectionClass = "mb-6 p-4 border border-gray-200 rounded-lg shadow-sm";
  const headerClass = "text-2xl font-bold mb-3 text-gray-800";
  const subHeaderClass = "text-lg font-semibold text-gray-700";
  const textMutedClass = "text-sm text-gray-500";
  const contentClass = "text-gray-700";

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto max-w-3xl bg-white p-6 md:p-10 shadow-xl rounded-lg">
        {/* Personal Info */}
        {activeSections.includes("personal") && personal && (
          <section className={sectionClass} style={{ borderColor: style?.accentColor || '#ccc' }}>
            <h1 className={headerClass} style={{ color: style?.accentColor || '#333' }}>{personal.fullName}</h1>
            {personal.profession && <p className="text-xl text-gray-600 mb-1">{personal.profession}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mb-2 text-sm">
              {personal.email && <p>Email: <a href={`mailto:${personal.email}`} className="text-blue-600 hover:underline">{personal.email}</a></p>}
              {personal.phone && <p>Phone: {personal.phone}</p>}
              {personal.location && <p>Location: {personal.location}</p>}
              {personal.website && <p>Website: <a href={personal.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{personal.website}</a></p>}
              {personal.linkedin && <p>LinkedIn: <a href={`https://${personal.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{personal.linkedin}</a></p>}
              {personal.github && <p>GitHub: <a href={`https://${personal.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{personal.github}</a></p>}
            </div>
          </section>
        )}

        {/* Summary */}
        {activeSections.includes("summary") && summary && (
          <section className={sectionClass}>
            <h2 className={headerClass} style={{ color: style?.accentColor || '#333' }}>Summary</h2>
            <p className={`${contentClass} whitespace-pre-wrap`}>{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {activeSections.includes("work") && work && work.length > 0 && (
          <section className={sectionClass}>
            <h2 className={headerClass} style={{ color: style?.accentColor || '#333' }}>Work Experience</h2>
            {work.map((job: WorkItem, index: number) => (
              <div key={job.id || index} className="mb-4">
                <h3 className={subHeaderClass}>{job.position}</h3>
                <p className="font-medium text-gray-600">{job.company} {job.location && <span className={textMutedClass}>({job.location})</span>}</p>
                <p className={textMutedClass}>{job.startDate} - {job.endDate || 'Present'}</p>
                {job.description && <p className="text-sm my-1">{job.description}</p>}
                {renderBulletPoints(job.points)}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {activeSections.includes("education") && education && education.length > 0 && (
          <section className={sectionClass}>
            <h2 className={headerClass} style={{ color: style?.accentColor || '#333' }}>Education</h2>
            {education.map((edu: EducationItem, index: number) => (
              <div key={edu.id || index} className="mb-4">
                <h3 className={subHeaderClass}>{edu.degree}</h3>
                <p className="font-medium text-gray-600">{edu.institution}</p>
                <p className={textMutedClass}>{edu.startDate} - {edu.endDate || 'Present'}</p>
                {edu.description && <p className="text-sm my-1">{edu.description}</p>}
                {renderBulletPoints(edu.points)}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {activeSections.includes("projects") && projects && projects.length > 0 && (
          <section className={sectionClass}>
            <h2 className={headerClass} style={{ color: style?.accentColor || '#333' }}>Projects</h2>
            {projects.map((project: ProjectItem, index: number) => (
              <div key={project.id || index} className="mb-4">
                <h3 className={subHeaderClass}>{project.name}</h3>
                {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className={`text-blue-600 hover:underline ${textMutedClass}`}>{project.url}</a>}
                {project.description && <p className="text-sm my-1">{project.description}</p>}
                {renderBulletPoints(project.points)}
              </div>
            ))}
          </section>
        )}

        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Resume shared publicly.</p>
        </footer>
      </div>
    </div>
  );
}
