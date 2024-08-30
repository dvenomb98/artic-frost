import PieceSVG from "@/chess/components/piece-svg";
import Link from "next/link";
import React, { FC } from "react";


const Logo: FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-md">
      <PieceSVG className="w-5 h-5 fill-current" piece={"Q"} />
      <h1 className="inline-flex flex-col gap-0 leading-none font-medium">
        <span>DA</span>
        <span className="font-bold">NIEL.</span>
      </h1>
    </Link>
  );
};

export default Logo;