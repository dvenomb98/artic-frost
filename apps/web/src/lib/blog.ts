import "server-only";

import {z} from "zod/v4";
import matter from "gray-matter";

import * as fs from "fs/promises";
import path from "path";

import {URLS} from "./urls";

const CWD = process.cwd();
const POSTS_DIR = path.join(CWD, "src/posts");
const YAML_SCHEMA = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
});

function generatePostHref(fileName: string) {
  return `${URLS.BLOG}/${fileName}`;
}

function parseYaml(fileContent: string, slug: string) {
  const matterResult = matter(fileContent);
  const yaml = YAML_SCHEMA.safeParse(matterResult.data);

  if (!yaml.success) {
    throw new Error(
      "Invalid YAML. Your md file does not have all the required fields. Please check YAML schema in models/schema.ts"
    );
  }

  return {
    data: {...yaml.data, href: generatePostHref(slug)},
    content: matterResult.content,
  };
}

const posts = {
  _readFile: async (fileName: string) => {
    const filePath = path.join(POSTS_DIR, `${fileName}.md`);
    let fileContent: string | null;
    try {
      fileContent = await fs.readFile(filePath, "utf-8");
    } catch (_) {
      return null;
    }

    return fileContent;
  },
  _getFiles: async () => {
    let files: string[] = [];
    try {
      files = await fs.readdir(POSTS_DIR);
      return files;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  getPostFiles: async () => {
    const files = await posts._getFiles();
    return files.map(file => ({
      name: file.replace(".md", ""),
      href: generatePostHref(file),
    }));
  },
  getPostBySlug: async (slug: string) => {
    const fileContent = await posts._readFile(slug);

    if (!fileContent) {
      return null;
    }

    return parseYaml(fileContent, slug);
  },
  getAllPosts: async (sortBy: "newest" | "oldest" = "newest") => {
    const files = await posts.getPostFiles();
    const data = await Promise.all(
      files.map(file => posts.getPostBySlug(file.name))
    );

    return data
      .filter(v => !!v)
      .sort((a, b) => {
        if (sortBy === "newest") {
          return b.data.date.getTime() - a.data.date.getTime();
        }

        return a.data.date.getTime() - b.data.date.getTime();
      });
  },
};

export {posts, YAML_SCHEMA};
