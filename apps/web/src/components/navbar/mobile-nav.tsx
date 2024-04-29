"use client";
import { Button } from "@repo/ui/components/button";
import Logo from "@/components/ui/logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { navigationLinks } from "@/lib/config/urls";
import { cn } from "@repo/ui/lib/utils/cn";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC } from "react";

export default function MobileNav () {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="sm">
          <MenuIcon className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="flex flex-col gap-10">
        <SheetHeader>
          <Logo />
        </SheetHeader>
        <ul className="flex flex-col gap-5">
          {navigationLinks.map((props) => (
            <SheetClose asChild key={props.href}>
              <Link
                href={props.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground transition-colors ease-in-out rounded-md",
                  pathname === props.href && "text-foreground"
                )}
              >
                {props.label}{" "}
              </Link>
            </SheetClose>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
};


