"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CreditCard, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { PendingPaymentsModal } from "./pending-payments-modal"
import { WarningTransactionsModal } from "./warning-transactions-modal"

export function NotificationsPanel() {
  const [isPendingPaymentsModalOpen, setIsPendingPaymentsModalOpen] = useState(false)
  const [isWarningTransactionsModalOpen, setIsWarningTransactionsModalOpen] = useState(false)

  const notifications = [
    {
      title: "Warning Transactions",
      count: 3,
      icon: AlertTriangle,
      variant: "destructive" as const,
      tooltip: "Transactions flagged for potential fraud or unusual activity",
      onClick: () => setIsWarningTransactionsModalOpen(true),
    },
    {
      title: "Pending Payments: 30+ days",
      count: 8,
      icon: CreditCard,
      variant: "default" as const,
      tooltip: "Payments that have been pending for more than 30 days.",
      onClick: () => setIsPendingPaymentsModalOpen(true),
    },
    {
      title: "Pending Onboarding",
      count: 5,
      icon: Clock,
      variant: "secondary" as const,
    },
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Items</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification) => (
            <TooltipProvider key={notification.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 ${
                      notification.onClick ? "cursor-pointer hover:bg-accent/50 transition-colors" : ""
                    }`}
                    onClick={notification.onClick}
                  >
                    <div className="flex items-center gap-3">
                      <notification.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{notification.title}</span>
                    </div>
                    <Badge variant={notification.variant}>{notification.count}</Badge>
                  </div>
                </TooltipTrigger>
                {notification.tooltip && (
                  <TooltipContent>
                    <p>{notification.tooltip}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </CardContent>
      </Card>

      <PendingPaymentsModal open={isPendingPaymentsModalOpen} onOpenChange={setIsPendingPaymentsModalOpen} />
      <WarningTransactionsModal open={isWarningTransactionsModalOpen} onOpenChange={setIsWarningTransactionsModalOpen} />
    </>
  )
}
