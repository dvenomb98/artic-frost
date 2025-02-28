"use client";

import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@ui/components";
import { usePathname, useRouter } from "next/navigation";

import { getPackageFromPathname } from "../lib/utils";

export function PackageSwitcher({
  data,
}: {
  data: { packageName: string; defaultSlug: string }[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const currentPackage = getPackageFromPathname(pathname);

  const onSelect = (path: string) => router.push(path);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold first-letter:uppercase">
                  {currentPackage}
                </span>
                <span className="">documentation</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {data.map(pkg => (
              <DropdownMenuItem
                key={pkg.packageName}
                onSelect={() =>
                  onSelect(`/${pkg.packageName}/${pkg.defaultSlug}`)
                }
              >
                {pkg.packageName}{" "}
                {pkg.packageName === currentPackage && (
                  <Check className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
