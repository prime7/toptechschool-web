"use client";

import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ReactGA from "react-ga4";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "");
interface Props {
  children?: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  const pathname = usePathname();
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: pathname,
    });
  }, [pathname]);

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

        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </ThemeProvider>
    </SessionProvider>
  );
};
