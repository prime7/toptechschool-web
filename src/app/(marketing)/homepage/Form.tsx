"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitToWaitlist } from "@/actions/waitlist";
import { waitlistSchema, WaitlistInput } from "@/actions/waitlist";

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

  return (
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
  );
};
