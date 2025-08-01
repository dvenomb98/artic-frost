"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@artic-frost/ui/components";

import {Pie, PieChart} from "recharts";

import {AnalyticsData} from "./request";

const CHART_CONFIG = {
  wins: {
    label: "Wins",
    color: "hsl(var(--chart-1))",
  },
  losses: {
    label: "Losses",
    color: "hsl(var(--chart-2))",
  },
  draws: {
    label: "Draws",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

// const date = new Date(game.created_at);
// const dayMonth = date.toLocaleString("default", {
//   month: "long",
//   day: "numeric",
// });

export function UserStates({data}: {data: AnalyticsData}) {
  const {userData, data: gamesData} = data;
  const userId = userData.id;

  const chartData: {
    state: "wins" | "draws" | "losses";
    count: number;
    fill: string;
  }[] = [
    {
      state: "wins",
      count: 0,
      fill: "var(--color-wins)",
    },
    {
      state: "draws",
      count: 0,
      fill: "var(--color-draws)",
    },
    {
      state: "losses",
      count: 0,
      fill: "var(--color-losses)",
    },
  ];

  for (const game of gamesData) {
    let outcome = "";

    if (game.game_state === "DRAW") {
      outcome = "draws";
    } else if (game.winner_id === userId) {
      outcome = "wins";
    } else if (game.winner_id && game.winner_id !== userId) {
      outcome = "losses";
    }

    for (const chart of chartData) {
      if (chart.state === outcome) {
        chart.count++;
        continue;
      }
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Your statistics</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={CHART_CONFIG}
          className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="count" nameKey="state" stroke="0" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-start gap-2 text-sm text-muted-foreground">
        This chart shows the distribution of your game outcomes.
      </CardFooter>
    </Card>
  );
}
