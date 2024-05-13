import { MdxFileInterface } from "@mdx-forge";

export interface Toc {
    level: number;
    title: string;
    href: string;
    childrens: Toc[];
  }

export type MdxFileWithoutContent = Omit<MdxFileInterface, "content">

export interface PrevNextMdx {
	prev: { title: string; slug: string } | null;
	next: { title: string; slug: string } | null;
}

export type TagStructure = { name: string; count: number };