"use client";
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@ui/lib";
import { mapCategoryToTitle } from "@/lib/utils/mdx-utils";
import Link from "next/link";
import { URLS } from "@/lib/config/urls";
import { MdxFileWithoutContent } from "@/lib/types/docs";
import { MdxFileCategory } from ".mdx-forge/types/mdx-file-interface";
import { allDocsResolved } from "@/lib/utils/mdx-utils";

interface DocsSidebarNavProps {
  items: MdxFileWithoutContent[];
  pathname: string | null;
  shouldForceClose?: () => void;
}

function DocsSidebarItems({ items, pathname, shouldForceClose }: DocsSidebarNavProps) {
  return (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item) => (
        <Link
          onClick={() => shouldForceClose?.()}
          key={item.fileName}
          href={`${URLS.DOCS}/${item.fileName}`}
          className={cn(
            "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
            `${URLS.DOCS}/${item.fileName}` === pathname
              ? "font-medium text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.as}
        </Link>
      ))}
    </div>
  );
}

export default function DocsSidebarNav({ shouldForceClose }: { shouldForceClose?: () => void }) {
  const pathname = usePathname();
  const registryMap = useMemo(() => {
    const map: Record<MdxFileCategory, MdxFileWithoutContent[]> = {
      intro: [],
      packages: [],
      guides: [],
      components: [],
    };
    allDocsResolved.forEach((item: MdxFileWithoutContent) => {
      map[item.category]?.push(item);
    });

    return map;
  }, [allDocsResolved]);

  return (
    <div id="docs-sidebar-root" className="w-full relative">
      {Object.entries(registryMap).map(
        ([key, value]) =>
          !!value.length && (
            <div key={key} className={cn("pb-4")}>
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium first-letter:uppercase">
                {mapCategoryToTitle[key as MdxFileCategory]}
              </h4>
              {value?.length && (
                <DocsSidebarItems
                  items={value}
                  pathname={pathname}
                  shouldForceClose={shouldForceClose}
                />
              )}
            </div>
          )
      )}
    </div>
  );
}
