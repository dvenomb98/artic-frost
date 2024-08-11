import React from "react";
import Spotlight from "@/components/ui/spotlight";
import PieceSVG from "@/chess/components/piece-svg";
import CreateNewGame from "@/chess/components/create-new-game";
import FindGame from "@/chess/components/find-game";
import Image from "next/image";
import landing from "public/landing.webp";
import { cn } from "@ui/lib/utils/cn";

const titleClasses =
  "lg:text-6xl sm:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground bg-opacity-50";

export default function HeroBanner() {
  return (
    <div className="w-full flex relative overflow-hidden bg-grid-white/[0.02] border-b">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <section className="flex gap-5 lg:gap-10 py-40 sm:py-20 items-center container">
      <Image src={landing} alt="Chess piece" className="h-[400px] w-auto shadow-2xl shadow-foreground/50 sm:hidden rounded" priority  />
        <div>
          <PieceSVG piece="Q" className="w-20 h-20 -rotate-45 opacity-75 " />
          <div className="lg:ml-10">
            
            <div className="inline-flex flex-col pb-4">
              <span className={titleClasses}>Make chess</span>
              <span className={cn(titleClasses, "pb-2")}>cool, again</span>
            </div>
         
          <h4 className="text-muted-foreground max-w-lg pb-6">
            Join to easily play with friends and enjoy the timeless game.
            Connect, challenge, and compete with your friends in a fun and
            engaging environment. Whether you're playing for fun or honing your
            skills, platform makes it simple and enjoyable to play chess with
            your friends anytime, anywhere.
          </h4>
          <div className="flex flex-row gap-4 sm:flex-col">
            <CreateNewGame />
            <FindGame />
          </div>
          </div>
        </div>
       
      </section>
    </div>
  );
}
