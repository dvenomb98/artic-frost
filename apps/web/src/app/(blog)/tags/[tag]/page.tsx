import BlogLayout from "@/components/blog/blog-layout";
import { getBlogPosts } from "@/lib/utils/mdx-utils";
import { NextPage } from "next";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  const tags = posts.flatMap((post) => post.metadata.tags);
  const unique = [...new Set(tags)];
  return unique;
}

const BlogTags: NextPage<{ params: { tag: string } }> = async ({ params }) => {
  return (
    <div className="page-container">
      <BlogLayout activeTag={params.tag} title={params.tag} />
    </div>
  );
};

export default BlogTags;
