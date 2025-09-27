"use client";

import {ROUTES} from "@/lib/routes";
import {useUserStore} from "@/services/supabase/user/provider";
import {
  Avatar,
  AvatarFallback,
  // AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@artic-frost/ui/components";

import {UserIcon, LogOutIcon} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";

function NavUser() {
  const router = useRouter();
  const {isMobile} = useSidebar();

  const {logout} = useUserStore(state => ({
    logout: state.logout,
  }));

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <NavUserUserBadge />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <NavUserUserBadge />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.APP.ACCOUNT}>
                  <UserIcon />
                  Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export {NavUser};

function NavUserUserBadge() {
  const {user, profile} = useUserStore(state => ({
    user: state.user,
    profile: state.profile,
  }));

  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="h-8 w-8 rounded-lg grayscale">
        {/* <AvatarImage  src={user.avatar} alt={user.name} /> */}
        <AvatarFallback className="rounded-lg">A</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{profile.nickname}</span>
        {!!user.email && (
          <span className="text-muted-foreground truncate text-xs">
            {user.email}
          </span>
        )}
      </div>
    </div>
  );
}
