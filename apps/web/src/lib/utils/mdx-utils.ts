import { MdxFileCategory } from ".mdx-forge/types/mdx-file-interface";
import { MdxFileWithoutContent, PrevNextMdx } from "@/lib/types/docs";
import allDocs from "@mdx-forge";

export const docsCategoryOrder: Record<MdxFileCategory, number> = {
  intro: 0,
  packages: 1,
  guides: 2,
  components: 3,
};

export const mapCategoryToTitle: Record<MdxFileCategory, string> = {
  intro: "Getting started",
  packages: "Packages",
  guides: "Guides",
  components: "Components",
};

export function sortByCategory(docs: MdxFileWithoutContent[]) {
  return [...docs].sort((a, b) => {
    const orderA = docsCategoryOrder[a.category];
    const orderB = docsCategoryOrder[b.category];
    return orderA - orderB;
  });
}

export function getPrevNext(docs: MdxFileWithoutContent[], fileName: string): PrevNextMdx {
  const newDocs = sortByCategory(docs);
  const postIndex = newDocs.findIndex((post) => post.fileName === fileName);
  const prev = docs[postIndex - 1] || null;
  const next = docs[postIndex + 1] || null;

  return {
    prev: prev ? { title: prev.as, slug: prev.fileName } : null,
    next: next ? { title: next.as, slug: next.fileName } : null,
  };
}

export const allDocsResolved = sortByCategory((allDocs as MdxFileWithoutContent[]).filter(value => !value.draft))



