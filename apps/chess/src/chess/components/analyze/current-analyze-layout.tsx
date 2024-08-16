"use client"
import { Board } from '@/chess/lib/definitions'
import { Bar, BarChart } from "recharts"
import useStockfish from '@/utils/stockfish/use-stockfish'
import { ChartConfig, ChartContainer } from '@ui/components/ui/chart'
import React, { useEffect } from 'react'
import { parseFen } from '@/chess/lib/fen'

const chartData = [
  { month: "January", desktop: 186, mobile: -50 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
 
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export default function CurrentAnalyzeLayout({fen}: {fen: string}) {
  const { getEvalution, getEngineFen } = useStockfish(true, true)

  useEffect(() => {
    async function getEval() {
      console.log(fen, "FEN")
      const evalution = await getEvalution(fen)
    console.log(evalution)
    }

    getEval()
    
  }, [fen])
 


  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
