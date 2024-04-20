export interface PostMetaData {
    title: string
    author: string
    date: string
    summary: string
    draft: boolean
    tags: string[]
}

export interface Post {
    metadata: PostMetaData
    slug: string
    content: string
    path: string
    isEmpty: boolean
}

export interface PrevNextPost {
	prev: { title: string; slug: string } | null;
	next: { title: string; slug: string } | null;
}

export type TagStructure = { name: string; count: number };