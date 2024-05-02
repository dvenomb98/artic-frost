"use client";
import React, { useMemo } from "react";
import docsRegistry from "../../../__registry__/docs-registry.json";
import { CategoryType, DocsRegistry, RegistryMap } from "@/lib/types/docs";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/lib/utils/cn";
import { mapCategoryToTitle } from "@/lib/config/docs";
import Link from "next/link";
import { URLS } from "@/lib/config/urls";

interface DocsSidebarNavProps {
  items: DocsRegistry[];
  pathname: string | null;
  shouldForceClose?: () => void;
}

function DocsSidebarItems({ items, pathname, shouldForceClose }: DocsSidebarNavProps) {
  return (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item) => (
        <Link
          onClick={() => shouldForceClose?.()}
          key={item.slug}
          href={`${URLS.DOCS}/${item.slug}`}
          className={cn(
            "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
            `${URLS.DOCS}/${item.slug}` === pathname
              ? "font-medium text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}

export default function DocsSidebarNav({
  shouldForceClose,
}: Pick<DocsSidebarNavProps, "shouldForceClose">) {
  const pathname = usePathname();
  const registryMap = useMemo(() => {
    const map: RegistryMap = {
      intro: [],
      guides: [],
      components: [],
    };
    const typed = docsRegistry as DocsRegistry[];
    typed.forEach((item: DocsRegistry) => {
      map[item.category].push(item);
    });

    return map;
  }, [docsRegistry]);

  return (
    <div id="docs-sidebar-root" className="w-full relative">
      {Object.entries(registryMap).map(([key, value]) => (
        <div key={key} className={cn("pb-4")}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium first-letter:uppercase">
            {mapCategoryToTitle[key as CategoryType]}
          </h4>
          {value?.length && (
            <DocsSidebarItems
              items={value}
              pathname={pathname}
              shouldForceClose={shouldForceClose}
            />
          )}
        </div>
      ))}
    </div>
  );
}
