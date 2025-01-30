import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeftIcon } from "lucide-react";

import { ROUTES } from "@/lib/routes";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="grid container place-self-center lg:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid lg:w-[500px] sm:w-full sm:max-w-[500px] gap-6">
          <Link
            href={ROUTES.INDEX}
            className="flex items-center gap-1 text-muted-foreground text-sm underline w-fit"
          >
            <ArrowLeftIcon className="size-4" />
            <p>Home</p>
          </Link>
          <div className="p-10 w-full border rounded-md shadow-2xl shadow-foreground/5 bg-card text-card-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
