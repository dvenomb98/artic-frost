import { ScrollArea } from "@ui/components";
import { PropsWithChildren } from "react";

function MdxPageRootLayout({ children }: PropsWithChildren) {
  return (
    <div className="container flex-1 items-start lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      {children}
    </div>
  );
}

function MdxPageSidebarLayout({ children }: PropsWithChildren) {
  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 lg:sticky lg:block">
      <ScrollArea className="h-full py-6 pr-6 lg:py-8">{children}</ScrollArea>
    </aside>
  );
}

function MdxPageContentLayout({ children }: PropsWithChildren) {
  return (
    <section className="py-8 space-y-5 lg:gap-10 lg:grid lg:grid-cols-[1fr_200px]">
      {children}
    </section>
  );
}

function MdxPageAsideLayout({ children }: PropsWithChildren) {
  return (
    <aside className="hidden text-sm lg:block">
      <div className="sticky top-16 -mt-14 pt-4">
        <ScrollArea className="pb-10">
          <div className="h-[calc(100vh-3.5rem)] py-4">{children}</div>
        </ScrollArea>
      </div>
    </aside>
  );
}

export {
  MdxPageRootLayout,
  MdxPageSidebarLayout,
  MdxPageContentLayout,
  MdxPageAsideLayout,
};
