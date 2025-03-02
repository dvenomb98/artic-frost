import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  Button,
} from "@artic-frost/ui/components";

import { Menu } from "lucide-react";
import { FileMenuContent } from "./file/components/content";

function SidebarFooterMenu() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                size="icon"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Menu />
                {isMobile ? "Menu" : null}
              </Button>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <FileMenuContent />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { SidebarFooterMenu };
