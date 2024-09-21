import React, { ReactNode } from "react";
import PublicNavbar from "@/components/public-navbar";
import { Badge } from "@ui/components";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNavbar />
      <div className="grid container">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid lg:w-[500px] sm:w-full sm:max-w-[500px] gap-6">
            <Badge
              variant="outline"
              className="justify-center mb-5 w-fit mx-auto px-5"
            >
              Modern chess. Endless variations. Simply played.
            </Badge>
            <div className="border-l p-4 w-full">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
