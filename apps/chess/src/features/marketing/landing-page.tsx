import {HeroBanner} from "./components/hero-banner";
import {Map} from "./components/map";
import {AnalyzeCard} from "./components/analyze-card";
import {RankingCard} from "./components/ranking-card";

function LandingPage() {
  return (
    <div className="page--layout">
      <div className="border divide-y divide-border px-0">
        <HeroBanner />
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-y divide-border">
          <RankingCard />
          <AnalyzeCard />
        </div>
        <Map />
      </div>
    </div>
  );
}

export {LandingPage};
