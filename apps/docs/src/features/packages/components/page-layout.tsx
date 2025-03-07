import {
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@artic-frost/ui/components";
import {HeaderLinks} from "./header-links";
import {AppSidebar} from "./sidebar";

export function PageLayout({
  children,
  activePackage,
}: {
  children: React.ReactNode;
  activePackage: string;
}) {
  return (
    <SidebarProvider>
      <AppSidebar activePackage={activePackage} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1">{null}</SidebarTrigger>
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <HeaderLinks />
        </header>
        <section className="p-5 md:p-10 max-w-screen-lg">{children}</section>
      </SidebarInset>
    </SidebarProvider>
  );
}
