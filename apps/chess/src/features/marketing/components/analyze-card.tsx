"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@artic-frost/ui/components";

import { CARD_HEADLINE, CARD_PADDING } from "../styles";
import { cn } from "@artic-frost/ui/lib";

const CHART_DATA = [
  { month: "January", wins: 186, losses: 80 },
  { month: "February", wins: 305, losses: 200 },
  { month: "March", wins: 237, losses: 120 },
  { month: "April", wins: 73, losses: 190 },
  { month: "May", wins: 209, losses: 130 },
  { month: "June", wins: 214, losses: 140 },
];

const CHART_CONFIG = {
  wins: {
    label: "Wins",
    color: "hsl(var(--chart-1))",
  },
  losses: {
    label: "Losses",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

function AnalyzeCard() {
  return (
    <section>
      <div className={CARD_PADDING.DEFAULT}>
        <h2 className={CARD_HEADLINE.DEFAULT}>Built in Analysis</h2>
        <p className={cn(CARD_HEADLINE.SM, "text-muted-foreground")}>
          We analyze your chess games and provide you with insights on your
          performance.
        </p>
      </div>

      <ChartContainer config={CHART_CONFIG}>
        <AreaChart
          accessibilityLayer
          data={CHART_DATA}
          margin={{
            left: 20,
            right: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={value => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillWins" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-wins)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-wins)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillLosses" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-losses)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-losses)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="losses"
            type="natural"
            fill="url(#fillLosses)"
            fillOpacity={0.4}
            stroke="var(--color-losses)"
            stackId="a"
          />
          <Area
            dataKey="wins"
            type="natural"
            fill="url(#fillWins)"
            fillOpacity={0.4}
            stroke="var(--color-wins)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
}

export { AnalyzeCard };
