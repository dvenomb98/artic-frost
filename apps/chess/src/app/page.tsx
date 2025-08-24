"use client";

import {LandingPage} from "@/features/marketing/landing-page";

import {MarketingNavBar} from "@/features/marketing/nav-bar";
import {MarketingFooter} from "@/features/marketing/footer";

import {playClient} from "@/features/play/api/client";

async function testMoves() {
  const result = await playClient.getMoves(
    "96cdb091-5fde-444f-89aa-ec338a8b61b1",
    {
      row: 6,
      col: 1,
    }
  );

  if (result?.data.length) {
    const move = result.data[0]!;
    await playClient.makeMove("96cdb091-5fde-444f-89aa-ec338a8b61b1", move);
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
