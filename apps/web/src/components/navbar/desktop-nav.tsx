"use client";

import { navigationLinks } from "@/lib/config/urls";
import { cn } from "@repo/ui/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC } from "react";

const DesktopNav: FC = () => {
  const pathname = usePathname();
  return (
    <ul className="flex gap-5 sm:hidden">
      {navigationLinks.map((props) => (
        <li key={props.href}>
          <Link
            href={props.href}
            className={cn(pathname === props.href ? "text-primary text-sm" : "text-sm", "link")}
          >
            {props.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DesktopNav;