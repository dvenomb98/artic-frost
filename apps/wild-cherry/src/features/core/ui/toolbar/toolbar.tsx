"use client";

import {ToggleGroup, ToggleGroupItem} from "@artic-frost/ui/components";
import {cn} from "@artic-frost/ui/lib";

import {UI_CONFIG} from "../const";

import {useCoreStore} from "../../store/provider";
import {TOOLS} from "../const";

function Toolbar() {
  const {tool, setTool} = useCoreStore(state => ({
    tool: state.tool,
    setTool: state.setTool,
  }));

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        value={tool}
        onValueChange={setTool}
        type="single"
        size={UI_CONFIG.TOOLBAR_BUTTON_SIZE}>
        <div
          className={cn(
            "rounded-md",
            UI_CONFIG.CLASSNAMES.FLOATING_BACKGROUND,
            UI_CONFIG.CLASSNAMES.ITEM_PADDING,
            UI_CONFIG.CLASSNAMES.GAP_BETWEEN_ITEMS
          )}>
          {Object.entries(TOOLS).map(([key, value]) => {
            return (
              <ToggleGroupItem key={key} value={key}>
                <value.icon className={UI_CONFIG.CLASSNAMES.ICON_SIZE} />
                <span className="sr-only">{key}</span>
              </ToggleGroupItem>
            );
          })}
        </div>
      </ToggleGroup>
    </div>
  );
}

export {Toolbar};
