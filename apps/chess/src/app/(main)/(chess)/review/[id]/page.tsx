import ReviewPage from "@/chess/components/review-page";
import React from "react";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  return (
    <ReviewPage id={id} analyze />
  )
}
