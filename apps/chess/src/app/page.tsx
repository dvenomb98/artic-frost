"use client";

import {LandingPage} from "@/features/marketing/landing-page";

import {MarketingNavBar} from "@/features/marketing/nav-bar";
import {MarketingFooter} from "@/features/marketing/footer";

import {playClient} from "@/features/chess/api/play/client";

async function testMoves() {
  const data = await playClient.getMoves(
    "96cdb091-5fde-444f-89aa-ec338a8b61b1",
    {
      row: 1,
      col: 1,
    }
  );
  console.log(data);
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
