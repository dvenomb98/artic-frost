import { useMDXComponents } from "@/lib/hooks/useMdxComponents";
import { Post } from "@/lib/types/posts";
import React, { FC } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PostLayoutProps {
  post: Post;
}

const PostLayout: FC<PostLayoutProps> = ({ post }) => {
  const MDXContent = useMDXComponents();

  return (
    <div className="space-y-5 w-full lg:col-span-2">
      <MDXRemote source={post.content} components={MDXContent} />
    </div>
  );
};

export default PostLayout;
