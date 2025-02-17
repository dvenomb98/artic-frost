import { AppSidebar } from "@/components/sidebar";
import { AlertBarWrapper } from "@chess/modules/alert-bar/alert-bar-wrapper";

import {
  Separator,
  SidebarInset,
  SidebarTrigger,
  ThemeGlobalManager,
} from "@artic-frost/ui/components";

import { MainProviders } from "./main-providers";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <MainProviders>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1">{null}</SidebarTrigger>
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <ThemeGlobalManager />
        </header>
        <AlertBarWrapper />
        <section className="flex-1">{children}</section>
      </SidebarInset>
    </MainProviders>
  );
}
