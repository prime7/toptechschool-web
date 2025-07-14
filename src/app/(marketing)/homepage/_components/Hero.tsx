import React from "react";
import { Button } from "@/components/ui/button";
import { MoveRight, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  onJoinWaitlist: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinWaitlist }) => {
  return (
    <div className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        <Badge className="mb-8 py-1.5 px-4 bg-emerald-100/80 hover:bg-emerald-100/80 text-emerald-700 text-sm">
          🚀 Powered by Advanced AI Technology
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
          Land Your Dream Tech Job with
          <span className="text-primary relative">
            <span className="relative inline-block px-2 text-emerald-700">
              Confidence
              <svg
                className="absolute bottom-0 left-0 w-full h-2 text-primary/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 25 0, 50 5 Q 75 10, 100 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
          </span>
        </h1>
        <p className="dark:text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
          Leverage AI-powered insights, real-time job validation, and expert
          mentorship to accelerate your tech career journey. Join thousands of
          successful professionals who&apos;ve transformed their careers with
          our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onJoinWaitlist}
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg px-8 py-3 h-auto shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Start Your Journey
            <MoveRight size={20} className="ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-3 h-auto transition-all duration-300 bg-transparent shadow-lg"
          >
            <Video size={20} className="mr-2" />
            Watch Demo (WIP)
          </Button>
        </div>
      </div>
    </div>
  );
};
