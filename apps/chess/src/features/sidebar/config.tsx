import {ROUTES} from "@/lib/routes";
import {BookIcon, PlayIcon} from "lucide-react";

const SIDEBAR_WIDTH = "12rem";

const SIDEBAR_MENU_ITEMS = [
  {
    label: "Play",
    href: ROUTES.APP.INDEX,
    icon: <PlayIcon className="mr-2" />,
  },
  {
    label: "Library",
    href: ROUTES.APP.LIBRARY,
    icon: <BookIcon className="mr-2" />,
  },
];

export {SIDEBAR_MENU_ITEMS, SIDEBAR_WIDTH};
