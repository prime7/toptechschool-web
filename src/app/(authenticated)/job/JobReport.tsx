"use client";

import { ResumeEvaluationResult } from "@/service/Evaluation.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Lightbulb, ArrowUpRight } from "lucide-react";

type JobReportProps = {
  evaluation: ResumeEvaluationResult | null;
};

export default function JobReport({ evaluation }: JobReportProps) {
  if (!evaluation) {
    return null;
  }

  return (
    <div className="space-y-6 mt-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Resume Evaluation</CardTitle>
              <CardDescription className="mt-2">Overall score</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{evaluation.overallScore}%</div>
              <div className="text-sm text-muted-foreground">Match Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={evaluation.overallScore} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {evaluation.detailedAreasForImprovement.map((area, index) => (
                <li key={index} className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary">{area.area}</h4>
                  <div className="pl-4 border-l-2 border-muted space-y-2">
                    <p className="text-sm text-muted-foreground">{area.referenceText}</p>
                    <p className="text-sm">{area.improvedText}</p>
                    <p className="text-sm italic text-primary">{area.relevanceToRoleCategory}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.redFlags.map((flag, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowUpRight className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Missing Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {evaluation.missingSkills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
