import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onJoinWaitlist: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinWaitlist }) => {
  return (
    <div className="relative overflow-hidden py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Accelerate Your{" "}
              <span className="text-primary">Tech Career</span> With AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Personalized career guidance, resume optimization, and interview
              preparation powered by artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={onJoinWaitlist}>
                Join Waitlist <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-background bg-muted"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">500+</span> tech
                professionals already joined
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-background/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-border">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Demo video placeholder
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 top-8 left-8 right-8 bottom-8 bg-primary/20 rounded-xl blur-xl"></div>
          </div>
        </div>
      </div>
      <div className="absolute -z-10 top-0 left-0 right-0 h-full bg-grid-white/10 bg-[size:30px_30px] opacity-20"></div>
    </div>
  );
};
