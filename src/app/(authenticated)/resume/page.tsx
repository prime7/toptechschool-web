import React from "react";
import { Upload} from "@/components/upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Resume from "./Resume";
import { getUserResumes } from "@/actions/resume";

export default async function UploadPage() {
  const resumes = await getUserResumes();
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Resume Evaluation Assistant
            </CardTitle>
            <CardDescription className="text-lg text-center text-muted-foreground">
              Get personalized feedback on your resume in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Upload />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              {resumes.length === 0 ? "Why Upload Your Resume?" : "Your Resumes"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resumes.length === 0 ? (
              <div className="text-center">
                <div className="max-w-md mx-auto shadow-sm">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-primary/10 rounded-full">
                        <span className="text-xl">⚡</span>
                      </div>
                      <span className="text-left">Get <strong>instant AI feedback</strong> on your resume&apos;s strengths and weaknesses</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-primary/10 rounded-full">
                        <span className="text-xl">🔍</span>
                      </div>
                      <span className="text-left">Get <strong>matched with LinkedIn jobs</strong> faster based on your skills</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-primary/10 rounded-full">
                        <span className="text-xl">✨</span>
                      </div>
                      <span className="text-left">Receive <strong>personalized suggestions</strong> to improve your resume</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <Resume
                    key={resume.id}
                    id={resume.id}
                    filename={resume.filename}
                    createdAt={resume.createdAt}
                    profession={resume.profession || undefined}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
