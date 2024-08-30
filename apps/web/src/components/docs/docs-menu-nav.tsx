"use client";
import React, { useState } from "react";
import { TextIcon } from "lucide-react";
import { Button, Sheet, SheetContent, SheetHeader, SheetTrigger  } from "@ui/components";
import DocsSidebarNav from "./docs-sidebar-nav";
import { usePathname } from "next/navigation";


export default function DocsMenuNav () {
  
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  if (!pathname.startsWith("/docs")) return null;

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild className="lg:hidden w-full border-b flex justify-start h-12">
        <Button variant="ghost" size="sm">
          <TextIcon className="w-4 h-4 mr-2" />
          <p>Menu</p>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-10 lg:hidden">
        <SheetHeader>Docs</SheetHeader>
        <DocsSidebarNav shouldForceClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};


