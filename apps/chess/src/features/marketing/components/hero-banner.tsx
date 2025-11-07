"use client";

import gsap from "gsap";

import {GITHUB_REPO_URL} from "@/lib/links";
import {ROUTES} from "@/lib/routes";
import {Button} from "@artic-frost/ui/components";
import Link from "next/link";

import {useCallback} from "react";
import {SplitText} from "gsap/SplitText";
import {QueenSVG} from "./queen-svg";

import {GithubIcon} from "lucide-react";

function HeroBanner() {
  const againAnimation = useCallback((node: HTMLHeadingElement | null) => {
    if (!node) return;

    const split = SplitText.create(node, {type: "chars"});

    const animation = gsap.from(split.chars, {
      duration: 1,
      opacity: 0,
      y: 50,
      stagger: {
        amount: 0.5,
        from: "random",
      },
    });

    return () => {
      animation.kill();
      split.revert();
    };
  }, []);

  const svgAnimation = useCallback((node: SVGElement | null) => {
    if (!node) return;

    const paths = node.querySelectorAll("path");
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.stroke = "white";
    });

    const animation = gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1.5,
      opacity: 1,
      stagger: 0.1,
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <section className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center overflow-hidden relative">
      <h1 className="text-4xl tracking-tight font-medium">Make chess great</h1>
      <h1
        ref={againAnimation}
        className="text-8xl tracking-tighter font-extrabold">
        AGAIN.
      </h1>

      <QueenSVG
        ref={svgAnimation}
        className="size-[444px] md:size-[666px] absolute opacity-5 -bottom-20 md:-bottom-48 left-1/2 -translate-x-1/2 text-secondary -z-5"
      />

      <div className="flex items-center gap-4 mt-10 self-center">
        <Button asChild size="xl">
          <Link href={ROUTES.APP.INDEX}>Play now</Link>
        </Button>

        <Button asChild size="xl" variant="secondary">
          <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
            <GithubIcon /> Contribute
          </a>
        </Button>
      </div>
    </section>
  );
}

export {HeroBanner};
