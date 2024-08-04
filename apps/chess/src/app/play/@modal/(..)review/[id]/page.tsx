import React from "react";
import Modal from "./modal";
import ReviewPage from "@/chess/components/review-page";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <Modal>
      <ReviewPage id={id} />
    </Modal>
  );
}
