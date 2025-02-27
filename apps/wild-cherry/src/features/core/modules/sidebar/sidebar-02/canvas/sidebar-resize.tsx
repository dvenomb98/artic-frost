"use client";

import { useCherryStore } from "@core/providers/store-provider";
import { debounce } from "@/lib/utils";

import {
  Input,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@artic-frost/ui/components";

import { useState, useCallback } from "react";

function Resize() {
  const { width, height, setSize } = useCherryStore(state => state);

  const [innerSize, setInnerSize] = useState({
    width: width,
    height: height,
  });

  const debouncedSetSize = useCallback(
    debounce((height: number, width: number) => {
      setSize(height, width); 
    }, 1000),
    []
  );

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const newSize = { ...innerSize, [name]: +value };

    setInnerSize(newSize);

    debouncedSetSize(newSize.height, newSize.width);
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resize (width | height)</SidebarGroupLabel>
      <SidebarGroupContent className="grid grid-cols-2 gap-2">
        <Input
          id="width"
          type="number"
          placeholder="Width"
          name="width"
          className="w-full"
          value={innerSize.width}
          onChange={onChange}
        />

        <Input
          id="height"
          type="number"
          placeholder="Height"
          name="height"
          className="w-full"
          value={innerSize.height}
          onChange={onChange}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { Resize };