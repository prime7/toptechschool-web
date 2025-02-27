import { getUserResumes } from "@/actions/resume";
import JobMatcherForm from "@/components/forms/evaluate/JobMatcherForm";

export default async function ResumeEvaluatePage() {
  const resumes = await getUserResumes(["id", "filename", "createdAt"]);

  const transformedResumes = resumes
    .filter((resume) => resume.id && resume.filename && resume.createdAt)
    .map((resume) => ({
      id: resume.id!,
      filename: resume.filename!,
      createdAt: new Date(resume.createdAt!),
    }));

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Job Description Matcher</h1>
          <p className="text-lg mb-8">
            Paste the <strong>Job Title</strong>, <strong>Description</strong>,
            and select your <strong>Resume</strong> to see how well you match
            the requirements. Get insights on missing keywords and suggestions
            to improve your application.
          </p>
        </div>

        <JobMatcherForm resumes={transformedResumes} />
      </div>
    </div>
  );
}
