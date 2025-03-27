"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { submitToNewsletter } from "@/actions/newsletter";
import { newsletterSchema, NewsletterInput } from "@/actions/newsletter";

export const FormSubmission: React.FC = () => {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterInput) => {
    const result = await submitToNewsletter(data);
    setSubmitMessage(result.message);
  };

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="p-1.5 flex flex-col sm:flex-row items-center gap-2 border border-gray-200 rounded-lg dark:border-neutral-700">
            <div className="relative w-full">
              <label htmlFor="hero-input" className="sr-only">Subscribe</label>
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
                <svg className="shrink-0 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <Input
                type="email"
                id="hero-input"
                {...register("email")}
                className="py-1.5 sm:py-2 ps-9 pe-3 block w-full border-transparent rounded-lg sm:text-sm focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
                placeholder="Enter your email"
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto whitespace-nowrap py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-gray-800 text-white hover:bg-gray-900 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200"
            >
              Join
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-neutral-500">
            No spam, unsubscribe at any time.
          </p>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          {submitMessage && (
            <p className="text-center text-sm mt-2">{submitMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};
