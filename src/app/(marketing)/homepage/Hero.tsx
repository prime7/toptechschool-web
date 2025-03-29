import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/common/Section";

interface HeroProps {
  onJoinWaitlist: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinWaitlist }) => {
  return (
    <Section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🚀 Powered by Advanced AI Technology
          </div>
          <h1 className="text-6xl md:text-6xl font-bold tracking-tight mb-6">
            Land Your Dream Tech Job with
            <span className="text-primary relative">
              <span className="relative inline-block px-2">
                Confidence
                <svg className="absolute bottom-0 left-0 w-full h-2 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 Q 75 10, 100 5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </span>
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Leverage AI-powered insights, real-time job validation, and expert mentorship to accelerate your tech career journey. Join thousands of successful professionals who&apos;ve transformed their careers with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <Button 
              size="lg" 
              className="gap-2 font-semibold" 
              onClick={onJoinWaitlist}
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="font-semibold"
            >
              Watch Demo(WIP)
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};
