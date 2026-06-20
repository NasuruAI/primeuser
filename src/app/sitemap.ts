import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/seo";

// Refresh the sitemap hourly so new products surface to crawlers quickly.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProducts({}).catch(() => ({ results: [] })),
    getCategories().catch(() => []),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE_URL}/catalog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/catalog?category=${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.results.map((p) => ({
    url: `${SITE_URL}/p/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
