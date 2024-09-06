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
import React from "react";
import { UserIcon, LogOut } from "lucide-react";
import { logout } from "@/lib/supabase/actions/auth";
import { DropdownMenuAction } from "./dropdown-menu-action";
import useUser from "@/lib/supabase/hooks/useUser";

export default function UserMenu({
  side = "right",
  align = "end",
}: {
  side?: "left" | "right" | "bottom" | "top";
  align?: "start" | "end" | "center";
}) {
  const user = useUser();
  const title = user?.email ? user.email : "Anonymous";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary">
          <UserIcon size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="lg:w-[300px] sm:mx-5">
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
