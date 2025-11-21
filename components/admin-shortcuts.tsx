import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, ToggleLeft, BarChart3 } from "lucide-react"

export function AdminShortcuts() {
  const shortcuts = [
    { label: "Manage Users", icon: Users },
    { label: "Manage Plans", icon: FileText },
    { label: "Feature Toggles", icon: ToggleLeft },
    { label: "Reports", icon: BarChart3 },
  ]

  return (
    null
  )
}
