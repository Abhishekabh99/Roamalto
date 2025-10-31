import type { MetadataRoute } from "next";

const baseUrl = "https://roamalto.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/packages",
    "/process",
    "/contact",
    "/privacy",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
