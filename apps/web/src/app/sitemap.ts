import { navigationLinks } from "@/lib/config/urls";
import { allDocsResolved } from "@/lib/utils/mdx-utils"
import dayjs from "dayjs";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 

  const generatedPages = allDocsResolved.map((doc) => ({
    url: `https://danielbilek.com/docs/${doc.fileName}`,
    lastModified: doc.last_modified,
  }));

  const staticPages = navigationLinks.map(link => (
    {
        url: `https://danielbilek.com${link.href}`,
        lastModified: dayjs().format("YYYY-MM-DD")
    }
  ))

  return [...generatedPages, ...staticPages]
}
