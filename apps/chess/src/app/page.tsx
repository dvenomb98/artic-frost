import {LandingPage} from "@/features/marketing/landing-page";

import {MarketingNavBar} from "@/features/marketing/nav-bar";
import {MarketingFooter} from "@/features/marketing/footer";

function Home() { 
  return (
    <>
      <MarketingNavBar />
      <LandingPage />
      <MarketingFooter />
    </>
  );
}

export default Home;
