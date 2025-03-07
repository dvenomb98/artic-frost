import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@artic-frost/ui/components";

import {Suspense} from "react";

import {Sidebar01} from "./sidebar-01/sidebar";
import {Sidebar02} from "./sidebar-02/sidebar";

import {SidebarBar} from "./sidebar-bar";

function SidebarLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }>
      <Sidebar
        collapsible="icon"
        className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row">
        <Sidebar01 />
        <Suspense fallback={null}>
          <Sidebar02 />
        </Suspense>
      </Sidebar>
      <SidebarInset>
        <SidebarBar />
        <section className="flex-1 bg-muted">{children}</section>
      </SidebarInset>
    </SidebarProvider>
  );
}

export {SidebarLayout};
