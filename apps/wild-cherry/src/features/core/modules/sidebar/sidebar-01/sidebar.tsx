"use client";

import Link from "next/link";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@artic-frost/ui/components";

import {SidebarItems} from "./sidebar-items";
import {Suspense} from "react";
import {SidebarFooterMenu} from "./footer/sidebar-footer-menu";

function Sidebar01() {
  return (
    <Sidebar
      collapsible="none"
      className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
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
      <SidebarFooter>
        <SidebarFooterMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

export {Sidebar01};
