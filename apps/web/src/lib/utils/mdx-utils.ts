import fs from "fs";
import path from "path";
import * as matter from "gray-matter";
import { MdxFile, MdxMetaData, PrevNextMdx} from "@/lib/types/docs";
import { categoryIndex } from "../config/docs";


export const dirPath = path.join(process.cwd(), "src", "content", "docs");

const _getMdxFiles = (dir: string) =>
  fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");

const _sortByCategory = (docs: MdxFile[]) => {
 return [...docs].sort((a,b) => {
  const orderA = categoryIndex[a.metadata.category] 
  const orderB = categoryIndex[b.metadata.category] 
  return orderA - orderB;
 })
}

export const getDocsFiles = async () => {
  const files = _getMdxFiles(dirPath);

  const docs = files.map((file) => {
    const parsedFile = matter.read(dirPath + `/${file}`);
    const slug = parsedFile.data.slug || file.split(".mdx")[0];
    const tags = parsedFile.data.tags || [];

    return {
      content: parsedFile.content,
      metadata: {
        tags,
        ...parsedFile.data,
      } as MdxMetaData,
      slug,
    } as unknown as MdxFile;
  });

  return _sortByCategory(docs);
};

export const getPrevNext = (posts: MdxFile[], slug: string): PrevNextMdx => {
  const postIndex = posts.findIndex((post) => post.slug === slug);

  const prev = posts[postIndex - 1] || null;
  const next = posts[postIndex + 1] || null;

  return {
    prev: prev ? { title: prev.metadata.as, slug: prev.slug } : null,
    next: next ? { title: next.metadata.as, slug: next.slug } : null,
  };
};

