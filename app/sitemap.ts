import { MetadataRoute } from "next";
import { ROLES } from "../lib/roles";
import { POSTS } from "../lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://resumeshortlist.app";

  const staticRoutes = [
    "",
    "/free-ats-resume-score",
    "/how-it-works",
    "/pricing",
    "/methodology",
    "/blog",
    "/privacy",
    "/terms",
    "/contact",
    "/app"
  ].map((p) => ({
    url: base + p,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7
  }));

  const roleRoutes = ROLES.flatMap((r) => [
    {
      url: `${base}/resume-examples/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6
    },
    {
      url: `${base}/ats-keywords/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }
  ]);

  const blogRoutes = POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.dateISO),
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));

  return [...staticRoutes, ...roleRoutes, ...blogRoutes];
}
