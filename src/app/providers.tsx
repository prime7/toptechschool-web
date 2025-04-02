"use client";

import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

interface Props {
  children?: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        themes={["light", "dark", "orange"]}
      >
        {children}
        <Toaster />
        {process.env.NODE_ENV === "production" && (
          <>
            <SpeedInsights />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!!} />
          </>
        )}
      </ThemeProvider>
    </SessionProvider>
  );
};
