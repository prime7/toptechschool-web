"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Hero } from "./_components/Hero";

const Features = dynamic(
  () => import("./_components/Features/Features").then((mod) => mod.Features),
  { ssr: false }
);
const HowItWorks = dynamic(
  () => import("./_components/HowItWorks").then((mod) => mod.HowItWorks),
  { ssr: false }
);
const FormSubmission = dynamic(
  () => import("./_components/Form").then((mod) => mod.FormSubmission),
  { ssr: false }
);
const ResumeBuilderHighlight = dynamic(
  () => import("./_components/ResumeBuilderHighlight").then((mod) => mod.ResumeBuilderHighlight),
  { ssr: false }
);
const PracticeHighlight = dynamic(
  () => import("./_components/PracticeHighlight").then((mod) => mod.PracticeHighlight),
  { ssr: false }
);
const ResumeAnalysisHighlight = dynamic(
  () => import("./_components/ResumeAnalysisHighlight").then((mod) => mod.ResumeAnalysisHighlight),
  { ssr: false }
);

export default function Home() {
  const waitlistRef = useRef<HTMLDivElement>(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <Hero onJoinWaitlist={scrollToWaitlist} />
        <Features />
        <ResumeBuilderHighlight />
        <PracticeHighlight />
        <ResumeAnalysisHighlight />
        <HowItWorks />
        <section ref={waitlistRef} className="mb-24">
          <FormSubmission />
        </section>
      </div>
    </div>
  );
}
