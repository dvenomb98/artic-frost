import { Toc } from "../types/docs";
import { slugify } from "./strings";

const _findParent = (root: Toc[], currentLevel: number): Toc | undefined => {
  for (let i = root.length - 1; i >= 0; i--) {
    if (root[i]!.level < currentLevel) {
      return root[i];
    }
  }
  return undefined;
};

/***
  This currently work only for 2 depths
  TODO: Will fix it it further releases
  ***/
export const getTocs = (content: string): Toc[] | null => {
  if (!content) return null;

  const lines = content.split("\n");
  const root: Toc[] = [];

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s(.*)/);
    if (match) {
      const level = match[1]!.length;
      const contentTitle = match[2]!;
      const newToc: Toc = {
        level,
        title: contentTitle,
        href: slugify(contentTitle),
        childrens: [],
      };

      const parent = _findParent(root, level);
      if (parent) {
        parent.childrens.push(newToc);
      } else {
        root.push(newToc);
      }
    }
  });

  return root.filter(Boolean) as Toc[];
};
