import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@artic-frost/ui/components";

import {UI_CONFIG, COLOR_PALETTE} from "../const";
import {cn} from "@artic-frost/ui/lib";
import {useCoreStore} from "@core/store/provider";
import {CoreNode} from "@core/store/store";
import {useEngine} from "@core/engine/provider";
import {useState} from "react";
import {Circle} from "lucide-react";
import {UiButton} from "../ui-button";

type ColorPopoverProps = {
  nodes: CoreNode[];
  type: string;
  children: React.ReactNode;
};

function ColorPopover({nodes, type, children}: ColorPopoverProps) {
  const [open, setOpen] = useState(false);
  const updateNodes = useCoreStore(state => state.updateNodes);
  const engine = useEngine();

  const propertyKey = type === "CHANGE_FILL" ? "fillStyle" : "strokeStyle";

  const handleColorSelect = (color: string) => {
    const newNodes = nodes.map(node => ({
      ...node,
      properties: {
        ...node.properties,
        [propertyKey]: color,
      },
    }));

    updateNodes(newNodes);

    engine.getEngine().renderMainCanvas();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn(
          UI_CONFIG.CLASSNAMES.FLOATING_BACKGROUND,
          UI_CONFIG.CLASSNAMES.ITEM_PADDING,
          "w-auto"
        )}
        side="top"
        sideOffset={8}>
        <div
          className={cn(
            "grid grid-cols-7",
            UI_CONFIG.CLASSNAMES.GAP_BETWEEN_ITEMS
          )}>
          {COLOR_PALETTE.map(color => {
            let isSelected = false;

            if (nodes.length === 1) {
              isSelected = nodes[0]!.properties[propertyKey] === color;
            } else {
              isSelected = nodes.every(
                node => node.properties[propertyKey] === color
              );
            }

            return (
              <UiButton
                key={color}
                onClick={() => handleColorSelect(color)}
                variant={isSelected ? "secondary" : "ghost"}
                title={`Set ${type} color to ${color}`}>
                <Circle
                  className={cn(
                    UI_CONFIG.CLASSNAMES.ICON_SIZE,
                    "rounded-full",
                    color === "transparent" &&
                      "outline outline-foreground/50"
                  )}
                  style={{
                    fill: color,
                    stroke: color,
                  }}
                />
              </UiButton>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export {ColorPopover};
