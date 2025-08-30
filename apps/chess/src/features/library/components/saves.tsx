import {libraryServer} from "../api/server";
import {Save} from "./save";
import {Suspense} from "react";
import {Skeleton} from "@artic-frost/ui/components";
import {SbButtons} from "./sb-buttonts";

const GRID_CN = "grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4 p-4";

function SavesLoadingSkeleton() {
  return (
    <div className={GRID_CN}>
      {Array.from({length: 6}).map((_, i) => (
        <Skeleton key={i} className="h-52 w-full" />
      ))}
    </div>
  );
}

function Saves() {
  return (
    <div className="grid">
      <div className="p-4 border-b">
        <SbButtons />
      </div>
      <Suspense fallback={<SavesLoadingSkeleton />}>
        <SavesInner />
      </Suspense>
    </div>
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

  return (
    <ul className={GRID_CN}>
      {saves.map(save => (
        <Save key={save.id} save={save} />
      ))}
    </ul>
  );
}

export {Saves};
