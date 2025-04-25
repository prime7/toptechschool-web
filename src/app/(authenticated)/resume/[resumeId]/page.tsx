import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LightbulbIcon,
  Loader2,
  Star,
  AlertCircle,
  ArrowLeft,
  ListChecks,
} from "lucide-react";
import { ResumeService } from "@/service/Resume.service";
import { auth } from "@/lib/auth";
import { ResumeEvaluationResult } from "@/service/Evaluation.service";
import { Progress } from "@/components/ui/progress";
import { ParsingStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";


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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/resume">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{resume.filename || "Resume Analysis"}</h1>
          {resumeData.matchScore && (
            <Badge variant={resumeData.matchScore > 70 ? "default" : resumeData.matchScore > 50 ? "secondary" : "destructive"} className="ml-2">
              {resumeData.matchScore}% Match
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="w-5 h-5" />
                Key Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resumeData.recommendations?.length > 0 ? (
                <div className="space-y-2">
                  {resumeData.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <ListChecks className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recommendations available.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Resume Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resumeData.strengths?.length > 0 ? (
                <div className="space-y-2">
                  {resumeData.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <Star className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-500" />
                      <p className="text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No strengths identified yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <LightbulbIcon className="w-5 h-5" />
                Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resumeData.suggestions?.length > 0 ? (
                <div className="space-y-2">
                  {resumeData.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <LightbulbIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No suggestions available.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Identified Gaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resumeData.gaps?.length > 0 ? (
                <div className="space-y-2">
                  {resumeData.gaps.map((gap, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                      <p className="text-sm">{gap}</p>
                    </div>
                  ))}
                </div>
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
