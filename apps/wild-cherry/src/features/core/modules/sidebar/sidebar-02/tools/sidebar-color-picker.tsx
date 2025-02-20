"use client";

import { debounce } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  AdvancedColorPicker,
} from "@artic-frost/ui/components";

import { useCherryStore } from "@core/providers/store-provider";
import { useCallback } from "react";

function SidebarColorPicker() {
  const { line_color, setLineColor } = useCherryStore(s => s);

  const onChange = useCallback(
    debounce((value: string) => {
      setLineColor(value);
    }, 500),
    []
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Color</SidebarGroupLabel>
      <SidebarGroupContent>
        <AdvancedColorPicker color={line_color} onChange={onChange} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { SidebarColorPicker };
