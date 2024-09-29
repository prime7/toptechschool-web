import React from "react";
import Link from "next/link";
import UploadComponent from "@/components/upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserResumes } from "@/actions/resume";

export default async function UploadPage() {
  const resumes = await getUserResumes(["id", "filename", "createdAt"]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Resume Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Upload New Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Upload your resume to get ATS-friendly feedback and improve your
              chances of landing an interview.
            </p>
            <UploadComponent />
          </CardContent>
        </Card>
        <div className="col-span-full mb-4">
          <p className="text-sm text-muted-foreground">
            Showing your 3 most recent resumes. Older resumes are not visible
            here.
          </p>
        </div>
        {resumes.slice(0, 3).map((resume) => (
          <Link href={`/resume/${resume.id}`} key={resume.id}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>
                  {resume.filename && resume.filename.length > 20
                    ? resume.filename.substring(0, 17) + "..."
                    : resume.filename || "Untitled Resume"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Uploaded on:{" "}
                  {resume.createdAt
                    ? new Date(resume.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click to view feedback
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
