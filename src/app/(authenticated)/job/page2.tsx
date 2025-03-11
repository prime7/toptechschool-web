"use client";

import { useState, useEffect } from "react";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { JobMatchEvaluationResult } from "@/service/Evaluation.service";
import { JobRole, Resume } from "@prisma/client";

const formSchema = z.object({
  jobRole: z.nativeEnum(JobRole, {
    errorMap: () => ({ message: "Please select a job role" }),
  }),
  jobDescription: z.string().min(1, "Job description is required"),
  resumeId: z.string().min(1, "Please select a resume"),
});

type FormValues = z.infer<typeof formSchema>;

const NoResumesCard = () => (
  <Card>
    <CardHeader className="flex flex-col items-center">
      <CardTitle>No Resumes Found</CardTitle>
      <CardDescription>
        You need to upload a resume before you can evaluate job fit.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center">
      <Button asChild>
        <Link href="/resume">
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const JobRoleField = ({ control }: { control: Control<FormValues> }) => (
  <FormField
    control={control}
    name="jobRole"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Job Role</FormLabel>
        <Select 
          onValueChange={field.onChange} 
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select job role" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {Object.entries(JobRole).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {key.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

const ResumeSelectionField = ({ 
  control, 
  resumes, 
  isLoadingResumes 
}: { 
  control: Control<FormValues>; 
  resumes: Resume[]; 
  isLoadingResumes: boolean; 
}) => (
  <FormField
    control={control}
    name="resumeId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Select Resume</FormLabel>
        <Select 
          onValueChange={field.onChange} 
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a resume" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {isLoadingResumes ? (
              <SelectItem value="loading" disabled>
                Loading resumes...
              </SelectItem>
            ) : resumes.length > 0 ? (
              resumes.map((resume) => (
                <SelectItem key={resume.id} value={resume.id}>
                  {resume.filename} ({resume.jobRole || "No role specified"})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No resumes found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

const JobDescriptionField = ({ control }: { control: Control<FormValues> }) => (
  <FormField
    control={control}
    name="jobDescription"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Job Description</FormLabel>
        <FormControl>
          <Textarea 
            placeholder="Paste the job description here..." 
            className="min-h-[200px]"
            {...field} 
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const JobEvaluationForm = ({ 
  form, 
  onSubmit, 
  isLoading, 
  resumes, 
  isLoadingResumes 
}: { 
  form: ReturnType<typeof useForm<FormValues>>; 
  onSubmit: (values: FormValues) => Promise<void>; 
  isLoading: boolean; 
  resumes: Resume[]; 
  isLoadingResumes: boolean; 
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Evaluate Job Fit</CardTitle>
    </CardHeader>
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JobRoleField control={form.control} />
            <ResumeSelectionField 
              control={form.control} 
              resumes={resumes} 
              isLoadingResumes={isLoadingResumes} 
            />
          </div>
          
          <JobDescriptionField control={form.control} />
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Evaluating...
              </>
            ) : (
              "Evaluate Job Fit"
            )}
          </Button>
        </form>
      </Form>
    </CardContent>
  </Card>
);

const EvaluationResults = ({ evaluation }: { evaluation: JobMatchEvaluationResult }) => (
  <Card>
    <CardHeader>
      <CardTitle>Evaluation Results</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Match Score</h3>
          <div className="mt-2 bg-gray-200 rounded-full h-4">
            <div 
              className="bg-primary h-4 rounded-full" 
              style={{ width: `${evaluation.matchScore}%` }}
            ></div>
          </div>
          <p className="text-right mt-1">{evaluation.matchScore}%</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Strengths</h3>
          <ul className="list-disc pl-5 mt-2">
            {evaluation.strengths.map((strength: string, index: number) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Gaps</h3>
          <ul className="list-disc pl-5 mt-2">
            {evaluation.gaps.map((gap: string, index: number) => (
              <li key={index}>{gap}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Missing Keywords</h3>
          <ul className="list-disc pl-5 mt-2">
            {evaluation.missingKeywords.map((keyword: string, index: number) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
        </div>
        
        {evaluation.suggestions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Suggestions</h3>
            <ul className="list-disc pl-5 mt-2">
              {evaluation.suggestions.map((suggestion: string, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-semibold">Recommendations</h3>
          <p className="mt-2">{evaluation.recommendations}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function JobPage() {
  const [evaluation, setEvaluation] = useState<JobMatchEvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: undefined,
      jobDescription: "",
      resumeId: "",
    },
  });

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get("/api/resume");
        setResumes(response.data);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
        toast({
          title: "Error loading resumes",
          description: "Please try again or upload a new resume",
          variant: "destructive",
        });
      } finally {
        setIsLoadingResumes(false);
      }
    };

    fetchResumes();
  }, []);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/job/evaluate", {
        jobDescription: values.jobDescription,
        resumeId: values.resumeId,
        jobRole: values.jobRole,
      });

      setEvaluation(response.data.evaluation);
      toast({
        title: "Success",
        description: "Job evaluation completed",
      });
    } catch (error) {
      console.error("Failed to evaluate job:", error);
      toast({
        title: "Error",
        description: "Failed to evaluate job",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Job Evaluation</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {isLoadingResumes ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <p>Loading resumes...</p>
            </CardContent>
          </Card>
        ) : resumes.length === 0 ? (
          <NoResumesCard />
        ) : (
          <>
            <JobEvaluationForm 
              form={form} 
              onSubmit={onSubmit} 
              isLoading={isLoading} 
              resumes={resumes} 
              isLoadingResumes={isLoadingResumes} 
            />
            {evaluation && <EvaluationResults evaluation={evaluation} />}
          </>
        )}
      </div>
      
      {!isLoadingResumes && resumes.length > 0 && (
        <div className="mt-6 text-center">
          <p className="mb-2">Want to upload another resume?</p>
          <Button asChild variant="outline">
            <Link href="/resume">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Resume
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
