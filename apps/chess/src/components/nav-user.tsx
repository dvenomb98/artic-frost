"use client";

import { use } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Skeleton,
  useSidebar,
} from "@ui/components";

import { UserIcon, LogOut, ChevronsUpDown } from "lucide-react";
import Link from "next/link";

import { logout } from "@/features/auth/form/actions";

import { DropdownMenuAction } from "./dropdown-menu-action";
import { ROUTES } from "@/lib/routes";
import { formatUserDisplayName } from "@/lib/formatters";

import { UserClientContext } from "@/features/auth/providers/user-client-provider";
import { cn } from "@ui/lib";

function NavUser() {
  const { user, profile, loading } = use(UserClientContext);
  console.log(profile, "profile");
  const { isMobile } = useSidebar();

  const title = loading ? (
    <Skeleton className="h-2.5 mt-1 w-20" />
  ) : (
    formatUserDisplayName(user?.id || "", profile)
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserIcon className="size-10" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-muted-foreground">
                  Logged in as
                </span>
                {title}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.MAIN.PROFILE}
                  className={cn(
                    "w-full h-full flex gap-2 items-center",
                    profile?.isAnonymous && "hidden"
                  )}
                >
                  <UserIcon size={16} />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuAction action={logout} icon={<LogOut size={16} />}>
                Logout
              </DropdownMenuAction>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { NavUser };
