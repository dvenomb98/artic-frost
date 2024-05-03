"use client";
import useMounted from "@ui/lib/hooks/useMounted";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useMemo } from "react";

export default function PulseBeams() {
  return (
    <div className="flex h-[620px] relative items-center justify-center bg-background overflow-hidden">
      <button className="bg-background w-[240px] z-40 h-[80px] shadow-2xl shadow-secondary rounded-full border relative">
        <span className="h2 font-bold">Powered by</span>
      </button>
      <div className="absolute inset-0 flex items-center justify-center">
        <SVGs />
      </div>
    </div>
  );
}

function SVGs({ width = 858, height = 434 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex flex-shrink-0"
    >
      <path
        d="M400 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5"
        className="stroke-muted"
      />
      <path d="M480 200H841C846.523 200 851 195.523 851 190V40" className="stroke-muted" />
      <path
        d="M425.5 200V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5"
        className="stroke-muted"
      />
      <path
        d="M493 200V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427"
        className="stroke-muted"
      />
      <path d="M380 200V17C380 11.4772 384.477 7 390 7H414" className="stroke-muted" />

      {/* Gradient Beams */}

      <path
        d="M400 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5"
        stroke="url(#grad1)"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path d="M480 200H841C846.523 200 851 195.523 851 190V40" stroke="url(#grad2)" />
      <path
        d="M425.5 200V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5"
        stroke="url(#grad3)"
      />
      <path
        d="M493 200V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427"
        stroke="url(#grad4)"
      />
      <path d="M380 200V17C380 11.4772 384.477 7 390 7H414" stroke="url(#grad5)" />

      <defs>
        <motion.linearGradient
          animate={{
            x1: [0, width * 1.2],
            x2: [0, width],
            y1: [height, height / 2],
            y2: [height * 1.2, height],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
          gradientUnits="userSpaceOnUse"
          id="grad1"
        >
          <GradientColors />
        </motion.linearGradient>
        <motion.linearGradient
          animate={{
            x1: [0, width * 1.2],
            x2: [0, width],
            y1: [height, height / 2],
            y2: [height * 1.2, height],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 3,
          }}
          id="grad2"
        >
          <GradientColors />
        </motion.linearGradient>
        <motion.linearGradient
          animate={{
            x1: [0, width * 1.2],
            x2: [0, width],
            y1: [height, height / 2],
            y2: [height * 1.2, height],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
          gradientUnits="userSpaceOnUse"
          id="grad3"
        >
          <GradientColors />
        </motion.linearGradient>
        <motion.linearGradient
          animate={{
            x1: [0, width * 1.2],
            x2: [0, width],
            y1: [height, height / 2],
            y2: [height * 1.2, height],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
          gradientUnits="userSpaceOnUse"
          id="grad4"
        >
          <GradientColors />
        </motion.linearGradient>
        <motion.linearGradient
          animate={{
            x1: [0, width * 1.2],
            x2: [0, width],
            y1: [height, height / 2],
            y2: [height * 1.2, height],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
          gradientUnits="userSpaceOnUse"
          id="grad5"
        >
          <GradientColors />
        </motion.linearGradient>
      </defs>
      <circle cx="851" cy="34" r="6.5" className="stroke-muted fill-muted" />
      <circle cx="770" cy="427" r="6.5" className="stroke-muted fill-muted" />
      <circle cx="142" cy="427" r="6.5" className="stroke-muted fill-muted" />
      <circle cx="6.5" cy="398.5" r="6" className="stroke-muted fill-muted" />
      <circle cx="420.5" cy="6.5" r="6" className="stroke-muted fill-muted" />
    </svg>
  );
}
function GradientColors() {
  const mounted = useMounted();
  const { theme } = useTheme();

  const gradientArr = useMemo(() => {
    const current = theme?.split("-")[0];
    const gradientsMap = {
      default: ["#18CCFC", "#18CCFC", "#6344F5", "#AE48FF"],
      zinc: ["#18CCFC", "#18CCFC", "#6344F5", "#AE48FF"],
      orange: ["#fb923c", "#fb923c", "#ea580c", "#c2410c"],
      rose: ["#f43f5e", "#f43f5e", "#e11d48", "#be123c"],
      violet: ["#18CCFC", "#18CCFC", "#6344F5", "#AE48FF"],
      green: ["#4ade80", "#4ade80", "#16a34a", "#15803d"],
    };
    // @ts-ignore Ignore types
    return gradientsMap?.[current] || gradientsMap["default"];
  }, [theme, mounted]);

  if (!mounted) return null;
  return (
    <>
      <stop stopColor={gradientArr[0]} stopOpacity="0"></stop>
      <stop stopColor={gradientArr[1]}></stop>
      <stop offset="0.325" stopColor={gradientArr[2]}></stop>
      <stop offset="1" stopColor={gradientArr[3]} stopOpacity="0"></stop>
    </>
  );
}


