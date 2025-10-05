"use client";

import {SidebarMenuButton, SidebarMenuItem} from "@artic-frost/ui/components";
import Link from "next/link";
import {usePathname} from "next/navigation";
import * as React from "react";

type AppSidebarMenuItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

function AppSidebarMenuItem(props: AppSidebarMenuItemProps) {
  return (
    <React.Suspense>
      <AppSidebarMenuItemInner {...props} />
    </React.Suspense>
  );
}

function AppSidebarMenuItemInner({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={pathname === href}>
        <Link href={href} className="flex items-center gap-2 p-4">
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export {AppSidebarMenuItem};
