import {Minus} from "lucide-react";
import {Tool} from "./types";
import {toolHandler} from "./handler";

const STRAIGHT_LINE = {
  id: "STRAIGHT_LINE",
  icon: Minus,
  handler: toolHandler("STRAIGHT_LINE"),
} satisfies Tool<StraightLineId>;

type StraightLineId = "STRAIGHT_LINE";

export {STRAIGHT_LINE, type StraightLineId};
