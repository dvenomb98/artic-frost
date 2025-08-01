import {Metadata} from "next";
import {posts} from "@/lib/blog";
import Link from "next/link";
import dayjs from "dayjs";

const metadata: Metadata = {
  title: "Blog",
};

async function BlogHomePage() {
  const data = await posts.getAllPosts();

  if (!data.length) {
    return (
      <p className="text-center text-muted-foreground">No posts created yet.</p>
    );
  }

  return (
    <section className="flex flex-col gap-4 divide-y first:[&>a]:pt-0 [&>a]:pt-4">
      {data.map(post => {
        if (!post) {
          return null;
        }

        const {title, href, date} = post.data;

        return (
          <Link
            key={title}
            href={href}
            className="flex justify-between items-start">
            <p>{title}</p>
            <p className="text-sm text-muted-foreground">
              {dayjs(date).format("DD.MM.YYYY")}
            </p>
          </Link>
        );
      })}
    </section>
  );
}

export {metadata};
export default BlogHomePage;
