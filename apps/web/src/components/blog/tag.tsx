import { URLS } from "@/lib/const/urls";
import { cn } from "@repo/ui/lib/utils/cn";
import Link from "next/link";
import React, { FC } from "react";

interface TagProps {
  name: string;
  count?: number;
  activeTag?: string;
}

const Tag: FC<TagProps> = ({ name, count, activeTag }) => {
  return (
    <li
      className={cn(
        "p-2 bg-secondary rounded-md w-fit first-letter:uppercase text-foreground text-sm hover:bg-secondary/80",
        activeTag === name && "font-bold"
      )}
    >
      <Link href={activeTag === name ? URLS.BLOG : `${URLS.TAGS}/${name}`} className="w-full">
        {name} {!!count && <span>({count})</span>}
      </Link>
    </li>
  );
};

export default Tag;
