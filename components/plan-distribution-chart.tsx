"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"

const planData = [
  { name: "CashCloud Pro", value: 30, color: "#3b82f6" }, // Blue
  { name: "CashCloud Enterprise", value: 40, color: "#8b5cf6" }, // Purple
  { name: "CashCloud VIP", value: 20, color: "#ec4899" }, // Pink
  { name: "CashCloud PM", value: 10, color: "#06b6d4" }, // Cyan
]

export function PlanDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Distribution</CardTitle>
        <CardDescription>Active subscription plans across all companies</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            pro: { label: "CashCloud Pro", color: "#3b82f6" },
            enterprise: { label: "CashCloud Enterprise", color: "#8b5cf6" },
            vip: { label: "CashCloud VIP", color: "#ec4899" },
            pm: { label: "CashCloud PM", color: "#06b6d4" },
          }}
          className="h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={planData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={3}
                paddingAngle={2}
              >
                {planData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
