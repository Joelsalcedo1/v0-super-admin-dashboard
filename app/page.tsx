"use client"

import { Bell, User, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "@/components/global-search"
import { OverviewMetrics } from "@/components/overview-metrics"
import { PaymentsDisbursed } from "@/components/payments-disbursed"
import { PlanDistributionChart } from "@/components/plan-distribution-chart"
import { ServicesStats } from "@/components/services-stats"
import { RecentCompanies } from "@/components/recent-companies"
import { AdminShortcuts } from "@/components/admin-shortcuts"
import { NotificationsPanel } from "@/components/notifications-panel"
import { DailyDigestModal } from "@/components/daily-digest-modal"
import { useState } from "react"

export default function SuperAdminDashboard() {
  const [showDailyDigestSettings, setShowDailyDigestSettings] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-balance">Super Admin Dashboard</h1>

            <div className="flex items-center gap-4 flex-1 max-w-2xl justify-end">
              <GlobalSearch />

              <Button variant="ghost" onClick={() => setShowDailyDigestSettings(true)} className="gap-2">
                <Mail className="h-5 w-5" />
                Daily Digest
              </Button>

              <Button variant="ghost" className="gap-2 relative">
                <Bell className="h-5 w-5" />
                Notifications
                <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
              </Button>

              <Button variant="ghost" className="gap-2">
                <User className="h-5 w-5" />
                User
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Overview Metrics */}
            <OverviewMetrics />

            <PaymentsDisbursed />

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlanDistributionChart />
              <ServicesStats />
            </div>

            {/* Recent Companies - Moved to bottom */}
            <RecentCompanies />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <AdminShortcuts />
            <NotificationsPanel />
          </div>
        </div>
      </main>

      <DailyDigestModal open={showDailyDigestSettings} onOpenChange={setShowDailyDigestSettings} />
    </div>
  )
}
