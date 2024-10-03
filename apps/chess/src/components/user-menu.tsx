"use client";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components";
import React, { ComponentPropsWithoutRef } from "react";
import { UserIcon, LogOut } from "lucide-react";
import { logout } from "@/features/auth/api/actions";
import { DropdownMenuAction } from "./dropdown-menu-action";
import { useUser } from "@/features/auth/hooks/use-user"

export default function UserMenu({
  side = "right",
  align = "end",
}: {
  side?: ComponentPropsWithoutRef<typeof DropdownMenuContent>["side"];
  align?: ComponentPropsWithoutRef<typeof DropdownMenuContent>["align"];
}) {
  const { user } = useUser();
  const title = !!user?.email ? user.email : "Anonymous";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary" className="w-full gap-2">
          <UserIcon className="w-5 h-5" />
          <span className="lg:hidden">{title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="lg:w-[300px] mx-5">
        <DropdownMenuLabel className="flex items-center gap-2 py-4">
          <Badge variant="secondary" size="sm" className="w-fit">
            User
          </Badge>
          <span className="text-muted-foreground">{title}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuAction action={logout} icon={<LogOut size={16} />}>
          Logout
        </DropdownMenuAction>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
