"use client";
import { Toc } from "@/lib/types/docs";
import { cn } from "@ui/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

interface MdxTreeProps {
  tocs: Toc[];
}

const linkClass = "text-muted-foreground hover:text-primary transition ease-in-out";

export default function MdxTree ({tocs}: MdxTreeProps) {
  const pathname = usePathname();

  const itemsIds = useMemo(() => {
    return tocs.length
      ? tocs.flatMap((item) => [item.href, item?.childrens?.map((item) => item.href)]).flat()
      : [];
  }, [tocs]);

  const active = useActiveItem(itemsIds);

  return (
    <aside id="docs-tree-root" className="flex flex-col space-y-3 text-sm">
      <p className="font-medium">On this page</p>
      {tocs.map((toc) => (
        <div key={toc.href + toc.title} className="flex flex-col space-y-3">
          <Link
            key={toc.href}
            href={{
              pathname,
              hash: toc.href,
            }}
            className={cn(linkClass, active === toc.href && "text-primary")}
          >
            {toc.title}
          </Link>

          {!!toc.childrens.length &&
            toc.childrens.map((child) => (
              <Link
                key={child.href + child.title}
                href={{
                  pathname,
                  hash: child.href,
                }}
                className={cn(linkClass, active === child.href && "text-primary", "pl-3")}
              >
                {child.title}
              </Link>
            ))}
        </div>
      ))}
    </aside>
  );
};

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}


