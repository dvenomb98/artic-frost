import React from "react";
import Spotlight from "@/components/ui/spotlight";
import PieceSVG from "@/chess/components/piece-svg";
import CreateNewGame from "@/chess/components/create-new-game";



export default function HeroBanner() {
  return (
    <div className="w-full flex relative overflow-hidden bg-grid-white/[0.02] border-b">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <section className="text-center flex flex-col gap-5 py-40 sm:py-20 items-center container">
        <PieceSVG piece="Q" className="w-20 h-20"  />
        <h1 className="lg:text-5xl sm:text-4xl font-bold tracking-tighter bg-clip-text text-transparent py-1 bg-gradient-to-b from-foreground to-muted-foreground bg-opacity-50">
          Make chess cool, again
        </h1>
        <h4 className=" text-muted-foreground max-w-4xl mb-1">
        Join to easily play with friends and enjoy the timeless game. Connect, challenge, and compete with your friends in a fun and engaging environment. Whether you're playing for fun or honing your skills, platform makes it simple and enjoyable to play chess with your friends anytime, anywhere.
        </h4>
       <CreateNewGame />
      </section>
    </div>
  );
}
