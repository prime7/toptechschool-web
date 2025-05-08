import { ResumeService } from "@/service/Resume.service";
import { auth } from "@/lib/auth";
import { ResumeEvaluationResult } from "@/service/Evaluation.service";
import { ResumeEvaluationViewer } from "./ResumeEvaluationViewer";
import { ArrowLeft } from "lucide-react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParsingStatus } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function ResumeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold mb-2">Analyzing your resume...</h2>
        <p className="text-muted-foreground text-center max-w-md">
          We&apos;re processing your resume to provide personalized feedback. This may take a minute.
        </p>
        <Progress className="w-64 mt-4" value={75} />
      </div>
    </div>
  );
}

export default async function ResumePage({
  params,
}: {
  params: { resumeId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please sign in to view this page.");
  }

  const resume = await ResumeService.getResumeById(params.resumeId, session.user.id);
  const resumeData = resume.analysis as unknown as ResumeEvaluationResult;

  if (resume.parsed === ParsingStatus.ERROR) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Processing Resume</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We encountered an issue while analyzing your resume. This could be due to the file format or content structure.
          </p>
          <div className="mt-6">
            <Button asChild variant="default">
              <Link href="/resume">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to resume dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (resume.parsed === ParsingStatus.STARTED || resume.parsed === ParsingStatus.NOT_STARTED) {
    return (
      <>
        <meta httpEquiv="refresh" content="4" />
        <ResumeLoading />
      </>
    );
  }

  return (
    <div className="container mx-auto">
      <ResumeEvaluationViewer evaluation={resumeData} />
    </div>
  );
}