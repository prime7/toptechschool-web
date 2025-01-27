import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Code2,
  Languages,
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Link,
  Github,
  Globe,
  FileText,
  BarChart,
  ListChecks,
  AlertTriangle,
} from "lucide-react";
import { getUserResume } from "@/actions/resume";
import type { ResumeAnalysisResult } from "@/actions/parser/types";

export default async function Resume({
  params,
}: {
  params: { resumeId: string };
}) {
  const resumeData = (await getUserResume(params.resumeId, [
    "content",
    "analysis",
  ])) as ResumeAnalysisResult;

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
      resumeData.analysis.documentFormatting.isProperlyFormatted,
      resumeData.analysis.documentFormatting.hasOptimalLength,
      resumeData.analysis.hasReasonableLineBreaks,
      resumeData.analysis.contentQuality.contactInfoPresent.email,
      resumeData.analysis.contentQuality.contactInfoPresent.phone,
      resumeData.analysis.contentQuality.contactInfoPresent.linkedIn,
    ];
    const score = (checks.filter(Boolean).length / checks.length) * 100;
    return Math.round(score);
  };

  return (
    <div className="bg-background">
      <header className="bg-card shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Resume Review</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Personal Information Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>{resumeData.content.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>{resumeData.content.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>{resumeData.content.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{resumeData.content.address || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link className="w-5 h-5 text-primary" />
                    <span>{resumeData.content.linkedIn || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-primary" />
                    <span>{resumeData.content.githubProfile || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <span>{resumeData.content.portfolioUrl || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">Professional Summary</h2>
                </div>
                <p className="text-muted-foreground">
                  {resumeData.content.summary || 'No summary provided'}
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">ATS Score</h3>
                    </div>
                    <span className="text-2xl font-bold text-primary">{calculateATSScore()}%</span>
                  </div>
                  <Progress value={calculateATSScore()} className="mt-4" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ListChecks className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Skills</h3>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {resumeData.analysis.contentQuality.skillsSection.technicalSkills?.length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Issues</h3>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {(!resumeData.analysis.documentFormatting.isProperlyFormatted ? 1 : 0) +
                       (!resumeData.analysis.documentFormatting.hasAppropriateSpacing ? 1 : 0) +
                       (resumeData.analysis.readabilityScore && resumeData.analysis.readabilityScore > 12 ? 1 : 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Code2 className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-medium">Technical Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.analysis.contentQuality.skillsSection.technicalSkills?.map(
                        (skill: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        )
                      ) || 'No technical skills listed'}
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Languages className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-medium">Soft Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.analysis.contentQuality.skillsSection.softSkills?.map(
                        (skill: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        )
                      ) || 'No soft skills listed'}
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Briefcase className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-medium">Experience</h3>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                      {resumeData.content.experience || 'No experience listed'}
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <GraduationCap className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-medium">Education</h3>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                      {resumeData.content.education || 'No education listed'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Document Analysis</h2>
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
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Proper Formatting</span>
                        {getStatusIcon(
                          resumeData.analysis.documentFormatting.isProperlyFormatted
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Optimal Length</span>
                        {getStatusIcon(
                          resumeData.analysis.documentFormatting.hasOptimalLength
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Appropriate Spacing</span>
                        {getStatusIcon(
                          resumeData.analysis.documentFormatting
                            .hasAppropriateSpacing
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Keyword Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumeData.analysis.contentQuality.keywordAnalysis?.map(
                    (keyword, index) => (
                      <div key={index} className="bg-muted rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{keyword.term}</Badge>
                          <span className="text-sm font-medium">
                            Score: {keyword.relevanceScore}/10
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Occurrences: {keyword.occurrences}</p>
                          <p>
                            Frequency: {keyword.frequencyPercentage.toFixed(1)}%
                          </p>
                          <p>Context: {keyword.context}</p>
                        </div>
                      </div>
                    )
                  ) || <p>No keyword analysis available</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                <div className="space-y-4">
                  {!resumeData.analysis.documentFormatting.isProperlyFormatted && (
                    <Alert variant="destructive">
                      <AlertCircle className="w-4 h-4" />
                      <AlertTitle>Formatting Issues</AlertTitle>
                      <AlertDescription>
                        Improve document formatting for better readability. Consider using consistent spacing and alignment.
                      </AlertDescription>
                    </Alert>
                  )}
                  {!resumeData.analysis.documentFormatting.hasAppropriateSpacing && (
                    <Alert variant="destructive">
                      <AlertCircle className="w-4 h-4" />
                      <AlertTitle>Spacing Issues</AlertTitle>
                      <AlertDescription>
                        Adjust line spacing for better visual appeal. Use appropriate margins and paragraph breaks.
                      </AlertDescription>
                    </Alert>
                  )}
                  {resumeData.analysis.readabilityScore &&
                    resumeData.analysis.readabilityScore > 12 && (
                      <Alert variant="destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertTitle>Readability Concerns</AlertTitle>
                        <AlertDescription>
                          Simplify language for better comprehension. Current readability score: {resumeData.analysis.readabilityScore}
                        </AlertDescription>
                      </Alert>
                  )}
                  {(!resumeData.analysis.documentFormatting.isProperlyFormatted ||
                    !resumeData.analysis.documentFormatting.hasAppropriateSpacing ||
                    (resumeData.analysis.readabilityScore && resumeData.analysis.readabilityScore > 12)) || (
                      <Alert>
                        <CheckCircle2 className="w-4 h-4" />
                        <AlertTitle>Looking Good!</AlertTitle>
                        <AlertDescription>
                          Your resume meets all our basic formatting and readability guidelines.
                        </AlertDescription>
                      </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
