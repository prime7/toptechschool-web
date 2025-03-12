import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ResumeService } from "@/service/Resume.service";
import { Resume } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Job from "./Job";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function JobPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const resumes = await ResumeService.getUserResumes(session.user.id);

  if (resumes.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">No Resumes Found</CardTitle> 
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 py-8">
            <p className="text-muted-foreground">Please upload a resume to evaluate job fit.</p>
            <Button 
              asChild 
              variant="default" 
              className="transition-colors duration-200 shadow-sm"
            >
              <Link href="/resume">
                Upload Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>  
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto space-y-8">
        <CardHeader>
          <CardTitle>Evaluate Job Fit</CardTitle>
      </CardHeader>
      <CardContent>
          <Job resumes={resumes as Resume[]} />
        </CardContent>
      </Card>
    </div>
  );
}
