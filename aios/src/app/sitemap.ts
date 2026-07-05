import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aios.dev";

  const routes = [
    "",
    "/dashboard",
    "/mission",
    "/learning",
    "/roadmap",
    "/projects",
    "/knowledge",
    "/research",
    "/revision",
    "/library",
    "/mentor",
    "/notes",
    "/github",
    "/analytics",
    "/achievements",
    "/calendar",
    "/terminal",
    "/settings",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "" || route === "/dashboard" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : route === "/dashboard" ? 0.9 : 0.7,
  }));
}
