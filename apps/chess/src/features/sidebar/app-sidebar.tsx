import {ROUTES} from "@/lib/routes";
import {
  Separator,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
  ThemeGlobalManager,
} from "@artic-frost/ui/components";

import * as React from "react";
import {AppSidebarMenuItem} from "./components/menu-item";

import {PlayIcon} from "lucide-react";

const SIDEBAR_MENU_ITEMS = [
  {
    label: "Play",
    href: ROUTES.APP.INDEX,
    icon: <PlayIcon className="size-6" />,
  },
];

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
