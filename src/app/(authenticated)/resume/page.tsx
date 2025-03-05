import React from "react";
import UploadComponent from "@/components/upload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserResumes } from "@/actions/resume";
import { JobRole } from '@prisma/client';

export default async function UploadPage() {
  const resumes = await getUserResumes(["id", "filename", "createdAt"]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="shadow-lg">
          {/* Existing upload form content */}
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Resume Evaluation Assistant
            </CardTitle>
            <CardDescription className="text-lg text-center text-muted-foreground">
              Get personalized feedback on your resume in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Job Role</label>
                <Select name="jobRole" required>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Choose your target position" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(JobRole).map((role) => (
                      <SelectItem
                        key={role}
                        value={role}
                        className="hover:bg-primary/10"
                      >
                        {role.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Resume</label>
                <UploadComponent />
              </div>

              <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground"></div>
              <p className="flex items-center gap-2">
                <span>💡</span>
                <span>Tip: Make sure your resume is in PDF format for best results</span>
              </p>
          </div>
        </CardContent>
      </Card>

      {/* New section for displaying resumes */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Resumes</CardTitle>
        </CardHeader>
        <CardContent>
          {resumes.length === 0 ? (
            <p className="text-muted-foreground text-center">No resumes uploaded yet</p>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{resume.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
