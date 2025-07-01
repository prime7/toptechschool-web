"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { submitToNewsletter } from "@/actions/newsletter";
import { newsletterSchema, NewsletterInput } from "@/actions/newsletter";
import { Section } from "@/components/common/Section";

export const FormSubmission: React.FC = () => {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitToNewsletter(data);
      setSubmitMessage(result.message);
      if (result.success) {
        reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section>
      <div className="max-w-md mx-auto py-16">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold tracking-tight">
            Join our newsletter
          </h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto mt-2">
            Stay updated with the latest features and announcements.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <Input
                type="email"
                id="newsletter-email"
                {...register("email")}
                className="pl-4 pr-3 py-2 w-full rounded-md border border-input"
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Subscribe"}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            No spam, unsubscribe at any time.
          </p>

          {errors.email && (
            <p className="text-destructive text-sm text-center">
              {errors.email.message}
            </p>
          )}

          {submitMessage && (
            <div
              className={`p-3 rounded-md text-center text-sm ${submitMessage.includes("Successfully") ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}
            >
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </Section>
  );
};
