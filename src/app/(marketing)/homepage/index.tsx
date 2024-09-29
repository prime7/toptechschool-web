"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FormSubmission } from "./Form";
import { Hero } from "./Hero";

export default function Home() {
  const waitlistRef = useRef<HTMLDivElement>(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
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
        <Hero />
        <section ref={waitlistRef} className="mb-24">
          <FormSubmission />
        </section>
      </div>
    </div>
  );
}
