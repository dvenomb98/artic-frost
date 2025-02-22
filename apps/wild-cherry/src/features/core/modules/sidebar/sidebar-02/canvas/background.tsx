"use client";

import { useCherryStore } from "@core/providers/store-provider";
import {
  AdvancedColorPicker,
  SidebarGroupContent,
  SidebarGroup,
  SidebarGroupLabel,
  Button,
} from "@artic-frost/ui/components";

import { useState } from "react";

function Background() {
  const { fillStyle, setBackground } = useCherryStore(s => s);
  const [innerBg, setInnerBg] = useState(fillStyle.toString());

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Change background color</SidebarGroupLabel>
      <SidebarGroupContent className="flex gap-2">
        <AdvancedColorPicker color={innerBg} onChange={setInnerBg} />
        <Button onClick={() =>  setBackground(innerBg)}>Change</Button>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { Background };
