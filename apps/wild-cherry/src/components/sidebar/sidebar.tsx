"use client";

import Link from "next/link";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@artic-frost/ui/components";


function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2">
        <Link href="/" className="text-base font-semibold text-foreground">
          wild-cherry 🍒
        </Link>
      </SidebarHeader>
      <SidebarContent>
        Test
      </SidebarContent>
    </Sidebar>
  );
}

export { AppSidebar };
