"use client";
import { Dialog, DialogContent } from "@ui/components/ui/dialog";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

export default function Modal({ children }: { children: ReactNode }) {
  const router = useRouter();
  function onOpenChange() {
    router.back();
  }
  return (
    <Dialog open={true} defaultOpen={true} onOpenChange={onOpenChange}>
      <DialogContent className="lg:max-w-[550px]">{children}</DialogContent>
    </Dialog>
  );
}
