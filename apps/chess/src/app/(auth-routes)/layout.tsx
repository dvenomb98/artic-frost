import Image from "next/image";
import React, { ReactNode } from "react";
import landing from "public/landing.jpg";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full lg:grid lg:max-h-[600px] lg:grid-cols-8">
      <div className="flex items-center justify-center py-12 lg:col-span-5">
        <div className="mx-auto grid w-[350px] gap-6 ">{children}</div>
      </div>
      <div className="hidden bg-muted lg:block lg:col-span-3">
        <Image
          src={landing}
          alt="Image"
          width="832"
          height="1152"
          className="h-full w-full object-cover lg:max-h-[600px]"
        />
      </div>
    </div>
  );
}
