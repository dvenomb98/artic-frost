"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Button,
} from "@artic-frost/ui/components";

import {MenuIcon} from "lucide-react";

import {UI_CONFIG} from "../const";

function Menu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={UI_CONFIG.BUTTON_SIZE}>
          <MenuIcon className={UI_CONFIG.CLASSNAMES.ICON_SIZE} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        sideOffset={4}>
        Hello from menu!
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export {Menu};
