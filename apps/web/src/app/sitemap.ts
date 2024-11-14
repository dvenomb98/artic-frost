import { NAVIGATION_LINKS } from "@/lib/urls";
import dayjs from "dayjs";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = NAVIGATION_LINKS.map(link => ({
    url: `https://danielbilek.com${link.href}`,
    lastModified: dayjs().format("YYYY-MM-DD"),
  }));


  return staticPages
}
