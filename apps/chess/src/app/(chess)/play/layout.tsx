import { ChessPage } from "@/components/chess-page";
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
