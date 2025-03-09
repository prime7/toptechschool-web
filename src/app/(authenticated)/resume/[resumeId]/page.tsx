import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  BarChart,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  LightbulbIcon,
  Loader2,
} from "lucide-react";
import { getUserResume } from "@/actions/resume";

function ResumeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold mb-2">Analyzing your resume...</h2>
        <p className="text-muted-foreground text-center max-w-md">
          We&apos;re processing your resume to provide personalized feedback. This may take a minute.
        </p>
      </div>
    </div>
  );
}

export default async function Resume({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;

  const resumeData = await getUserResume(resumeId, [
    "content",
    "analysis",
    "parsed",
  ]);

  if (!resumeData?.parsed) {
    return (
      <>
        <meta httpEquiv="refresh" content="4" />
        <ResumeLoading />
      </>
    );
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-destructive" />
    );
  };

  const contactInfo = [
    {
      icon: <Mail className="w-4 h-4" />,
      label: "Email",
      value: resumeData.content.email,
    },
    {
      icon: <Phone className="w-4 h-4" />,
      label: "Phone",
      value: resumeData.content.phone,
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "Location",
      value: resumeData.content.address,
    },
    {
      icon: <Linkedin className="w-4 h-4" />,
      label: "LinkedIn",
      value: resumeData.content.linkedIn,
    },
    {
      icon: <Github className="w-4 h-4" />,
      label: "GitHub",
      value: resumeData.content.githubProfile,
    },
    {
      icon: <Globe className="w-4 h-4" />,
      label: "Portfolio",
      value: resumeData.content.portfolioUrl,
    },
  ].filter((item) => item.value);

  const contentChecks = [
    {
      icon: getStatusIcon(resumeData.analysis.socials.email),
      label: "Email",
    },
    {
      icon: getStatusIcon(resumeData.analysis.socials.phone),
      label: "Phone",
    },
    {
      icon: getStatusIcon(resumeData.analysis.socials.address),
      label: "Address",
    },
    {
      icon: getStatusIcon(resumeData.analysis.socials.linkedIn),
      label: "LinkedIn",
    },
    {
      icon: getStatusIcon(resumeData.analysis.socials.github),
      label: "GitHub",
    },
    {
      icon: getStatusIcon(resumeData.analysis.socials.portfolio),
      label: "Portfolio",
    },
    {
      icon: getStatusIcon(resumeData.content.education ? true : false),
      label: "Education",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-medium text-sm">{item.label}</h3>
                    <p className="text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              {resumeData.content.skills && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Top Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.content.skills
                      .slice(0, 5)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="bg-muted px-2 py-1 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    {resumeData.content.skills.length > 5 && (
                      <span className="bg-muted px-2 py-1 text-xs">
                        +{resumeData.content.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader />
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <div className="grid grid-cols-1 gap-2">
                  {contentChecks.map((check, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {check.icon}
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            <CardTitle className="font-semibold">Suggestions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {resumeData.analysis.suggestions.length > 0 && (
            <ul className="space-y-2">
              {resumeData.analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <LightbulbIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
