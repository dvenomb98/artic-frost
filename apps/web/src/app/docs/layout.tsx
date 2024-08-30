import DocsSidebarNav from "@/components/docs/docs-sidebar-nav";
import { ScrollArea } from "@ui/components";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="container flex-1 items-start lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 lg:sticky lg:block">
        <ScrollArea className="h-full py-6 pr-6 lg:py-8">
          <DocsSidebarNav/>
        </ScrollArea>
      </aside>
      {children}
    </div>
  );
}
