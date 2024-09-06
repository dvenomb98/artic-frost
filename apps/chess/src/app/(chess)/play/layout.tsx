import { ChessPage } from "@/components/ui/chess-page";
import React, { ReactNode } from "react";

export default function Layout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {modal}
      <ChessPage>{children}</ChessPage>
    </>
  );
}
