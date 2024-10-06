"use client";

import Link from "next/link";
import React from "react";
import {
  Button,
  ThemeGlobalManager,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetClose,
  SheetFooter,
  buttonVariants,
} from "@ui/components";
import {
  HistoryIcon,
  BarChartIcon,
  MenuIcon,
  HomeIcon,
  BookOpenIcon,
} from "lucide-react";
import UserMenu from "./user-menu";

const navigationMobile = [
  {
    href: "/",
    icon: HomeIcon,
    label: "Home",
  },
];

const navigationItems = [
  {
    href: "/history",
    icon: HistoryIcon,
    label: "History",
  },
  {
    href: "/analytics",
    icon: BarChartIcon,
    label: "Analytics",
  },
  {
    href: "/docs/chess-lite",
    icon: BookOpenIcon,
    label: "Developer docs",
  },
];

export default function Sidebar() {
  return (
    <>
      <MobileVersion />
      <DesktopVersion />
    </>
  );
}

function DesktopVersion() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r lg:flex bg-card text-card-foreground">
      <nav className="flex flex-col items-center gap-4 px-2 lg:py-5">
        <TooltipProvider>
          {navigationItems.map(item => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon">
                  <Link href={item.href}>
                    <item.icon className="w-5 h-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="px-4 py-1">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
        <ThemeGlobalManager align="start" side="right" buttonVariant="ghost" />
        <UserMenu side="right" align="end" />
      </nav>
    </aside>
  );
}

function MobileVersion() {
  return (
    <div className="sticky top-0 z-40 backdrop-blur-sm lg:hidden bg-card/90 text-card-foreground">
      <div className="border-b">
        <nav className="container p-3 flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex flex-col h-full bg-card text-card-foreground"
            >
              <SheetHeader>
                <SheetDescription>
                  Modern chess. Endless variations. Simply played.
                </SheetDescription>
              </SheetHeader>
              <div className="flex items-center gap-4 flex-col">
                {[...navigationMobile, ...navigationItems].map(item => (
                  <SheetClose asChild key={item.href}>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start flex gap-2"
                    >
                      <Link href={item.href}>
                        <item.icon className="w-6 h-6" />
                        {item.label}
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    </Button>
                  </SheetClose>
                ))}
              </div>
              <SheetFooter className="mt-auto justify-start">
                <UserMenu side="top" align="start" />
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-4">
            <ThemeGlobalManager buttonVariant="ghost" />
          </div>
        </nav>
      </div>
    </div>
  );
}
