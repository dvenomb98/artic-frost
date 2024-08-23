"use client";
import { SEARCH_PARAMS } from "@/utils/pages/definitions";
import { cn } from "@ui/lib/utils/cn";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useCallback, useRef } from "react";

const links = [
  { name: "Game history", value: "game-history" },
  { name: "Analytics", value: "analytics" },
];

export default function HpNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigationRef = useRef<HTMLDivElement>(null);

  const createQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(SEARCH_PARAMS.VIEW, value);
      return params.toString();
    },
    [searchParams]
  );

  const currentParam = searchParams.get(SEARCH_PARAMS.VIEW);

  return (
    <div
      className="flex gap-4 container"
      id="hp-navigation"
      ref={navigationRef}
    >
      {links.map((link, index) => {
        const active = currentParam ? link.value === currentParam : !index;
        return (
          <Link
            key={link.value}
            href={pathname + "?" + createQueryString(link.value)}
            className={cn(
              "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
              active
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
