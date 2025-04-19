"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { JobMatchEvaluationResult } from "@/service/Evaluation.service";
import { JobRole, Resume } from "@prisma/client";
import JobReport from "./JobReport";

const formSchema = z.object({
  jobRole: z.nativeEnum(JobRole, {
    errorMap: () => ({ message: "Please select a job role" }),
  }),
  jobDescription: z.string().min(1, "Job description is required"),
  resumeId: z.string().min(1, "Please select a resume"),
});

type FormValues = z.infer<typeof formSchema>;

type JobProps = {
  resumes: Resume[];
};

export default function Job({ resumes }: JobProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<JobMatchEvaluationResult | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: undefined,
      jobDescription: "",
      resumeId: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/evaluate/job", {
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
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
                          {key
                            .replace(/_/g, " ")
                            .replace(
                              /\w\S*/g,
                              (txt) =>
                                txt.charAt(0).toUpperCase() +
                                txt.substr(1).toLowerCase()
                            )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
                      {resumes.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.filename} (
                          {resume.jobRole || "No role specified"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
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
      <JobReport evaluation={evaluation} />
    </div>
  );
}
