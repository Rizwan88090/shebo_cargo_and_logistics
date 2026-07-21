import { MetadataRoute } from "next";
import { services } from "@/data/services";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Base pages
  const routes = [
    "",
    "/about",
    "/services",
    "/order",
    "/tracking",
    "/countries",
    "/corporate",
    "/gallery",
    "/reviews",
    "/faq",
    "/blog",
    "/careers",
    "/support",
    "/contact",
    "/request-quote",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/order" ? 0.9 : 0.8,
  }));

  // Dynamic service details pages
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...serviceRoutes];
}
