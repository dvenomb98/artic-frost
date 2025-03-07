import {getStaticFilesData} from "@/features/packages/lib/generators";
import {MetadataRoute} from "next";
import dayjs from "dayjs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const packages = (await getStaticFilesData()).map(file => ({
    url: `https://docs.danielbilek.com/${file.packageName}/${file.slug}`,
    lastModified: dayjs().format("YYYY-MM-DD"),
  }));

  return packages;
}
