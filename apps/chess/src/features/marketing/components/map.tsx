import { WorldMap } from "@/components/world-map";
import { Suspense } from "react";
import { CARD_HEADLINE, CARD_PADDING } from "../styles";
import { cn } from "@artic-frost/ui/lib";

function Map() {
  return (
    <section>
      <div className={CARD_PADDING.DEFAULT}>
        <h2 className={CARD_HEADLINE.DEFAULT}>You Play, We Connect.</h2>
        <p className={cn(CARD_HEADLINE.SM, "text-muted-foreground")}>
        Play chess remotely worldwide. Our real-time multiplayer system takes care of the rest.
        </p>
      </div>
      <Suspense fallback={null}>
        <WorldMap dots={DOTS} lineColor={LINE_COLOR} />
      </Suspense>
    </section>
  );
}

const LINE_COLOR ="white"

const DOTS = [
  {
    start: {
      lat: 64.2008,
      lng: -149.4937,
    }, // Alaska (Fairbanks)
    end: {
      lat: 34.0522,
      lng: -118.2437,
    }, // Los Angeles
  },
  {
    start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
    end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
  },
  {
    start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
    end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
  },
  {
    start: { lat: 51.5074, lng: -0.1278 }, // London
    end: { lat: 28.6139, lng: 77.209 }, // New Delhi
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  },
];

export { Map };
