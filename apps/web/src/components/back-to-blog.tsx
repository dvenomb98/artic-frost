import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {URLS} from "@/lib/urls";
import {cn} from "@artic-frost/ui/lib";

function BackToBlog({className}: {className?: string}) {
  return (
    <Link
      href={URLS.BLOG}
      className={cn(
        "flex items-center gap-2 text-muted-foreground",
        className
      )}>
      <ArrowLeft className="size-4" />
      Back to blog
    </Link>
  );
}

export {BackToBlog};
