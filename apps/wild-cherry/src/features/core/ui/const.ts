import {type ToolType} from "../store/store";
import {MousePointerClick, Minus, Square, type LucideIcon} from "lucide-react";

const UI_CONFIG = {
  CLASSNAMES: {
    ITEM_PADDING: "p-1",
    GAP_BETWEEN_ITEMS: "gap-1.5",
    FLOATING_BACKGROUND: "bg-sidebar",
    FLOATING_FOREGROUND: "text-sidebar-foreground",
    ICON_SIZE: "size-3.5",
  },
  BUTTON_SIZE: "icon" as "icon",
} as const;

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
} as const satisfies Record<ToolType, {icon: LucideIcon}>;

export {UI_CONFIG, TOOLS};
