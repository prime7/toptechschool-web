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
import { UserAvatar } from "../avatars/UserAvatar";

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
    <section className="relative overflow-hidden bg-background py-8 md:py-10 lg:py-20">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          {/* Left Column */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Confidently Build Your Startup with Lean Principles
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Get instant access to our premium Notion template designed to
                help entrepreneurs build, measure, learn, and iterate faster.
              </p>
            </div>

            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                onClick={scrollToEmailCapture}
                size="lg"
                className="gap-1.5 group"
              >
                Get Free Access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              {/* <Button variant="outline" size="lg">
                Learn More
              </Button> */}
            </div>

            {/* User Count Section */}
            <div className="flex items-center space-x-4 text-sm">
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
              <div className="text-muted-foreground">
                <span className="font-medium">500+</span> entrepreneurs already
                using our template
              </div>
            </div>
          </div>

          {/* Right Column: Preview Card */}
          <div className="flex items-center justify-center">
            <Card className="w-full overflow-hidden border-none shadow-lg">
              <CardContent className="relative">
                <AspectRatio ratio={14 / 9} className="bg-muted">
                  <Image
                    src="/images/startup/notion-template-preview.png"
                    alt="Lean Startup Notion Template Preview"
                    fill
                    className="object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,..."
                  />
                </AspectRatio>

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20"></div>

                <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-background/90 p-4 backdrop-blur shadow-lg border">
                  <CardTitle className="text-sm font-medium">
                    Notion Template Preview
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
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
