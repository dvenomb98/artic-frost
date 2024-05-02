export type CategoryType = "intro" | "guides" | "components"
export type RegistryMap = Record<CategoryType, DocsRegistry[]>;

export interface Toc {
    level: number;
    title: string;
    href: string;
    childrens: Toc[];
  }

export interface DocsRegistry {
    category: CategoryType
    title: string
    slug: string
}

export interface MdxMetaData {
    title: string
    author: string
    released: string
    last_modified: string
    summary: string
    draft: boolean
    tags: string[]
    category: CategoryType
    as: string
}

export interface MdxFile {
    metadata: MdxMetaData
    slug: string
    content: string
    path: string
    isEmpty: boolean,
    prevNext: PrevNextMdx
}

export interface PrevNextMdx {
	prev: { title: string; slug: string } | null;
	next: { title: string; slug: string } | null;
}

export type TagStructure = { name: string; count: number };