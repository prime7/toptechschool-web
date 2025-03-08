import { EmailCapture } from "./email-capture";
import { StartupHero } from "./hero";
import { LeanStartupPrinciples } from "./principles";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Lean Startup Notion Template | Toptechschool",
  description:
    "Access our free Lean Startup Notion template to validate your ideas faster and build successful products. Learn the principles of the Lean Startup methodology.",
  keywords: [
    "lean startup notion template",
    "toptechschool",
    "startup",
    "startup tools",
    "MVP",
    "lean startup principles",
  ],
  authors: [{ name: "Toptechschool", url: "https://toptechschool.com" }],
  creator: "Toptechschool",
  publisher: "Toptechschool",
  openGraph: {
    title: "Lean Startup Notion Template | Toptechschool",
    description:
      "Access our free Lean Startup Notion template to validate your ideas faster and build successful products. Learn the principles of the Lean Startup methodology.",
    url: "https://toptechschool.com/startup",
    siteName: "Toptechschool",
    images: [
      {
        url: "https://toptechschool.com/images/startup/notion-template-preview.png",
        width: 1200,
        height: 630,
        alt: "Lean Startup Notion Template | Toptechschool",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  alternates: {
    canonical: "https://toptechschool.com/startup",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export default function Startup() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <StartupHero />
      <LeanStartupPrinciples />
      <EmailCapture />
    </div>
  );
}
