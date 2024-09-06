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
  SheetTitle,
  SheetHeader,
  SheetDescription,
  SheetClose,
} from "@ui/components";
import Logo from "../ui/logo";
import { HistoryIcon, BarChartIcon, MenuIcon, HomeIcon } from "lucide-react";
import UserMenu from "../ui/user-menu";

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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background lg:flex">
      <nav className="flex flex-col items-center gap-4 px-2 lg:py-5">
        <Link href="/">
          <Logo width={40} height={40} />
          <span className="sr-only">Logo</span>
        </Link>
        <TooltipProvider>
          {navigationItems.map(item => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon">
                  <Link href={item.href}>
                    <item.icon className="w-6 h-6" />
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
        <ThemeGlobalManager
          align="start"
          side="right"
          buttonVariant={{ variant: "ghost" }}
        />
        <UserMenu side="right" align="end" />
      </nav>
    </aside>
  );
}

function MobileVersion() {
  return (
    <div
      id="navbar-root"
      className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm lg:hidden"
    >
      <div className="border-b">
        <nav className="container p-3 flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="space-y-4">
              <SheetHeader>
                <SheetTitle>
                  <Logo width={40} height={40} />
                </SheetTitle>
                <SheetDescription>
                  Modern chess. Endless variations. Simply played.
                </SheetDescription>
              </SheetHeader>
              <div className="flex items-center gap-4 flex-col">
                {[...navigationMobile, ...navigationItems].map(item => (
                  <SheetClose asChild>
                    <Button
                      asChild
                      key={item.href}
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
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-4">
            <ThemeGlobalManager />
            <UserMenu side="bottom" align="center" />
          </div>
        </nav>
      </div>
    </div>
  );
}
