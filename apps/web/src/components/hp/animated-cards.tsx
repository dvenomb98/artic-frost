"use client";
import { cn } from "@repo/ui/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/card";
import NextIcon from "@/components/icons/next-icon"
import TurboIcon from "../icons/turbo-icon";
import TailwindIcon from "../icons/tailwind-icon";

const items = [
  {
    title: "Next",
    description:
      "Next.js enables you to create high-quality web applications with the power of React components.",
    link: "https://nextjs.org/",
    icon: <NextIcon className="size-16 fill-foreground" />
  },
  {
    title: "Tailwind",
    description: "A utility-first CSS framework.",
    link: "https://tailwindcss.com/",
    icon: <TailwindIcon className="size-16" />
  },
  {
    title: "Turborepo",
    description:
      "Turborepo is a high-performance build system for JavaScript and TypeScript codebases.",
    link: "https://turbo.build/repo",
    icon: <TurboIcon className="size-16" />
  },
];

export default function AnimatedCards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3")}>
      {items.map((item, idx) => (
        <a
          href={item.link}
          key={item.title}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-muted block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="h-full relative z-20">
            <CardHeader className="space-y-4">
              <CardTitle className="flex items-center gap-4"> {item.icon}{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        </a>
      ))}
    </div>
  );
}
