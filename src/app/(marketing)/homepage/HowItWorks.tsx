import React from "react";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { UserSquare, FileText, PlayCircle } from "lucide-react";
import Link from "next/link";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <UserSquare size={48} className="text-primary mb-6" />,
      title: "Complete Your Profile",
      description:
        "Head to your profile page to fill in your core information. This will form the basis of your Master Resume.",
      buttonLabel: "Go to Profile",
      buttonLink: "/profile",
    },
    {
      icon: <FileText size={48} className="text-primary mb-6" />,
      title: "Craft Your Resume",
      description:
        "Go to the Resume Editor. You can import information from your profile (Master Resume) and then customize it for specific job applications.",
      buttonLabel: "Open Resume Editor",
      buttonLink: "/resume/editor",
    },
  ];

  return (
    <Section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Build Your Resume in Simple Steps
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow these steps to create a standout resume and streamline your
            job application process.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <Link
              href={step.buttonLink}
              key={index}
              className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex-1 max-w-md"
            >
              <div className="flex flex-col items-center text-center">
                {" "}
                {step.icon}
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground mb-6 text-center">
                  {step.description}
                </p>
                <Button variant="default" size="lg">
                  {" "}
                  {step.buttonLabel}
                </Button>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-24 text-center">
          <p className="text-xl text-muted-foreground mb-6">
            Watch a quick demo (coming soon!)
          </p>
          <div className="relative bg-muted/50 aspect-video max-w-3xl mx-auto rounded-xl shadow-lg overflow-hidden flex items-center justify-center group">
            <PlayCircle
              size={96}
              className="text-primary/70 group-hover:text-primary transition-colors duration-300"
              strokeWidth={1}
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default HowItWorks;
