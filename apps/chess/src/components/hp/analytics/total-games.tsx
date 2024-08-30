"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { ChartContainer } from "@ui/components/ui/chart";
import { BarChart, Bar, YAxis, XAxis, LabelList } from "recharts";
import { IGetUserGamesData } from "@/utils/supabase/requests/server-only/get-user-games";

export default function TotalGames({ data }: { data: IGetUserGamesData }) {
  const { gamesData } = data;
  const chartData = { date: "2024", games: gamesData.length };

  return (
    <Card x-chunk="charts-01-chunk-2">
      <CardHeader>
        <CardTitle>Progress</CardTitle>
        <CardDescription>View total games you played per year</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid auto-rows-min gap-2">
          <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
            {chartData.games}
            <span className="text-sm font-normal text-muted-foreground">
              {chartData.games === 1 ? "game" : "games"}
            </span>
          </div>
          <ChartContainer
            config={{
              steps: {
                label: "Games",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="aspect-auto h-[32px] w-full"
          >
            <BarChart
              accessibilityLayer
              layout="vertical"
              margin={{
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              }}
              data={[chartData]}
            >
              <Bar
                dataKey="games"
                fill="var(--color-steps)"
                radius={4}
                barSize={32}
              >
                <LabelList
                  position="insideLeft"
                  dataKey="date"
                  offset={8}
                  fontSize={12}
                  fill="white"
                />
              </Bar>
              <YAxis dataKey="date" type="category" tickCount={1} hide />
              <XAxis dataKey="games" type="number" hide />
            </BarChart>
          </ChartContainer>
        </div>
       
      </CardContent>
    </Card>
  );
}
