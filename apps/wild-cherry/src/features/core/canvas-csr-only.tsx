"use client";

import dynamic from "next/dynamic";
import {Loader2} from "lucide-react";

const Canvas = dynamic(
  () => import("@/features/core/canvas").then(mod => mod.Canvas),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-screen w-full place-content-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    ),
  }
);

const CanvasCsrOnly = () => {
  return <Canvas />;
};

export {CanvasCsrOnly};
