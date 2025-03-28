import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  LightbulbIcon,
  Loader2,
  Star,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { ResumeService } from "@/service/Resume.service";
import { auth } from "@/lib/auth";
import { ResumeEvaluationResult } from "@/service/Evaluation.service";
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

export default async function Resume({
  params,
}: {
  params: { resumeId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const resume = await ResumeService.getResumeById(params.resumeId, session.user.id);
  const resumeData = resume.analysis as unknown as ResumeEvaluationResult;

  if (!resume?.parsed) {
    return (
      <>
        <meta httpEquiv="refresh" content="4" />
        <ResumeLoading />
      </>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="w-full md:w-2/3 space-y-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-muted/50 border-b">
              <div className="flex items-center gap-2">
                <CardTitle className="font-semibold">Key Recommendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-sm whitespace-pre-line max-w-none">
                {resumeData.recommendations}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-muted/50 border-b">
              <div className="flex items-center gap-2">
                <CardTitle className="font-semibold">Resume Strengths</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {resumeData.strengths.length > 0 ? (
                <ul className="space-y-3">
                  {resumeData.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-2 rounded-md bg-muted/60">
                      <Star className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-500" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No strengths identified yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3 space-y-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-muted/50 border-b">
              <div className="flex items-center gap-2">
                <CardTitle className="font-semibold">Improvement Suggestions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {resumeData.suggestions.length > 0 ? (
                <ul className="space-y-3">
                  {resumeData.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-2 rounded-md bg-muted/60">
                      <LightbulbIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No suggestions available.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-muted/50 border-b">
              <div className="flex items-center gap-2">
                <CardTitle className="font-semibold">Identified Gaps</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {resumeData.gaps.length > 0 ? (
                <ul className="space-y-3">
                  {resumeData.gaps.map((gap: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-2 rounded-md bg-muted/60">
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                      <span className="text-sm">{gap}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No gaps identified.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
