import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Code2,
  Languages,
  XCircle,
} from "lucide-react";
import { getUserResume } from "@/actions/resume";

export default async function Resume({
  params,
}: {
  params: { resumeId: string };
}) {
  const resumeData = await getUserResume(params.resumeId, [
    "content",
    "atsAnalysis",
  ]);

  if (!resumeData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="m-4">
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No resume data found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-destructive" />
    );
  };

  const calculateATSScore = () => {
    const checks = [
      resumeData.atsAnalysis?.hasProperFormatting,
      resumeData.atsAnalysis?.hasAppropriateLength,
      resumeData.atsAnalysis?.hasReasonableLineBreaks,
      resumeData.atsAnalysis?.containsEmail,
      resumeData.atsAnalysis?.containsPhone,
      resumeData.atsAnalysis?.containsLinkedIn,
    ];
    const score = (checks.filter(Boolean).length / checks.length) * 100;
    return Math.round(score);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Resume Review</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Resume Analysis</h2>
              <Badge variant="secondary">
                {resumeData.atsAnalysis?.fileType}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    ATS Compatibility
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {calculateATSScore()}%
                  </span>
                </div>
                <Progress value={calculateATSScore()} className="mt-2" />
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Keyword Density
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resumeData.atsAnalysis?.keywordDensity.map(
                    (keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword.keyword} ({keyword.density.toFixed(1)}%)
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Code2 className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-medium">Technical Skills</h3>
                  {getStatusIcon((resumeData.content?.skills?.length ?? 0) > 0)}
                </div>
                <div className="flex flex-wrap gap-2 ml-9">
                  {resumeData.content?.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-medium">Experience</h3>
                  {getStatusIcon(
                    resumeData.content?.experience !== "Not found"
                  )}
                </div>
                <div className="ml-9 text-sm text-muted-foreground">
                  {resumeData.content?.experience}
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-medium">Education</h3>
                  {getStatusIcon(
                    (resumeData.content?.education ?? "").length > 0
                  )}
                </div>
                <div className="ml-9 text-sm text-muted-foreground">
                  {resumeData.content?.education}
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Languages className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-medium">Languages</h3>
                  {getStatusIcon(
                    (resumeData.content?.languages ?? []).length > 0
                  )}
                </div>
                <div className="flex flex-wrap gap-2 ml-9">
                  {(resumeData.content?.languages ?? []).map(
                    (language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardContent className="bg-muted p-6 border-t">
            <h3 className="text-lg font-medium mb-4">Recommended Actions</h3>
            <div className="space-y-3">
              {!resumeData.atsAnalysis?.containsLinkedIn && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>Add your LinkedIn profile URL</span>
                </div>
              )}
              {resumeData.atsAnalysis?.readabilityScore &&
                resumeData.atsAnalysis?.readabilityScore > 12 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Simplify language to improve readability</span>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
