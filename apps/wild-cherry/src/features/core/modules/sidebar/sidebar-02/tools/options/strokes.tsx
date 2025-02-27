import { ExtractedLineCap } from "@core/lib/types";
import { useCherryStore } from "@core/providers/store-provider";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@artic-frost/ui/components";

import { cn } from "@artic-frost/ui/lib";

const STROKE_OPTIONS = {
  round: [2, 4, 6],
  square: [2, 4, 6],
} satisfies Record<ExtractedLineCap, number[]>;

function Strokes() {
  const {
    setProperty,
    properties: { lineWidth, lineCap },
  } = useCherryStore(state => state);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full" variant="outline">
          <Stroke shapeKey={lineCap as ExtractedLineCap} size={lineWidth} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0.5">
        {Object.entries(STROKE_OPTIONS).map(([key, value], index) => {
          return (
            <div key={`${key}-${index}`} className="space-y-2">
              <div className="flex flex-col">
                {value.map(size => {
                  const isSelected = lineCap === key && size === lineWidth;
                  return (
                    <Button
                      variant={isSelected ? "secondary" : "ghost"}
                      key={size}
                      className="w-32"
                      onClick={() => {
                        setProperty("lineWidth", size);
                        setProperty("lineCap", key as ExtractedLineCap);
                      }}
                    >
                      <Stroke shapeKey={key as ExtractedLineCap} size={size} />
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export { Strokes };

function Stroke({
  size,
  shapeKey,
}: {
  size: number;
  shapeKey: ExtractedLineCap;
}) {
  return (
    <div
      className={cn("w-10 bg-foreground", {
        "rounded-full": shapeKey === "round",
      })}
      style={{ height: size }}
    />
  );
}
