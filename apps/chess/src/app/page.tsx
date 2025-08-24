"use client";

import {LandingPage} from "@/features/marketing/landing-page";
import {MarketingNavBar} from "@/features/marketing/nav-bar";
import {MarketingFooter} from "@/features/marketing/footer";

async function testMoves() {
  try {
    const res = await fetch(
      "/play/96cdb091-5fde-444f-89aa-ec338a8b61b1/api/get-moves",
      {
        method: "POST",
        body: JSON.stringify({
          row: 10,
          col: 0,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error(error, "ERROR");
      return;
    }

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error(error, "UNHANDLED ERROR");
  }
}

function Home() {
  return (
    <>
      <button onClick={testMoves}>Click me</button>
      <MarketingNavBar />
      <LandingPage />
      <MarketingFooter />
    </>
  );
}

export default Home;
