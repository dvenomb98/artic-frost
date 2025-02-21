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
  const { stroke_style, setStrokeStyle } = useCherryStore(s => s);

  const onChange = useCallback(
    debounce((value: string) => {
      setStrokeStyle(value);
    }, 500),
    []
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Color</SidebarGroupLabel>
      <SidebarGroupContent>
        <AdvancedColorPicker color={stroke_style} onChange={onChange} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { SidebarColorPicker };
