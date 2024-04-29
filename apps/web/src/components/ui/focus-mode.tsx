"use client";
import { useEffect, useState } from "react";
import { Switch } from "@repo/ui/components/switch";
import { Label } from "@repo/ui/components/label";
import { cn } from "@ui/lib/utils/cn";

export interface FocusModeProps {
  mobile?: boolean;
  ids: string[];
  ctrlKey?: string
}

export default function FocusMode({ mobile, ids, ctrlKey }: FocusModeProps) {
  const [state, setState] = useState<boolean>(false);
  const pressKey = ctrlKey || "x"

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === pressKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setState((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useFocusMode(state, ids, mobile);

  return (
    <div className={cn("flex items-center gap-2", !mobile && "sm:hidden")}>
      <Switch checked={state} onCheckedChange={setState} id="focus-mode-trigger" />
      <Label htmlFor="focus-mode-trigger" className="inline-flex flex-col items-start text-xs">
        Focus mode
        <span className="text-muted-foreground">( ⌘ {pressKey} )</span>
      </Label>
    </div>
  );
}

function useFocusMode(trigger: boolean, ids: string[], mobile?: boolean) {
  useEffect(() => {
    const addedElements: { parent: HTMLElement; child: HTMLDivElement }[] = [];
    if (trigger) {
      ids.forEach((el) => {
        const comp = document.getElementById(el);
        if (!comp) return;
        const childEl = document.createElement("div");
        childEl.className = cn(
          "absolute h-auto w-full bg-background/90 inset-0 overflow-y-hidden z-10",
          !mobile && "sm-hidden"
        );
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
