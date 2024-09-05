"use client";

import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import logoLight from "public/logo-light.png";
import logoDark from "public/logo-dark.jpg";
import { useTheme } from "next-themes";
import { useMounted } from "@ui/lib";

interface LogoProps {
  width?: number;
  height?: number;
}
const Logo: FC<LogoProps> = ({ width = 64, height = 64 }) => {
  const { theme } = useTheme();
  const isDark = theme?.includes("dark");
  const mounted = useMounted();
  const logo = isDark ? logoDark : logoLight;

  if (!mounted) return <div style={{ width, height }} />;

  return (
    <Link href="/">
      <Image src={logo} width={width} height={height} alt="Logo" />
    </Link>
  );
};

export default Logo;
