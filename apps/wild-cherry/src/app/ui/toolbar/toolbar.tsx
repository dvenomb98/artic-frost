"use client";

import {ToggleGroup, ToggleGroupItem} from "@artic-frost/ui/components";
import {cn} from "@artic-frost/ui/lib";

import {UI_CONFIG} from "../const";

import {useCherryStore} from "@core/providers/store-provider";
import {TOOLS} from "@core/lib/tools";
import {UndoRedo} from "./options/undo-bar";

function Toolbar() {
  const {toolId, setToolId} = useCherryStore(state => state);

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        value={toolId}
        onValueChange={setToolId}
        type="single"
        size="sm"
        className={cn(
          "flex-col rounded-md",
          UI_CONFIG.FLOATING_BACKGROUND,
          UI_CONFIG.ITEM_PADDING,
          UI_CONFIG.GAP_BETWEEN_ITEMS
        )}>
        {Object.entries(TOOLS).map(([key, value]) => {
          return (
            <ToggleGroupItem key={key} value={value.id}>
              <value.icon className={UI_CONFIG.ICON_SIZE} />
              <span className="sr-only">{key}</span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      <UndoRedo />
    </div>
  );
}

export {Toolbar};
