import { ThemeGlobalManager } from "@ui/components";
import Link from "next/link";
import React from "react";
import { ArrowLeftIcon } from "lucide-react";

function DocsNavbar() {
  return (
    <nav className="space-y-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-muted-foreground text-sm hover:underline w-fit"
      >
      <ArrowLeftIcon className="size-3" /> Online chess
      </Link>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">chess-lite</h1>
          <p className="text-muted-foreground">
            A minimal and modern typescript chess library for building chess applications.
          </p>
        </div>
        <ThemeGlobalManager buttonVariant="ghost" />
      </div>
    </nav>
  );
}

export { DocsNavbar };
