import {
  SidebarInset,
  SidebarProvider,
} from "@artic-frost/ui/components";

import { SIDEBAR_WIDTH } from "./config";
import { CherrySidebar } from "./sidebar";
import { SidebarBar } from "./sidebar-bar";


function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider sidebarWidth={SIDEBAR_WIDTH}>
      <CherrySidebar />
      <SidebarInset>
        <SidebarBar/> 
        <section className="flex-1">{children}</section>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { SidebarLayout };
