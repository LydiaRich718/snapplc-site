import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.snapplc.com", lastModified: new Date(), priority: 1.0 },
    { url: "https://www.snapplc.com/pricing", lastModified: new Date(), priority: 0.8 },
    { url: "https://www.snapplc.com/careers", lastModified: new Date(), priority: 0.6 },
    { url: "https://www.snapplc.com/status", lastModified: new Date(), priority: 0.4 },
  ];
}
