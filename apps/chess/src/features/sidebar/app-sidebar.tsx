import {
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
  ThemeGlobalManager,
} from "@artic-frost/ui/components";

import * as React from "react";
import {AppSidebarMenuItem} from "./components/menu-item";
import {SIDEBAR_MENU_ITEMS} from "./config";
import {NavUser} from "./components/nav-user";
import Link from "next/link";
import {ROUTES} from "@/lib/routes";
import {UI_CONFIG} from "@/lib/ui-config";

function AppSidebar({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="h-16 flex items-center justify-center font-medium">
          <Link href={ROUTES.APP.INDEX}>
            <p className="text-lg font-semibold text-foreground">db/chess ♟️</p>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {SIDEBAR_MENU_ITEMS.map(item => (
              <AppSidebarMenuItem key={item.href} {...item} />
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger
              variant={UI_CONFIG.BUTTON.VARIANT}
              size={UI_CONFIG.BUTTON.SIZE}
              className="-ml-1">
              {null}
            </SidebarTrigger>
          </div>
          <ThemeGlobalManager
            buttonVariant={UI_CONFIG.BUTTON.VARIANT}
            buttonSize={UI_CONFIG.BUTTON.SIZE}
          />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export {AppSidebar};
