import { SidebarTrigger, Separator, ThemeGlobalManager } from "@artic-frost/ui/components";

function SidebarBar() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1">{null}</SidebarTrigger>
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
      <ThemeGlobalManager />
    </header>
  );
}

export { SidebarBar};
