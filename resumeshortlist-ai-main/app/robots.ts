import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://resumeshortlist.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: []
    },
    sitemap: `${base}/sitemap.xml`
  };
}
