"use client";

import { debounce } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  AdvancedColorPicker,
} from "@artic-frost/ui/components";

import { useCherryStore } from "@core/providers/store-provider";
import { useCallback } from "react";

function SidebarColorPicker() {
  const {
    properties: { strokeStyle, fillStyle },
    setProperty,
  } = useCherryStore(s => s);

  const onChange = useCallback(
    debounce((value: string, type: "strokeStyle" | "fillStyle") => {
      setProperty(type, value);
    }, 500),
    []
  );

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex items-center gap-2">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Stroke</p>
          <AdvancedColorPicker
            color={strokeStyle.toString()}
            onChange={c => onChange(c, "strokeStyle")}
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Fill</p>
          <AdvancedColorPicker
            color={fillStyle.toString()}
            onChange={c => onChange(c, "fillStyle")}
          />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { SidebarColorPicker };
