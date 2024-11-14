import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
 
      <div className="grid container place-self-center lg:min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid lg:w-[500px] sm:w-full sm:max-w-[500px] gap-6">
            <div className="p-4 w-full">{children}</div>
          </div>
        </div>
      </div>
   
  );
}
