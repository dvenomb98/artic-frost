"use client";

import Link from "next/link";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from "@artic-frost/ui/components";

import { SidebarItems } from "./sidebar-items";
import { Suspense } from "react";

function Sidebar01() {
  return (
    <Sidebar
      collapsible="none"
      className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
    >
      <SidebarHeader className="flex items-center justify-center h-12">
        <Link href="/" className="text-sm font-semibold text-foreground">
          🍒
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={null}>
          <SidebarItems />
        </Suspense>
      </SidebarContent>
    </Sidebar>
  );
}

export { Sidebar01 };
