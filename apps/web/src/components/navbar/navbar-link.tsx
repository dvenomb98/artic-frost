"use client";

import {cn} from "@artic-frost/ui/lib";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";

function NavbarLink({href, label}: {href: string; label: string}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-muted-foreground transition-colors ease-in-out duration-300",
        isActive && "text-foreground"
      )}>
      {label}
    </Link>
  );
}

export {NavbarLink};
