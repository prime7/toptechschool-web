"use client";

import React from "react";
import { ResumeEvaluationResult } from "@/service/Evaluation.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Lightbulb, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeEvaluationViewerProps {
  evaluation: ResumeEvaluationResult | null;
}

export const ResumeEvaluationViewer: React.FC<ResumeEvaluationViewerProps> = ({
  evaluation,
}) => {
  if (!evaluation) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center space-y-3">
        <AlertTriangle className="w-12 h-12 text-muted-foreground animate-pulse" />
        <h2 className="text-xl font-semibold text-foreground">No Evaluation Data</h2>
        <p className="text-muted-foreground text-sm">Upload your resume to receive feedback.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
      <div className="space-y-4">
        <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray={`${evaluation.overallScore}, 100`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 1s ease-in-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-primary">
                {evaluation.overallScore}%
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Resume Analysis</h2>
              <p className="text-sm text-muted-foreground">
                {evaluation.detailedAreasForImprovement.length} areas for improvement.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                  {evaluation.missingSkills.length} Missing Skills
                </Badge>
                <Badge variant="destructive" className="px-2 py-0.5 text-xs">
                  {evaluation.redFlags.length} Red Flags
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Areas for Improvement</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40" />
            <div className="space-y-6">
              {evaluation.detailedAreasForImprovement.length ? (
                evaluation.detailedAreasForImprovement.map((item, index) => (
                  <div key={index} className="relative pl-10">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <Card className="shadow-md hover:shadow-lg transition-all duration-200">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium text-foreground">{item.area}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-xs font-medium text-muted-foreground flex items-center gap-2 mb-2">
                              Current
                            </h3>
                            <div className="bg-muted/20 p-3 rounded-lg border border-border/40">
                              <p className="text-sm text-muted-foreground">{item.referenceText}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xs font-medium text-primary flex items-center gap-2 mb-2">
                              Improved
                            </h3>
                            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                              <p className="text-sm text-foreground">{item.improvedText}</p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2">
                          <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                            <ChevronRight className="w-3 h-3" />
                            Why This Matters
                          </h3>
                          <p className="text-sm text-muted-foreground bg-muted/10 p-3 rounded-lg">
                            {item.relevanceToRoleCategory}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No areas for improvement found.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <Card className="p-3 shadow-md hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Missing Skills
          </h2>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {evaluation.missingSkills.length ? (
              evaluation.missingSkills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 hover:bg-muted/50 transition-colors duration-200"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No missing skills found.</p>
            )}
          </div>
        </Card>

        <Card className="p-3 shadow-md">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Red Flags
          </h2>
          <div className="space-y-2 mt-2 text-muted-foreground">
            {evaluation.redFlags.length ? (
              evaluation.redFlags.map((flag, index) => (
                <div 
                  key={index} 
                  className="text-sm p-2 rounded-lg bg-destructive/20"
                >
                  {flag}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No red flags found.</p>
            )}
          </div>
        </Card>
      </aside>
    </div>
  );
};
