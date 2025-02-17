import { cn } from "@artic-frost/ui/lib";
import { CARD_HEADLINE, CARD_PADDING } from "../styles";
import { ArrowUpRightIcon } from "lucide-react";

function RankingCard() {
  return (
    <section className={cn(CARD_PADDING.DEFAULT, "relative overflow-hidden")}>
      <p className="text-muted-foreground text-sm mb-2">Coming soon...</p>
      <h2 className={CARD_HEADLINE.SM}>
        Forget complex ELO ratings.
        <span className="text-muted-foreground">
          {" "}
          Climb through exciting leagues from Bronze to Grandmaster in our
          intuitive ranking system.
        </span>
      </h2>
      <ArrowUpRightIcon className="text-muted-foreground size-[300px] lg:size-[600px] absolute opacity-20 -bottom-20 -left-20 lg:-bottom-40 lg:-left-40" />
    </section>
  );
}

export { RankingCard };
