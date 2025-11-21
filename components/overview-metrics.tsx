import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, DollarSign, FileText } from "lucide-react"

export function OverviewMetrics() {
  const metrics = [
    {
      title: "Total Companies",
      value: "150",
      icon: Building2,
      color: "text-chart-1",
    },
    {
      title: "Total Payees",
      value: "1,200",
      icon: Users,
      color: "text-chart-2",
    },
    {
      title: "Total Payments",
      value: "$85,000",
      subtitle: "130 transactions",
      icon: DollarSign,
      color: "text-chart-3",
    },
    {
      title: "Active Plans",
      value: "130", // Changed from "35" to "130"
      icon: FileText,
      color: "text-chart-4",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div key={metric.title} className="space-y-2">
              <div className="flex items-center gap-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </div>
              <p className="text-3xl font-bold">{metric.value}</p>
              {metric.subtitle && <p className="text-xs text-muted-foreground">{metric.subtitle}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
