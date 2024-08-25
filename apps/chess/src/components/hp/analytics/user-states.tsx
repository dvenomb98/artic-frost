"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";

import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@ui/components/ui/chart";

import { IGetUserGamesData } from "@/utils/supabase/requests/server-only/get-user-games";

const chartConfig = {
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

export function UserStates({ data }: { data: IGetUserGamesData }) {
  const { userData, gamesData } = data;
  const userId = userData.user.id;

  let chartData: {
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

    if (game.gameState === "DRAW") {
      outcome = "draws";
    } else if (game.winnerId === userId) {
      outcome = "wins";
    } else if (game.winnerId && game.winnerId !== userId) {
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
        <CardDescription>Your all matches</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
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
        View how you are doing overall in all matches
      </CardFooter>
    </Card>
  );
}
