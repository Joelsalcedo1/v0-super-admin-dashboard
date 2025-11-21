import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export function ServicesStats() {
  const services = [
    { name: "PayShift", active: 142, total: 150 },
    { name: "Payee Onboarding", active: 138, total: 150 },
    { name: "Print & Mail", active: 89, total: 150 },
    { name: "ACH Remittance", active: 125, total: 150 },
    { name: "Digital Checks", active: 103, total: 150 },
    { name: "Bank Verification", active: 147, total: 150 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Statistics</CardTitle>
        <CardDescription>Companies with active paid services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => {
            const percentage = Math.round((service.active / service.total) * 100)
            return (
              <div key={service.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {service.active}/{service.total}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
