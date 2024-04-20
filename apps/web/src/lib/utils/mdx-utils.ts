import fs from "fs";
import path from "path";
import * as matter from "gray-matter";
import { Post, PostMetaData, PrevNextPost, TagStructure } from "@/lib/types/posts"

const _dirPath = path.join(process.cwd(), "src", "lib", "data", "posts");

const _getMdxFiles = (dir: string) =>
  fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");

const _generateTagStructure = (tags: string[]): TagStructure[] => {
	return tags.reduce<TagStructure[]>((acc, tag) => {
		const found = acc.find((t) => t.name === tag);
		if (found) {
			found.count++;
		} else {
			acc.push({ name: tag, count: 1 });
		}
		return acc;
	}, []);
};

export const getBlogPosts = () => {
  const files = _getMdxFiles(_dirPath);

  const posts = files.map((file) => {
    const parsedFile = matter.read(_dirPath + `/${file}`);

    return {
      content: parsedFile.content,
      metadata: parsedFile.data as PostMetaData,
      slug: file.split(".mdx")[0],
    } as unknown as Post
  });

  return posts;
};

export const getPrevNextPosts = (posts: Post[], slug: string): PrevNextPost => {
	const postIndex = posts.findIndex((post) => post.slug === slug);

	const prev = posts[postIndex + 1] || null;
	const next = posts[postIndex - 1] || null;

	return {
		prev: prev ? { title: prev.metadata.title, slug: prev.slug } : null,
		next: next ? { title: next.metadata.author, slug: next.slug } : null,
	};
};

export const getAllUniqueTags =  (posts: Post[]) => {
	const tags = posts.flatMap((post) => post.metadata.tags) as string[];
	return _generateTagStructure(tags)
}


