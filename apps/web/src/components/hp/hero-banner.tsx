import React from "react";
import Spotlight from "@/components/ui/spotlight";
import { Badge } from "@repo/ui/components/badge";
import turborepo from "@/../public/turborepo.svg";
import Image from "next/image";
import { Button } from "@repo/ui/components//button";
import Link from "next/link";
import { URLS } from "@/lib/config/urls";

export default function HeroBanner() {
  return (
    <div className="w-full flex relative overflow-hidden bg-grid-white/[0.02] border">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <section className="text-center flex flex-col gap-5 py-40 sm:py-20 items-center container">
        <Badge variant="outline" className="space-x-2 inline-flex items-center">
          <Image src={turborepo} alt="turborepo" className="w-6 h-6" width={24} height={24} />
          <span>
            This project uses Turborepo and is{" "}
            <a href="https://github.com" className="link">
              open-source.
            </a>
          </span>
        </Badge>
        <h1 className="lg:text-5xl sm:text-4xl font-bold tracking-tighter bg-clip-text text-transparent py-1 bg-gradient-to-b from-foreground to-muted-foreground bg-opacity-50">
          Make a frontend cool, again
        </h1>
        <h4 className="h4 text-muted-foreground max-w-4xl mb-1">
          Writing code and sharing insights. Explore new ideas and practical solutions from my
          front-end lab
        </h4>
        <Button asChild>
          <Link aria-description="docs-link" href={URLS.DOCS}>
            Learn more
          </Link>
        </Button>
      </section>
    </div>
  );
}
