import {Metadata} from "next";
import {notFound} from "next/navigation";

import {posts} from "@/lib/blog";
import {Md} from "@artic-frost/markdown";
import dayjs from "dayjs";
import {BackToBlog} from "@/components/back-to-blog";

async function PostPage({params}: {params: Promise<{post: string}>}) {
  const {post} = await params;
  const data = await posts.getPostBySlug(post);

  if (!data) {
    return notFound();
  }

  return (
    <article>
      <div className="flex justify-between items-center">
        <BackToBlog />
        <p className="text-sm text-muted-foreground" aria-label="Date">
          {dayjs(data.data.date).format("DD.MM.YYYY")}
        </p>
      </div>
      <Md content={data.content} />
      <BackToBlog className="mt-4" />
    </article>
  );
}

async function generateMetadata({
  params,
}: {
  params: Promise<{post: string}>;
}): Promise<Metadata | null> {
  const {post} = await params;
  const data = await posts.getPostBySlug(post);

  if (!data) {
    return null;
  }

  return {
    title: data.data.title,
    description: data.data.description,
    authors: [{name: "Daniel Bílek", url: "https://danielbilek.com"}],
  };
}

async function generateStaticParams() {
  const files = await posts.getPostFiles();

  return files.map(file => ({
    post: file.name,
  }));
}

export {generateStaticParams, generateMetadata};
export default PostPage;
