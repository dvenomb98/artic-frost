import {SpotlightNew} from "@/components/spotlight-new";
import {GITHUB_REPO_URL} from "@/lib/links";
import {ROUTES} from "@/lib/routes";
import {Button} from "@artic-frost/ui/components";

import {GithubIcon} from "lucide-react";
import Link from "next/link";

function HeroBanner() {
  return (
    <div className="h-[30rem] md:h-[40rem] w-full bg-background flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="hidden md:block">
        <SpotlightNew />
      </div>

      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-0 md:pt-20 flex flex-col justify-center">
        <h1 className="text-4xl md:text-8xl tracking-tight font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 bg-opacity-50">
          Chess <br /> is not dead.
        </h1>
        <p className="mt-4 font-normal text-base text-muted-foreground max-w-lg text-center mx-auto">
          A simple real-time multiplayer chess game you can play right in your
          browser. Free forever.
        </p>
        <div className="flex items-center gap-4 mt-10 self-center">
          <Button asChild size="lg">
            <Link href={ROUTES.MAIN.INDEX}>Play Now</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a href={GITHUB_REPO_URL} target="_blank">
              <GithubIcon className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export {HeroBanner};
