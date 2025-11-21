"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Settings2 } from 'lucide-react'
import { useState } from "react"

interface DailyDigestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DailyDigestModal({ open, onOpenChange }: DailyDigestModalProps) {
  const [digestConfig, setDigestConfig] = useState({
    enabled: true,
    recipients: "admin@company.com",
    sendTime: "08:00",
    frequency: "daily",
    includePendingPayments: true,
    includeInProgressPayments: true,
    includeFraudulentPayments: true,
    includePendingOnboarding: true,
  })

  const handleSaveDigestConfig = () => {
    console.log("[v0] Saving daily digest config:", digestConfig)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Daily Digest Email Configuration
          </DialogTitle>
          <DialogDescription>
            Receive automated email reports every morning with key metrics about payments and onboarding status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="enabled"
                  checked={digestConfig.enabled}
                  onCheckedChange={(checked) => setDigestConfig({ ...digestConfig, enabled: checked as boolean })}
                />
                <label htmlFor="enabled" className="text-sm font-semibold cursor-pointer">
                  Enable Daily Digest Emails
                </label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Automatically send summary reports to specified recipients
              </p>
            </div>
            <Badge variant={digestConfig.enabled ? "default" : "secondary"}>
              {digestConfig.enabled ? "Active" : "Disabled"}
            </Badge>
          </div>

          <div className="space-y-4 border-t pt-6">
            {/* Recipients */}
            <div className="space-y-2">
              <Label htmlFor="recipients" className="flex items-center gap-2">
                Email Recipients
                <span className="text-xs text-muted-foreground font-normal">(comma-separated)</span>
              </Label>
              <Input
                id="recipients"
                type="text"
                placeholder="admin@company.com, manager@company.com"
                value={digestConfig.recipients}
                onChange={(e) => setDigestConfig({ ...digestConfig, recipients: e.target.value })}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                All specified email addresses will receive the daily digest
              </p>
            </div>

            {/* Send Time and Frequency in a grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sendTime">Send Time</Label>
                <Input
                  id="sendTime"
                  type="time"
                  value={digestConfig.sendTime}
                  onChange={(e) => setDigestConfig({ ...digestConfig, sendTime: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Local timezone</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={digestConfig.frequency}
                  onValueChange={(value) => setDigestConfig({ ...digestConfig, frequency: value })}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly (Mondays)</SelectItem>
                    <SelectItem value="monthly">Monthly (1st)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* What to Include */}
          <div className="space-y-4 border-t pt-6">
            <div>
              <Label className="text-base">Metrics to Include in Report</Label>
              <p className="text-xs text-muted-foreground mt-1">Select which information to include in the email</p>
            </div>

            <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="includePendingPayments"
                  checked={digestConfig.includePendingPayments}
                  onCheckedChange={(checked) =>
                    setDigestConfig({ ...digestConfig, includePendingPayments: checked as boolean })
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="includePendingPayments" className="text-sm font-medium cursor-pointer">
                    Pending Payments
                  </label>
                  <p className="text-xs text-muted-foreground">Count of payments pending for 30+ days</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="includeInProgressPayments"
                  checked={digestConfig.includeInProgressPayments}
                  onCheckedChange={(checked) =>
                    setDigestConfig({ ...digestConfig, includeInProgressPayments: checked as boolean })
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="includeInProgressPayments" className="text-sm font-medium cursor-pointer">
                    In Progress Payments
                  </label>
                  <p className="text-xs text-muted-foreground">Payments disbursed but not yet cleared</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="includeFraudulentPayments"
                  checked={digestConfig.includeFraudulentPayments}
                  onCheckedChange={(checked) =>
                    setDigestConfig({ ...digestConfig, includeFraudulentPayments: checked as boolean })
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="includeFraudulentPayments" className="text-sm font-medium cursor-pointer">
                    Flagged as Fraudulent
                  </label>
                  <p className="text-xs text-muted-foreground">Payments requiring fraud review</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="includePendingOnboarding"
                  checked={digestConfig.includePendingOnboarding}
                  onCheckedChange={(checked) =>
                    setDigestConfig({ ...digestConfig, includePendingOnboarding: checked as boolean })
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="includePendingOnboarding" className="text-sm font-medium cursor-pointer">
                    Pending Onboarding
                  </label>
                  <p className="text-xs text-muted-foreground">Companies awaiting onboarding completion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview section */}
          <div className="border-t pt-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Email Preview</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Recipients will receive a summary at {digestConfig.sendTime} {digestConfig.frequency} including{" "}
                    {[
                      digestConfig.includePendingPayments && "pending payments",
                      digestConfig.includeInProgressPayments && "in-progress payments",
                      digestConfig.includeFraudulentPayments && "fraudulent payments",
                      digestConfig.includePendingOnboarding && "pending onboarding",
                    ]
                      .filter(Boolean)
                      .join(", ") || "no metrics (please select at least one)"}
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDigestConfig} className="gap-2">
              <Settings2 className="h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
