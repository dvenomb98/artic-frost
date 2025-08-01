"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@artic-frost/ui/components";

import {MenuIcon} from "lucide-react";

import {UI_CONFIG} from "../const";
import {UiButton} from "../ui-button";

function Menu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UiButton>
          <MenuIcon className={UI_CONFIG.CLASSNAMES.ICON_SIZE} />
        </UiButton>
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
