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
  const { strokeStyle, setProperty } = useCherryStore(s => s);

  const onChange = useCallback(
    debounce((value: string) => {
      setProperty("strokeStyle", value);
    }, 500),
    []
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Color</SidebarGroupLabel>
      <SidebarGroupContent>
        <AdvancedColorPicker color={strokeStyle.toString()} onChange={onChange} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { SidebarColorPicker };
