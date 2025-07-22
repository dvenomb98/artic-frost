"use client";
import {URLS} from "@/lib/urls";
import {usePathname} from "next/navigation";
import React from "react";

type Pathname = (typeof URLS)[keyof typeof URLS];

const MAP_PATHNAME_TO_TITLE: Record<Pathname, string> = {
  [URLS.BLOG]: "Blog",
  [URLS.PROJECTS]: "Projects",
  [URLS.HOMEPAGE]: "Daniel Bílek",
};

function NavbarTitle() {
  const pathname = usePathname();

  let title = MAP_PATHNAME_TO_TITLE[URLS.HOMEPAGE];

  for (const [path, value] of Object.entries(MAP_PATHNAME_TO_TITLE)) {
    if (pathname.startsWith(path)) {
      title = value;
      break;
    }
  }

  return <h1 className="text-xl font-semibold">{title}</h1>;
}

export {NavbarTitle};
