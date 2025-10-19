import * as React from "react";
import {libraryServer} from "../../api/server";
import {Skeleton} from "@artic-frost/ui/components";
import {GRID_CN} from "./const";
import {SavesCsr} from "./saves-csr";

function SidebarLoadingSkeleton() {
  return (
    <div className={GRID_CN}>
      {Array.from({length: 3}).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

function Saves() {
  return (
    <React.Suspense fallback={<SidebarLoadingSkeleton />}>
      <SavesInner />
    </React.Suspense>
  );
}

async function SavesInner() {
  const saves = await libraryServer.getSaves();

  if (!saves.length) {
    return (
      <div className="p-4">
        <div className="text-muted-foreground">
          <div className="text-lg font-medium mb-2">No saved positions yet</div>
          <div className="text-sm">
            Save positions during your games to access them later
          </div>
        </div>
      </div>
    );
  }

  return <SavesCsr saves={saves} />;
}

export {Saves};
