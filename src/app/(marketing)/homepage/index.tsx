"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { Hero } from "./Hero";

const Features = dynamic(
  () => import("./Features").then((mod) => mod.Features),
  { ssr: false }
);
const HowItWorks = dynamic(
  () => import("./HowItWorks").then((mod) => mod.HowItWorks),
  { ssr: false }
);
const FormSubmission = dynamic(
  () => import("./Form").then((mod) => mod.FormSubmission),
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
        <HowItWorks />
        <section ref={waitlistRef} className="mb-24">
          <FormSubmission />
        </section>
      </div>
    </div>
  );
}
