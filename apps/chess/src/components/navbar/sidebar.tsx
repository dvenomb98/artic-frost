import Link from "next/link";
import React from "react";
import {
  ThemeGlobalManager,
} from "@ui/components";
import LogoutButton from "./logout-button";
import Logo from "../ui/logo";

export default function Sidebar() {
  return (
    <>
      <MobileVersion />
      <DesktopVersion />
    </>
  );
}

function MobileVersion() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background lg:flex ">
      <nav className="flex flex-col items-center gap-4 px-2 lg:py-5">
        <Link href="/">
          <Logo width={40} height={40} />
          <span className="sr-only">Logo</span>
        </Link>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
        <ThemeGlobalManager
          align="start"
          buttonVariant={{ variant: "ghost" }}
        />
        <LogoutButton />
      </nav>
    </aside>
  );
}

function DesktopVersion() {
  return (
    <div
      id="navbar-root"
      className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm lg:hidden"
    >
      <div className="border-b">
        <nav className="container p-3 flex items-center justify-between">
          <Logo width={40} height={40} />
          <div className="flex items-center gap-4">
            <ThemeGlobalManager />
            <LogoutButton props={{ variant: "outline" }} />
          </div>
        </nav>
      </div>
    </div>
  );
}
