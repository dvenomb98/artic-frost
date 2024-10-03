"use client";
import { usePathname } from "next/navigation";
import React from "react";

const mapPathnameToTitle = {
  "/projects": "Projects",
  "/": "Daniel Bílek",
};

function NavbarTitle() {
  const pathname = usePathname();
  const title =
    mapPathnameToTitle[pathname as keyof typeof mapPathnameToTitle] ??
    "Daniel Bílek";

  return <h1 className="text-xl font-semibold">{title}</h1>;
}

export { NavbarTitle };
