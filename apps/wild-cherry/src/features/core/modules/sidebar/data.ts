import { Palette, PencilRuler, Image } from "lucide-react";

const DATA = {
  tools: {
    title: "Tools",
    icon: PencilRuler,
  },
  canvas: {
    title: "Canvas",
    icon: Image,
  },
};

type SidebarDataValues = keyof typeof DATA

export { DATA, type SidebarDataValues };
