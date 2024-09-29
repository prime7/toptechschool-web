"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Users,
  BookOpen,
  Brain,
} from "lucide-react";
import { FeatureItem } from "./Feature";
import { submitToWaitlist } from "@/actions/waitlist";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { waitlistSchema, WaitlistInput } from "@/actions/waitlist";

export default function Home() {
  const waitlistRef = useRef<HTMLDivElement>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistInput>({
    resolver: zodResolver(waitlistSchema),
  });

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = async (data: WaitlistInput) => {
    const result = await submitToWaitlist(data);
    setSubmitMessage(result.message);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Welcome to Toptechschool</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered career development platform for tech professionals
          </p>
          <Button onClick={scrollToWaitlist} className="mt-8">
            Join Waitlist <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </header>

        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <FeatureItem
              icon={<CheckCircle className="h-8 w-8 text-primary" />}
              title="Resume Tools"
              description="Evaluate, optimize for ATS, and craft perfect resumes"
            />
            <FeatureItem
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Job Preparation"
              description="AI-powered guidance and planning for your dream job"
            />
            <FeatureItem
              icon={<Users className="h-8 w-8 text-primary" />}
              title="AI Mentor"
              description="Personalized mentorship for career growth"
            />
            <FeatureItem
              icon={<BookOpen className="h-8 w-8 text-primary" />}
              title="Interview Assistance"
              description="Chat-based behavioral interview preparation"
            />
            <FeatureItem
              icon={<ArrowRight className="h-8 w-8 text-primary" />}
              title="Career Development"
              description="Social media optimization and content creation tools"
            />
            <FeatureItem
              icon={<Brain className="h-8 w-8 text-primary" />}
              title="Mental Helper"
              description="AI agent to focus on crucial career steps"
            />
          </div>
        </section>

        <section ref={waitlistRef} className="mb-24">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Join Our Waitlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                <Button type="submit" className="w-full">
                  Submit
                </Button>
                {submitMessage && (
                  <p className="text-center text-sm mt-2">{submitMessage}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
