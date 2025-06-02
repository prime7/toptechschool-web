import React from "react";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Create Your Professional Profile",
      description:
        "Build your comprehensive professional profile by documenting your qualifications, work history, and key competencies.",
      buttonLabel: "Create Profile",
      buttonLink: "/profile"
    },
    {
      title: "Customize Your Resume",
      description:
        "Utilize our advanced resume editor to refine and optimize your resume content for targeted job applications.",
      buttonLabel: "Access Editor", 
      buttonLink: "/resume/editor"
    },
    {
      title: "Generate Professional PDF",
      description:
        "Export your polished resume as a professionally formatted PDF document ready for submission.",
      buttonLabel: "View Sample",
      buttonLink: "#"
    },
    {
      title: "Career Development",
      description:
        "Submit applications with confidence and leverage our comprehensive resources for interview preparation.",
      buttonLabel: "Explore Opportunities",
      buttonLink: "#"
    },
  ];

  return (
    <Section className="bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our streamlined process helps you create professional resumes in minutes. 
            Follow these simple steps to build your career success story.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/howItWorks.png"
                alt="Resume Creation Process"
                fill
                className="object-contain rounded-2xl"
                priority
              />
            </div>
          </div>
          
          <div className="lg:col-span-7 space-y-6">
            {steps.map((step, index) => (
              <Link
                href={step.buttonLink}
                key={index}
                className="group block bg-card hover:bg-card/80 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                      {step.buttonLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-32 text-center">
          <p className="text-2xl font-medium mb-8">
            See How Easy It Is To Get Started
          </p>
          <div className="relative bg-gradient-to-br from-card to-muted aspect-video max-w-4xl mx-auto rounded-2xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer group">
              <div className="relative z-10 bg-primary/90 rounded-full p-8 group-hover:scale-110 transition-transform duration-300">
                <PlayCircle size={48} className="text-background" strokeWidth={1.5} />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default HowItWorks;
