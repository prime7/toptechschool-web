"use client";

import { JobMatchEvaluationResult } from "@/service/Evaluation.service";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type JobReportProps = {
  evaluation: JobMatchEvaluationResult | null;
};

export default function JobReport({ evaluation }: JobReportProps) {
  if (!evaluation) {
    return null;
  }

  return (
    <div className="space-y-6 mt-6">
      <CardHeader>
        <CardTitle>Job Match Evaluation</CardTitle>
        <CardDescription>Match score: {evaluation.matchScore}%</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Match Score</span>
            <span>{evaluation.matchScore}%</span>
          </div>
          <Progress value={evaluation.matchScore} className="h-2" />
        </div>

        {evaluation.strengths.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Strengths</h3>
            <ul className="list-disc pl-5 space-y-1">
              {evaluation.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {evaluation.gaps.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Gaps</h3>
            <ul className="list-disc pl-5 space-y-1">
              {evaluation.gaps.map((gap, index) => (
                <li key={index}>{gap}</li>
              ))}
            </ul>
          </div>
        )}

        {evaluation.missingKeywords.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {evaluation.missingKeywords.map((keyword, index) => (
                <Badge key={index} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {evaluation.suggestions.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Suggestions</h3>
            <ul className="list-disc pl-5 space-y-1">
              {evaluation.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {evaluation.recommendations && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <p className="text-sm text-muted-foreground">
              {evaluation.recommendations}
            </p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
