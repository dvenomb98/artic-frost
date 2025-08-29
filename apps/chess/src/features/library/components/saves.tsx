import {libraryServer} from "../api/server";
import {Save} from "./save";
import {Suspense} from "react";
import {Skeleton} from "@artic-frost/ui/components";

function SavesLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({length: 6}).map((_, i) => (
        <Skeleton key={i} className="h-52 w-full" />
      ))}
    </div>
  );
}

function Saves() {
  return (
    <div className="grid gap-4">
      <h2 className="h2">Saved positions</h2>
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
      <div className="text-center py-12">
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {saves.map(save => (
        <Save key={save.id} save={save} />
      ))}
    </div>
  );
}

export {Saves};
