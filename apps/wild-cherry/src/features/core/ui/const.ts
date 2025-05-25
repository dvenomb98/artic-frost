import {type ToolType} from "../store/store";
import {
  MousePointerClick,
  Minus,
  Square,
  type LucideIcon,
  Scan,
} from "lucide-react";

const UI_CONFIG = {
  CLASSNAMES: {
    ITEM_PADDING: "p-1",
    GAP_BETWEEN_ITEMS: "gap-1.5",
    FLOATING_BACKGROUND: "bg-popover",
    FLOATING_FOREGROUND: "text-popover-foreground",
    ICON_SIZE: "size-3.5",
  },
  BUTTON_SIZE: "icon" as "icon",
  TOOLBAR_BUTTON_SIZE: "icon" as "iconMd",
} as const;

const COLOR_PALETTE = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#22c55e", // green-500
  "#3b82f6", // blue-500
  "#a855f7", // purple-500
  "transparent",
] as const;

const TOOLS = {
  line: {
    icon: Minus,
  },
  rectangle: {
    icon: Square,
  },
  selection: {
    icon: MousePointerClick,
  },
  multiselection: {
    icon: Scan,
  },
} as const satisfies Record<ToolType, {icon: LucideIcon}>;

export {UI_CONFIG, TOOLS, COLOR_PALETTE};
