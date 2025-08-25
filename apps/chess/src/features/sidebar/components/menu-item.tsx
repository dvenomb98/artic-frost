"use client";

import {SidebarMenuButton, SidebarMenuItem} from "@artic-frost/ui/components";
import Link from "next/link";
import {usePathname} from "next/navigation";

function AppSidebarMenuItem({
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
        <Link href={href} className="flex items-center gap-2 py-6">
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export {AppSidebarMenuItem};
