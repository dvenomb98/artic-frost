import { ZapIcon } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";

const Logo: FC = () => {
  return (
    <Link href={"https://danielbilek.com"} className="flex items-center gap-2 rounded-md">
      <ZapIcon className="w-5 h-5 fill-current" />
      <h1 className="inline-flex flex-col gap-0 leading-none font-medium">
        <span>DA</span>
        <div><span className="font-bold">NIEL.</span>  <span className="text-xs text-muted-foreground">chess</span></div>
      
      </h1>
    </Link>
  );
};

export default Logo;