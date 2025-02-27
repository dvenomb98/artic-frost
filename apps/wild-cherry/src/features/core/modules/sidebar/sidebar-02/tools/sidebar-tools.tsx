import { ExtractedLineCap, TOOLS } from "@core/lib/tools";
import { useCherryStore } from "@core/providers/store-provider";

import { Dot, Square } from "lucide-react";

import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Button,
  SidebarGroupLabel,
  SidebarGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@artic-frost/ui/components";
import { useState } from "react";
import { cn } from "@artic-frost/ui/lib";

const TOOLS_MENU_COMPONENT_MAP = {
  [TOOLS.PAINT_BRUSH.id]: PaintBrushMenu,
  [TOOLS.STRAIGHT_LINE.id]: StraightLineMenu,
  [TOOLS.PAINT_BUCKET.id]: null,
  [TOOLS.FREE_HAND.id]: null,
};

function SidebarTools() {
  const { toolId, setToolId } = useCherryStore(state => state);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Painting</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="grid grid-cols-3">
          {Object.entries(TOOLS).map(([key, value]) => {
            const isSelected = toolId === value.id;
            const Menu = TOOLS_MENU_COMPONENT_MAP[value.id];

            return (
              <SidebarMenuItem key={key}>
                {Menu && (
                  <Popover
                    open={open === value.id}
                    onOpenChange={open => setOpen(open ? value.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Button
                          variant={isSelected ? "secondary" : "ghost"}
                          className="w-full h-full"
                          onClick={() => setToolId(value.id)}
                        >
                          <value.icon className="w-5" />
                          <span className="sr-only">{key}</span>
                        </Button>
                      </SidebarMenuButton>
                    </PopoverTrigger>
                    <Menu handleOpenChange={() => setOpen(null)} />
                  </Popover>
                )}
                {!Menu && (
                  <SidebarMenuButton asChild>
                    <Button
                      variant={isSelected ? "secondary" : "ghost"}
                      className="w-full h-full"
                      onClick={() => setToolId(value.id)}
                    >
                      <value.icon className="w-5" />
                      <span className="sr-only">{key}</span>
                    </Button>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { SidebarTools };

type MenuProps = {
  handleOpenChange: () => void;
};

function PaintBrushMenu({ handleOpenChange }: MenuProps) {
  const { setProperty, lineWidth, lineCap } = useCherryStore(state => state);

  const ICONS = {
    round: Dot,
    square: Square,
  };

  return (
    <PopoverContent className="w-fit p-0.5">
      {Object.entries(TOOLS.PAINT_BRUSH.shape_options).map(
        ([key, value], index) => {
          const Icon = ICONS[key as ExtractedLineCap];

          return (
            <div key={`${key}-${index}`} className="space-y-2">
              <div className="flex space-x-2">
                {value.map(size => {
                  const isSelected = lineCap === key && size === lineWidth;
                  return (
                    <Button
                      variant={isSelected ? "secondary" : "ghost"}
                      key={size}
                      onClick={() => {
                        setProperty("lineWidth", size);
                        setProperty("lineCap", key as ExtractedLineCap);
                        handleOpenChange();
                      }}
                    >
                      <Icon
                        size={getDisplayedSize(size)}
                        className="fill-foreground"
                      />
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        }
      )}
    </PopoverContent>
  );
}

function StraightLineMenu({ handleOpenChange }: MenuProps) {
  const { setProperty, lineWidth, lineCap } = useCherryStore(state => state);

  return (
    <PopoverContent className="w-fit p-0.5">
      {Object.entries(TOOLS.PAINT_BRUSH.shape_options).map(
        ([key, value], index) => {
          return (
            <div key={`${key}-${index}`} className="space-y-2">
              <div className="flex flex-col">
                {value.map(size => {
                  const isSelected = lineCap === key && size === lineWidth;
                  return (
                    <Button
                      variant={isSelected ? "secondary" : "ghost"}
                      key={size}
                      className="w-48"
                      onClick={() => {
                        setProperty("lineWidth", size);
                        setProperty("lineCap", key as ExtractedLineCap);
                        handleOpenChange();
                      }}
                    >
                      <div
                        className={cn("w-full bg-foreground", {
                          "rounded-full": key === "round",
                        })}
                        style={{ height: size }}
                      />
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        }
      )}
    </PopoverContent>
  );
}

function getDisplayedSize(size: number) {
  return size * 3;
}
