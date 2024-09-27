import React from "react";
import Link from "next/link";
import UploadComponent from "@/components/upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function UploadPage() {
  const user = await auth();
  const resumes = await prisma.resume.findMany({
    where: {
      userId: user?.user?.id,
    },
  });

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
        {resumes.map((resume) => (
          <Link href={`/resume/feedback/${resume.id}`} key={resume.id}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{resume.filename}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Uploaded on: {new Date(resume.createdAt).toLocaleDateString()}
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
