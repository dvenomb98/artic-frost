import Sidebar from "@/components/navbar/sidebar";
import React, { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col lg:pl-14 min-h-screen">
      <Sidebar />
      {children}
    </div>
  );
}
