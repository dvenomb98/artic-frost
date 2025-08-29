"use client";

import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  DialogClose,
} from "@artic-frost/ui/components";
import type {GameResult} from "wasm-chess";

import {getTranslatedResults} from "../lib/get-translated-results";

function EndgameDialog({result}: {result: GameResult}) {
  const translatedResult = getTranslatedResults(result);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{translatedResult}</DialogTitle>
      </DialogHeader>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}

export {EndgameDialog};
