"use client";
import { useState } from "react";
import axios from "axios";
import { EvaluateJobResponse } from "@/actions/evaluate/types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface JobMatcherFormProps {
  resumes: {
    id: string;
    filename: string;
    createdAt: Date;
  }[];
}

export default function JobMatcherForm({ resumes }: JobMatcherFormProps) {
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<EvaluateJobResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/evaluate/job", {
        resumeId: selectedResumeId,
        jobTitle,
        jobDesc,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error evaluating job:", error);
      setResult({ matchScore: 0, missingKeywords: [], suggestions: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Job Title Input */}
            <div className="w-full space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Senior Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>

            {/* Resume Dropdown */}
            <div className="w-full space-y-2">
              <Label htmlFor="resumeId">Select Resume</Label>
              <Select
                onValueChange={(value) => setSelectedResumeId(value)}
                value={selectedResumeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No resumes found
                    </SelectItem>
                  ) : (
                    resumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.filename} (Uploaded on{" "}
                        {new Date(resume.createdAt).toLocaleDateString()})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Description Input */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the full job description here..."
              className="min-h-60"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <>Analyzing...</> : "Match Job Description"}
          </Button>

          {/* Result Display */}
          {result && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Evaluation Result</h3>
              <p>
                <strong>Match Score:</strong>{" "}
                <span className="font-medium">{result.matchScore}%</span>
              </p>
              <p>
                <strong>Missing Keywords:</strong>{" "}
                {result.missingKeywords.length > 0 ? (
                  <span className="text-red-600 font-medium">
                    {result.missingKeywords.join(", ")}
                  </span>
                ) : (
                  <span className="text-green-600">None</span>
                )}
              </p>
              <p>
                <strong>Suggestions:</strong>
                <ul className="list-disc pl-6">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
