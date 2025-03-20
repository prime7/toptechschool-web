"use client";

import React, { useRef } from "react";
import { FormSubmission } from "./Form";
import { Features } from "./Features";
import { Hero } from "./Hero";
export default function Home() {
  const waitlistRef = useRef<HTMLDivElement>(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <Hero onJoinWaitlist={scrollToWaitlist} />
        <Features />
        <section ref={waitlistRef} className="mb-24">
          <FormSubmission />
        </section>
      </div>
    </div>
  );
}
