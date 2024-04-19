import React, { FC } from "react";
import Spotlight from "@/components/ui/spotlight";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { URLS } from "@/lib/const/urls";

const HeroBanner: FC = () => {
  return (
    <div className="w-full flex relative overflow-hidden bg-grid-white/[0.02]">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <section className="text-center flex flex-col gap-5 py-40 sm:py-20 items-center container">
        <h1 className="h1 tracking-tighter bg-clip-text text-transparent py-1 bg-gradient-to-b from-foreground to-muted-foreground bg-opacity-50">
          Make a frontend cool, again
        </h1>
        <h4 className="h4 text-muted-foreground">
          Developing efficient, robust, and accessible front end solutions, ensuring seamless user
          interactions and a solid digital foundation for your business.
        </h4>
        <div className="flex gap-2 items-center">
          <Button asChild className="w-40">
            <Link href={URLS.PROJECTS}>Projects</Link>
          </Button>
          <Button asChild variant="outline" className="w-40">
            <Link href={URLS.CONTACT}>Contact me</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HeroBanner;
