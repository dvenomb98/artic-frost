import {
  Button,
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

type ColorPopoverProps = {
  node: CoreNode;
  type: string;
  children: React.ReactNode;
};

function ColorPopover({node, type, children}: ColorPopoverProps) {
  const [open, setOpen] = useState(false);
  const {updateNode} = useCoreStore(state => state);
  const engine = useEngine();

  const propertyKey = type === "CHANGE_FILL" ? "fillStyle" : "strokeStyle";

  const handleColorSelect = (color: string) => {
    updateNode({
      ...node,
      properties: {
        ...node.properties,
        [propertyKey]: color,
      },
    });

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
            const isSelected = node.properties[propertyKey] === color;
            return (
              <Button
                key={color}
                onClick={() => handleColorSelect(color)}
                variant={isSelected ? "secondary" : "ghost"}
                size={UI_CONFIG.BUTTON_SIZE}
                title={`Set ${type} color to ${color}`}>
                <Circle
                  className={cn(
                    UI_CONFIG.CLASSNAMES.ICON_SIZE,
                    "rounded-full",
                    color === "transparent" &&
                      "outline outline-1 outline-foreground/50"
                  )}
                  style={{
                    fill: color,
                    stroke: color,
                  }}
                />
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export {ColorPopover};
