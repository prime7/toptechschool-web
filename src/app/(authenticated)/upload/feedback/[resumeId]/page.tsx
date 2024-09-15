"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

interface ResumeContent {
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  skills: string[];
  certifications: string;
  languages: string[];
}

interface ATSAnalysis {
  hasProperFormatting: boolean;
  hasAppropriateLength: boolean;
  hasReasonableLineBreaks: boolean;
  containsEmail: boolean;
  containsPhone: boolean;
  containsLinkedIn: boolean;
  keywordDensity: Array<{ keyword: string; count: number; density: number }>;
  readabilityScore: number;
  fileType: string;
}

interface ResumeData {
  message: string;
  content?: ResumeContent;
  atsAnalysis?: ATSAnalysis;
}

export default function Resume() {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResumeData = async () => {
    try {
      const response = await axios.get<ResumeData>(`/api/resume/${resumeId}`);
      setResumeData(response.data);
      if (response.data.message === "Resume is being parsed") {
        setTimeout(fetchResumeData, 5000);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching resume data:", err);
      setError("Failed to fetch resume data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-[150px]" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!resumeData) {
    return (
      <Alert className="m-4">
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No resume data found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resume Analysis</h1>
      <p className="mb-4 text-sm text-gray-600">{resumeData.message}</p>

      <Tabs defaultValue="content" className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          {resumeData.content && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Resume Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h2 className="font-semibold">{resumeData.content.name}</h2>
                  <p className="text-gray-600">
                    {resumeData.content.email} | {resumeData.content.phone}
                  </p>
                  <p className="text-gray-600">{resumeData.content.address}</p>
                </div>

                {["Education", "Experience", "Certifications"].map(
                  (section) => (
                    <div key={section}>
                      <h3 className="font-semibold">{section}</h3>
                      <p>
                        {resumeData.content?.[
                          section.toLowerCase() as keyof typeof resumeData.content
                        ] ?? ""}
                      </p>
                    </div>
                  )
                )}

                <div>
                  <h3 className="font-semibold">Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.content.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Languages</h3>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.content.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="analysis">
          {resumeData.atsAnalysis && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">ATS Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Formatting",
                      value: resumeData.atsAnalysis.hasProperFormatting,
                    },
                    {
                      label: "Length",
                      value: resumeData.atsAnalysis.hasAppropriateLength,
                    },
                    {
                      label: "Line Breaks",
                      value: resumeData.atsAnalysis.hasReasonableLineBreaks,
                    },
                    {
                      label: "Email",
                      value: resumeData.atsAnalysis.containsEmail,
                    },
                    {
                      label: "Phone",
                      value: resumeData.atsAnalysis.containsPhone,
                    },
                    {
                      label: "LinkedIn",
                      value: resumeData.atsAnalysis.containsLinkedIn,
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      {item.value ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <span className="font-semibold">File Type:</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {resumeData.atsAnalysis.fileType}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Keyword Density</h3>
                  <div className="space-y-2">
                    {resumeData.atsAnalysis.keywordDensity.map(
                      (keyword, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{keyword.keyword}</span>
                            <span className="text-gray-600">
                              {keyword.count} ({keyword.density.toFixed(2)}%)
                            </span>
                          </div>
                          <Progress value={keyword.density} className="h-1" />
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Readability Score</h3>
                  <p className="text-lg font-bold">
                    {resumeData.atsAnalysis.readabilityScore.toFixed(1)}
                    <span className="text-xs font-normal text-gray-600 ml-1">
                      (Flesch-Kincaid)
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
