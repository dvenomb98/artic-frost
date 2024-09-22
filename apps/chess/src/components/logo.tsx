"use client";

import Link from "next/link";
import React, { FC } from "react";
import { useTheme } from "next-themes";
import { useMounted } from "@ui/lib";
import PieceSVG from "@/features/chess/components/piece-svg";

interface LogoProps {
  width?: number;
  height?: number;
}
const Logo: FC<LogoProps> = ({ width = 64, height = 64 }) => {
  const { theme } = useTheme();
  const isDark = theme?.includes("dark");
  const mounted = useMounted();

  if (!mounted) return <div style={{ width, height }} />;

  return (
    <Link href="/">
      <PieceSVG piece="Q" className="size-10" />
    </Link>
  );
};

export default Logo;
