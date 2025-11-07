import {HeroBanner} from "./components/hero-banner";

import {MarketingNavBar} from "./components/nav-bar";
import {MarketingFooter} from "./components/footer";

function Page() {
  return (
    <>
      <MarketingNavBar />
      <HeroBanner />
      <MarketingFooter />
    </>
  );
}

export {Page};
