"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@artic-frost/ui/components";

import {useSearchParams} from "next/navigation";

import {Tools} from "./tools";
import {Canvas} from "./canvas";

import {SB_QUERY_KEY} from "../query";
import {DATA, type SidebarDataValues} from "../data";
import {safeParseViewParam} from "../query";

const MAP_CONTENT_TO_VIEW: Record<SidebarDataValues, React.ReactNode> = {
  tools: <Tools />,
  canvas: <Canvas />,
};

function Sidebar02() {
  const searchParams = useSearchParams();
  const activeItem = safeParseViewParam(searchParams.get(SB_QUERY_KEY));

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4 h-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-base font-medium text-foreground">
            {DATA[activeItem].title}
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>{MAP_CONTENT_TO_VIEW[activeItem]}</SidebarContent>
    </Sidebar>
  );
}

export {Sidebar02};
