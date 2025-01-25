"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@ui/components";

import { UserIcon, LogOut, ChevronsUpDown } from "lucide-react";

import { logout } from "@/features/auth/form/actions";
import { useUser } from "@/features/auth/hooks/use-user";

import { DropdownMenuAction } from "./dropdown-menu-action";

function NavUser() {
  const { user } = useUser();
  const { isMobile } = useSidebar();
  const title = !!user?.email ? user.email : "Anonymous";

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
                <span className="truncate text-muted-foreground">Logged in as</span>
                <span className="truncate font-medium text-xs">{title}</span>
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
