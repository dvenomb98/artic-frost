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
  SidebarFooter,
} from "@ui/components";
import { HistoryIcon, BarChartIcon } from "lucide-react";
import { NavUser } from "./nav-user";

const navigationItems = [
  {
    href: "/history",
    icon: HistoryIcon,
    label: "History",
  },
  {
    href: "/analytics",
    icon: BarChartIcon,
    label: "Analytics",
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
            {navigationItems.map(item => (
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
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

export { AppSidebar };
