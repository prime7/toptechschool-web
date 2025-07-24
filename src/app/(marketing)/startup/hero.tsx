"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { UserAvatar } from "@/components/avatars/UserAvatar";
import { Section } from "@/components/common/Section";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const userImages = [
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
    <Section>
      <div className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-8 py-1.5 px-4 bg-emerald-100/80 hover:bg-emerald-100/80 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm">
            <Rocket size={16} className="mr-2" />
            Free Lean Startup Template
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-8 leading-[1.1] tracking-tight"
          >
            Build Your Startup with
            <span className="text-primary relative">
              <span className="px-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
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
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto text-lg"
          >
            Get instant access to our premium Notion template designed to help entrepreneurs
            build, measure, learn, and iterate faster. Join hundreds of successful founders
            who&apos;ve validated their ideas with our template.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              onClick={scrollToEmailCapture}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg px-8 py-3 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full"
            >
              Get Free Template
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center justify-center gap-3 p-3 rounded-full mx-auto w-fit"
          >
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
            <div className="text-gray-600 dark:text-muted-foreground text-sm">
              <span className="font-medium">500+</span> entrepreneurs already
              using our template
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12"
          >
            <Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  <Image
                    src="/images/startup/notion-template-preview.png"
                    alt="Lean Startup Notion Template Preview"
                    fill
                    className="object-cover"
                    priority
                  />
                </AspectRatio>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
