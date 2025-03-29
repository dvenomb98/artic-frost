import {Pencil} from "lucide-react";
import {toolHandler} from "./handler";
import {Tool} from "./types";

const FREE_HAND = {
  id: "FREE_HAND",
  icon: Pencil,
  handler: toolHandler("FREE_HAND"),
} satisfies Tool<FreeHandId>;

type FreeHandId = "FREE_HAND";

export {FREE_HAND, type FreeHandId};
