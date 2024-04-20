import { Post, PrevNextPost } from "@/lib/types/posts";
import { FC } from "react";
import Tag from "./tag";
import Link from "next/link";
import { URLS } from "@/lib/const/urls";
import { Button } from "@ui/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PostSideBarProps {
  post: Post;
  prevNext: PrevNextPost;
}

const PostSidebar: FC<PostSideBarProps> = ({ post, prevNext }) => {
  return (
    <aside className="space-y-10 lg:col-span-1 sm:order-2 border p-5 h-fit rounded-md">
      <div>
        <p className="text-muted-foreground">Posted by:</p>
        <p>{post.metadata.author}</p>
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground">Tags:</p>
        <ul className="flex gap-2 flex-wrap">
          {post.metadata.tags.map((tag) => (
            <Tag name={tag} key={tag} />
          ))}
        </ul>
      </div>
      {!!prevNext.prev && (
        <div>
          <p className="text-muted-foreground">Previous post:</p>
          <Link href={`${URLS.BLOG}/${prevNext.prev.slug}`} className="link">
            {prevNext.prev.title}
          </Link>
        </div>
      )}
      {!!prevNext.next && (
        <div>
          <p className="text-muted-foreground">Next post:</p>
          <Link href={`${URLS.BLOG}/${prevNext.next.slug}`} className="link">
            {prevNext.next.title}
          </Link>
        </div>
      )}
      <Button variant="outline" asChild>
        <Link href={URLS.BLOG}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to blog
        </Link>
      </Button>
    </aside>
  );
};

export default PostSidebar;
