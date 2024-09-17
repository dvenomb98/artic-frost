"use client";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@ui/components";
import { IGetUserGamesData } from "@/services/supabase/requests/server-only/get-user-games";

const chartConfig = {
  count: {
    label: "Count",
  },
  checkmate: {
    label: "Checkmate",
    color: "hsl(var(--chart-1))",
  },
  draw: {
    label: "Draw",
    color: "hsl(var(--chart-2))",
  },
  surrender: {
    label: "Surrender",
    color: "hsl(var(--chart-3))",
  },
  in_game: {
    label: "In game",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export async function GameStates({ data }: { data: IGetUserGamesData }) {
  const { gamesData } = data;

  let chartData = [
    { status: "checkmate", count: 0, fill: "var(--color-checkmate)" },
    { status: "surrender", count: 0, fill: "var(--color-surrender)" },
    { status: "draw", count: 0, fill: "var(--color-draw)" },
    { status: "in_game", count: 0, fill: "var(--color-in_game)" },
  ];

  for (const game of gamesData) {
    for (let chart of chartData) {
      if (chart.status === "in_game" && !game.gameState) {
        chart.count++;
        continue;
      }
      if (chart.status === game.gameState.toLowerCase()) {
        chart.count++;
        continue;
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall statistics</CardTitle>
        <CardDescription>Your all matches</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-start text-muted-foreground text-sm">
        View all match statuses during your games
      </CardFooter>
    </Card>
  );
}
