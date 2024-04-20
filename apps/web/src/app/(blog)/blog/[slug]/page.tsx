import PostLayout from "@/components/blog/post-layout";
import PostSidebar from "@/components/blog/post-sidebar";
import { getBlogPosts, getPrevNextPosts } from "@/lib/utils/mdx-utils";
import dayjs from "dayjs";
import { NextPage } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const PostBySlug: NextPage<{ params: { slug: string } }> = ({ params }) => {
  const posts = getBlogPosts();
  const post = posts.find(({ slug }) => slug === params.slug);

  if (!post || post.isEmpty) notFound();

  const prevNext = getPrevNextPosts(posts, params.slug);

  return (
    <section className="space-y-5 page-container">
      <p className="text-muted-foreground">
        {dayjs(post.metadata.date).format("dddd, MMMM D, YYYY")}
      </p>
      <div className="space-y-5">
        <h1 className="h2">{post.metadata.title}</h1>
        <h3 className="h4 text-muted-foreground">{post.metadata.summary}</h3>
      </div>
      <hr className="border" />

      <div className="grid grid-cols-3 sm:grid-cols-1 gap-10">
        <PostSidebar post={post} prevNext={prevNext} />
        <PostLayout post={post} />
      </div>
    </section>
  );
};

export default PostBySlug;
