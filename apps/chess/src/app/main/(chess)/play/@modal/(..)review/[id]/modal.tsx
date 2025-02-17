"use client";
import { Dialog, DialogContent } from "@artic-frost/ui/components";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

export default function Modal({ children }: { children: ReactNode }) {
  const router = useRouter();
  function onOpenChange() {
    router.back();
  }
  return (
    <Dialog open={true} defaultOpen={true} onOpenChange={onOpenChange}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
