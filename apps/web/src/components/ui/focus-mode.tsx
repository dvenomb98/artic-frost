"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "@repo/ui/components/switch";
import { Label } from "@repo/ui/components/label";
import { cn } from "@ui/lib/utils/cn";

const FocusMode = ({mobile}: {mobile?: boolean}) => {
  const [state, setState] = useState<boolean>(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "x" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setState((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useFocusMode(state, mobile);

  return (
    <div className={cn("flex items-center gap-2", !mobile && "sm:hidden")}>
      <Switch checked={state} onCheckedChange={setState} id="focus-mode-trigger" />
      <Label htmlFor="focus-mode-trigger" className="inline-flex flex-col items-start text-xs">
        Focus mode
        <span className="text-muted-foreground">( ⌘ x )</span>
      </Label>
    </div>
  );
};

const overlayIds = ["docs-sidebar-root", "docs-tree-root", "navbar-root", "footer-root"];

function useFocusMode(trigger: boolean, mobile?: boolean) {
  useEffect(() => {
    const addedElements: { parent: HTMLElement; child: HTMLDivElement }[] = [];
    if (trigger) {
      overlayIds.forEach((el) => {
        const comp = document.getElementById(el);
        if (!comp) return;
        const childEl = document.createElement("div");
        childEl.className =
          cn("absolute h-auto w-full bg-background/90 inset-0 overflow-y-hidden z-10", !mobile && "sm-hidden");
        comp.appendChild(childEl);
        addedElements.push({ parent: comp, child: childEl });
      });
    }
    return () => {
      addedElements.forEach(({ parent, child }) => {
        parent.removeChild(child);
      });
    };
  }, [trigger]);
}

export default FocusMode;
