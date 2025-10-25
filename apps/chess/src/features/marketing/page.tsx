import {HeroBanner} from "./components/hero-banner"

import {MarketingNavBar} from "./components/nav-bar";
import {MarketingFooter} from "./components/footer";

function Page() {
  return (
    <>
      <MarketingNavBar />
      <div className="container py-5">

          <HeroBanner />
          </div>

      <MarketingFooter />
    </>
  );
}

export {Page};
