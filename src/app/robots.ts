import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/profile", "/dashboard", "/resume", "/resume/*", "/jobs"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_BASE_URL,
  };
}