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

import { HomeIcon } from "lucide-react";

const NAVIGATION_ITEMS = [
  {
    href: "/",
    icon: HomeIcon,
    label: "Home",
  },
];

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2">
        <Link href="/" className="text-lg font-semibold text-foreground">
          db/chess ♟️
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarMenu>
            {NAVIGATION_ITEMS.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={false}>
                  <Link href={item.href}>
                    {item.icon && <item.icon />} {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export { AppSidebar };
