"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { submitToWaitlist } from "@/actions/waitlist";
import { waitlistSchema, WaitlistInput } from "@/actions/waitlist";
import { FileText, Linkedin, Sparkles, LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  features: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, features, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
              <feature.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

interface WaitlistFormCardProps {
  title: string;
  description: string;
  onSubmit: (data: WaitlistInput) => Promise<void>;
  submitMessage: string | null;
  register: any;
  handleSubmit: any;
  errors: any;
}

const WaitlistFormCard: React.FC<WaitlistFormCardProps> = ({
  title,
  description,
  onSubmit,
  submitMessage,
  register,
  handleSubmit,
  errors,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Join Waitlist
          </Button>
          {submitMessage && (
            <p className="text-center text-sm mt-2">{submitMessage}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export const FormSubmission: React.FC = () => {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistInput>({
    resolver: zodResolver(waitlistSchema),
  });

  const onSubmit = async (data: WaitlistInput) => {
    const result = await submitToWaitlist(data);
    setSubmitMessage(result.message);
  };

  const features = [
    {
      icon: FileText,
      title: "Resume Analysis",
      description: "Get instant AI feedback on your resume",
    },
    {
      icon: Linkedin,
      title: "LinkedIn Extension",
      description: "One-click job validation while browsing",
    },
    {
      icon: Sparkles,
      title: "Priority Access",
      description: "Be first to try our mentorship program",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Join the Future of Tech Hiring</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Be among the first to experience our AI-powered platform and get early access to our mentorship program.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <FeatureCard
          title="What You'll Get"
          description="Early access to our platform features"
          features={features}
          className="bg-primary/5"
        />
        <WaitlistFormCard
          title="Join the Waitlist"
          description="Get early access to our platform"
          onSubmit={onSubmit}
          submitMessage={submitMessage}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
        />
      </div>
    </div>
  );
};
