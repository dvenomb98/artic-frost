"use client";

import {useCherryStore} from "@core/providers/store-provider";
import {cn} from "@artic-frost/ui/lib";
import {UI_CONFIG} from "../../const";
import {
  AdvancedColorPicker,
  ToggleGroup,
  ToggleGroupItem,
} from "@artic-frost/ui/components";
import {ExtractedLineCap, ShapeOption} from "@core/lib/types";
import {debounce} from "@/lib/utils";
import {useCallback} from "react";

const COLORS_OPTIONS = ["black", "red", "green", "blue", "yellow", "orange"];
const LINE_STYLE_OPTIONS = [2, 4, 6];
const LINE_CAP_OPTIONS = ["round", "square"] satisfies ExtractedLineCap[];

const SHAPE_OPTIONS = [
  "stroke_and_transparent",
  "stroke_and_fill",
  "fill_only",
] satisfies ShapeOption[];

const SHAPE_OPTIONS_TO_LABELS = {
  stroke_and_transparent: "Stroke & Transparent",
  stroke_and_fill: "Stroke & Fill",
  fill_only: "Fill Only",
} satisfies Record<ShapeOption, string>;

function OptionsBar() {
  const {toolId, currentShapeId, properties, shapes, setProperty, updateShape} =
    useCherryStore(state => state);

  const currentShape = shapes.find(shape => shape.id === currentShapeId);
  const currentProps = currentShape?.properties || properties;

  function setFillProperty(value: string) {
    setProperty("fillStyle", value);

    if (!currentShape) {
      return;
    }

    updateShape(currentShape.id, currentShape.points, {
      fillStyle: value,
    });
  }

  function setStrokeProperty(value: string) {
    setProperty("strokeStyle", value);

    if (!currentShape) {
      return;
    }

    updateShape(currentShape.id, currentShape.points, {
      strokeStyle: value,
    });
  }

  function setLineWidthProperty(value: number) {
    setProperty("lineWidth", value);

    if (!currentShape) {
      return;
    }

    updateShape(currentShape.id, currentShape.points, {
      lineWidth: value,
    });
  }

  function setLineCapProperty(value: ExtractedLineCap) {
    setProperty("lineCap", value);

    if (!currentShape) {
      return;
    }

    updateShape(currentShape.id, currentShape.points, {
      lineCap: value,
    });
  }

  function setShapeProperty(value: ShapeOption) {
    setProperty("_ext_shapeOption", value);

    if (!currentShape) {
      return;
    }

    updateShape(currentShape.id, currentShape.points, {
      _ext_shapeOption: value,
    });
  }

  const onAdvancedColorPickerChange = useCallback(
    debounce((value: string, type: "strokeStyle" | "fillStyle") => {
      setProperty(type, value);
    }, 500),
    []
  );

  if (!toolId) return null;

  return (
    <div
      className={cn(
        "flex-col rounded-md p-2.5",
        UI_CONFIG.FLOATING_BACKGROUND
      )}>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-sm">Fill</p>
          <ToggleGroup
            value={currentProps.fillStyle.toString()}
            onValueChange={value => setFillProperty(value)}
            type="single"
            className={cn("flex gap-0.5")}
            size="xs">
            {COLORS_OPTIONS.map(color => (
              <ToggleGroupItem key={color} value={color}>
                <div
                  className="size-4 rounded-sm"
                  style={{backgroundColor: color}}
                />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <AdvancedColorPicker
            color={currentProps.fillStyle.toString()}
            onChange={c => onAdvancedColorPickerChange(c, "fillStyle")}
            buttonProps={{
              variant: "outline",
              size: "sm",
            }}
          />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <p className="text-sm">Stroke</p>
          <ToggleGroup
            value={currentProps.strokeStyle.toString()}
            onValueChange={value => setStrokeProperty(value)}
            type="single"
            className={cn("flex gap-0.5")}
            size="xs">
            {COLORS_OPTIONS.map(color => (
              <ToggleGroupItem key={color} value={color}>
                <div
                  className="size-4 rounded-sm"
                  style={{backgroundColor: color}}
                />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <AdvancedColorPicker
            color={currentProps.strokeStyle.toString()}
            onChange={c => onAdvancedColorPickerChange(c, "strokeStyle")}
            buttonProps={{
              variant: "outline",
              size: "sm",
            }}
          />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <p className="text-sm">Width</p>
          <ToggleGroup
            value={currentProps.lineWidth.toString()}
            onValueChange={value => setLineWidthProperty(Number(value))}
            type="single"
            className={cn("flex gap-0.5")}
            size="xs">
            {LINE_STYLE_OPTIONS.map(size => (
              <ToggleGroupItem key={size} value={size.toString()}>
                <div
                  className="rounded-sm bg-foreground w-full"
                  style={{height: size}}
                />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <p className="text-sm">Cap</p>
          <ToggleGroup
            value={currentProps.lineCap}
            onValueChange={value =>
              setLineCapProperty(value as ExtractedLineCap)
            }
            className={cn("flex gap-0.5")}
            type="single"
            size="xs">
            {LINE_CAP_OPTIONS.map(cap => (
              <ToggleGroupItem key={cap} value={cap}>
                <div
                  className={cn("size-2 bg-foreground", {
                    "rounded-full": cap === "round",
                  })}
                />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <p className="text-sm">Shape</p>
          <ToggleGroup
            value={currentProps._ext_shapeOption}
            onValueChange={value => setShapeProperty(value as ShapeOption)}
            className={cn("flex flex-col gap-0.5 items-start")}
            type="single"
            size="xs">
            {SHAPE_OPTIONS.map(shape => (
              <ToggleGroupItem key={shape} value={shape}>
                <span className="text-xs">
                  {SHAPE_OPTIONS_TO_LABELS[shape]}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}

export {OptionsBar};
