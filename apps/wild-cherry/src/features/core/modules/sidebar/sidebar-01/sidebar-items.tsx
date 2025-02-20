"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from "@artic-frost/ui/components";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { SB_QUERY_KEY, safeParseViewParam } from "../query";
import { DATA } from "../data";

function SidebarItems() {
  const searchParams = useSearchParams();
  const activeItem = safeParseViewParam(searchParams.get(SB_QUERY_KEY));

  return (
    <SidebarGroup>
      <SidebarGroupContent className="px-1.5 md:px-0">
        <SidebarMenu>
          {Object.entries(DATA).map(([key, item]) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={{
                  children: item.title,
                  hidden: false,
                }}
                isActive={activeItem === key}
                className="px-2.5 md:px-2"
              >
                <Link
                  href={{ href: "/", query: { [SB_QUERY_KEY]: key } }}
                  shallow
                  replace
                >
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { SidebarItems };
