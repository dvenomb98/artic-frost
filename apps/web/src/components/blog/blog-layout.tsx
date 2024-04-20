import { getAllUniqueTags, getBlogPosts } from "@/lib/utils/mdx-utils";
import React, { FC } from "react";
import PostCard from "./post-card";
import TagsBar from "./tag-bar";

interface BlogLayoutProps {
  title?: string;
  activeTag?: string;
}

const BlogLayout: FC<BlogLayoutProps> = ({ title, activeTag }) => {
  const posts = getBlogPosts();
  const filteredPosts = activeTag
    ? posts.filter(({ metadata: { tags } }) => tags?.includes(activeTag))
    : posts;
  const tags = getAllUniqueTags(posts);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-1 grid-rows-auto gap-10">
      <div className="space-y-10 col-span-2">
        <h3 className="h3 first-letter:uppercase">{title || "Recently published"}</h3>
        <div className="space-y-5">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} meta={post.metadata} slug={post.slug} />
          ))}
        </div>
      </div>
      <TagsBar tags={tags} activeTag={activeTag} />
    </div>
  );
};

export default BlogLayout;
