import {MetadataRoute} from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `https://danielbilek.com/sitemap.xml`,
    host: "https://danielbilek.com",
  };
}
