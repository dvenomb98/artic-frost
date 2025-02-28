import { ShapeOption } from "@core/lib/types";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@artic-frost/ui/components";

import { useCherryStore } from "@/features/core/providers/store-provider";
import { cn } from "@artic-frost/ui/lib";

const SHAPE_OPTIONS: ShapeOption[] = [
  "stroke_and_transparent",
  "stroke_and_fill",
  "fill_only",
];

function Shapes() {
  const {
    properties: { _ext_shapeOption },
    setProperty,
  } = useCherryStore(state => state);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Shape shape={_ext_shapeOption} className="w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0.5 w-fit">
        {SHAPE_OPTIONS.map(shape => {
          const isSelected = _ext_shapeOption === shape;
          return (
            <div key={shape} className="space-y-2">
              <Button
                variant={isSelected ? "secondary" : "ghost"}
                className="w-32"
                onClick={() => setProperty("_ext_shapeOption", shape)}
              >
                <Shape shape={shape} />
              </Button>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

function Shape({
  shape,
  className,
}: {
  shape: ShapeOption;
  className?: string;
}) {
  const {
    properties: { strokeStyle, fillStyle },
  } = useCherryStore(state => state);

  const getBg = () => {
    switch (shape) {
      case "stroke_and_transparent":
        return "#00000000";

      case "stroke_and_fill":
        return fillStyle;

      case "fill_only":
        return fillStyle;
    }
  };

  const getBorder = () => {
    switch (shape) {
      case "stroke_and_transparent":
        return strokeStyle;

      case "stroke_and_fill":
        return strokeStyle;

      case "fill_only":
        return "#00000000";
    }
  };

  return (
    <div
      className={cn("w-10 h-5 border", className)}
      style={{
        backgroundColor: getBg().toString(),
        borderColor: getBorder().toString(),
      }}
    />
  );
}

export { Shapes };
