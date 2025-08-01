import React from "react";
import {Loader} from "lucide-react";

export default function PageSuspense() {
  return (
    <div className="w-full h-fullflex items-center justify-center">
      <div className="flex gap-2 items-center text-muted-foreground">
        <Loader width={20} height={20} className="animate-spin" />
        <span className="text-sm">Loading data...</span>
      </div>
    </div>
  );
}
