import { DocsNavbar } from "@/features/docs/components/DocsNavbar";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="py-10 md:py-20 tiny-container flex flex-col gap-10">
      <DocsNavbar />
      <section>
      {children}
      </section>
    </div>
  );
}
