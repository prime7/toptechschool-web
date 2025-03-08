"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { UserAvatar } from "../../../components/avatars/UserAvatar";

export const userImages = [
  { id: 1, src: "/images/startup/user1.png", alt: "U1" },
  { id: 2, src: "/images/startup/user2.png", alt: "U2" },
  { id: 3, src: "/images/startup/user3.png", alt: "U3" },
  { id: 4, src: "/images/startup/user4.png", alt: "U4" },
];

export function StartupHero() {
  const scrollToEmailCapture = () => {
    const element = document.getElementById("email-capture");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Confidently Build Your Startup with Lean Principles
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Get instant access to our premium Notion template designed to
                help entrepreneurs build, measure, learn, and iterate faster.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={scrollToEmailCapture}
                size="lg"
                className="gap-2"
              >
                Get Free Access
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            {/* User Count Section */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg w-fit">
              <div className="flex -space-x-2">
                {userImages.map((image) => (
                  <UserAvatar
                    key={image.id}
                    src={image.src}
                    alt={image.alt}
                    size={32}
                  />
                ))}
              </div>
              <div className="text-muted-foreground text-sm">
                <span className="font-medium">500+</span> entrepreneurs already
                using our template
              </div>
            </div>
          </div>

          {/* Right Column: Preview Card */}
          <div className="flex items-center justify-center">
            <Card className="w-full overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  <Image
                    src="/images/startup/notion-template-preview.png"
                    alt="Lean Startup Notion Template Preview"
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </AspectRatio>

                <div className="p-4 border-t">
                  <CardTitle className="text-sm font-medium">
                    Notion Template Preview
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Structured framework for implementing Lean Startup
                    principles
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
