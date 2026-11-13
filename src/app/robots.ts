import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/marca"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
