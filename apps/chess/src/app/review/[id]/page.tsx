import ReviewPage from "@/chess/components/review-page";
import React from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <ReviewPage id={id} analyze />
  )
}
