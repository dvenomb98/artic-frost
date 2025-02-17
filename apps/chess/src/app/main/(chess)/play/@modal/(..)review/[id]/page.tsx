import React from "react";
import Modal from "./modal";
import ReviewPage from "@chess/components/review-page";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  return (
    <Modal>
      <ReviewPage id={id} />
    </Modal>
  );
}
