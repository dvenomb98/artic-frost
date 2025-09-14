import * as React from "react";

import {libraryServer} from "../api/server";
import {Save} from "./save";
import {Skeleton} from "@artic-frost/ui/components";
import {AddNewButton} from "./add-new-button";

const GRID_CN = "grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4 p-4";

function SidebarLoadingSkeleton() {
  return (
    <div className={GRID_CN}>
      {Array.from({length: 3}).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

function Sidebar() {
  return (
    <div className="grid">
      <div className="p-4 border-b">
        <AddNewButton />
      </div>
      <React.Suspense fallback={<SidebarLoadingSkeleton />}>
        <SavesInner />
      </React.Suspense>
    </div>
  );
}

export {Sidebar};

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

  return (
    <ul className={GRID_CN}>
      {saves.map(save => (
        <Save key={save.id} save={save} />
      ))}
    </ul>
  );
}
