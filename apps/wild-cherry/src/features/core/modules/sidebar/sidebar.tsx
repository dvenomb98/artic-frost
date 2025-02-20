"use client";

import Link from "next/link";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from "@artic-frost/ui/components";

import { SIDEBAR_WIDTH_MOBILE } from "./config";

import { SidebarTools } from "./sidebar-tools";

function CherrySidebar() {
  return (
    <Sidebar sidebarWidthMobile={SIDEBAR_WIDTH_MOBILE}>
      <SidebarHeader className="flex items-center justify-center h-12">
        <Link href="/" className="text-sm font-semibold text-foreground">
          wild🍒cherry
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarTools />
      </SidebarContent>
    </Sidebar>
  );
}

export { CherrySidebar };
