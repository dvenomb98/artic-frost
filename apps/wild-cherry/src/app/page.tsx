import { AppSidebar } from "@/components/sidebar/sidebar";

import {
  SidebarTrigger,
  Separator,
  ThemeGlobalManager,
  SidebarInset,
} from "@artic-frost/ui/components";

export default function Home() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1">{null}</SidebarTrigger>
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <ThemeGlobalManager />
        </header>
        <section className="flex-1">Content</section>
      </SidebarInset>
    </>
  );
}
