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
import {SIDEBAR_MENU_ITEMS, SIDEBAR_WIDTH} from "./config";
import {NavUser} from "./components/nav-user";

function AppSidebar({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="h-16 flex items-center justify-center font-medium">
          db / chess
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {SIDEBAR_MENU_ITEMS.map(item => (
              <React.Suspense key={item.href}>
                <AppSidebarMenuItem {...item} />
              </React.Suspense>
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
            <SidebarTrigger className="-ml-1">{null}</SidebarTrigger>
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <ThemeGlobalManager />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export {AppSidebar};
