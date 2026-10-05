import type { MetadataRoute } from "next";

/**
 * Single-route sitemap — the whole pitch lives on /.
 * Canonical URL honors NEXT_PUBLIC_SITE_URL at deploy time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
