import React from "react";
import Spotlight from "@/components/ui/spotlight";
import CreateNewGame from "@/chess/components/create-new-game";
import FindGame from "@/chess/components/find-game";

export default function HeroBanner() {
  return (
    <div className="w-full flex relative overflow-hidden bg-grid-white/[0.02] border-b">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <section className="flex flex-col gap-4 py-10 lg:py-20 container">
        <h1 className="h1 pb-1  font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground bg-opacity-50">
          Make a chess cool, again
        </h1>
        <p className="text-muted-foreground">
          Easily play with friends or engine and enjoy the timeless game.
          Analyze, review games and much more.
        </p>
        <div className="flex flex-row gap-4 sm:flex-col">
          <CreateNewGame />
          <FindGame />
        </div>
      </section>
    </div>
  );
}
