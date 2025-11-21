"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react'
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UnclearedPaymentsModal } from "./uncleared-payments-modal"

const paymentData = [
  {
    type: "Checks",
    disbursed: { count: 100, amount: 12500 },
    cleared: { count: 90, amount: 11000 },
    requireAttention: 5,
  },
  {
    type: "Digital Checks",
    disbursed: { count: 12, amount: 3200 },
    cleared: { count: 10, amount: 2800 },
    requireAttention: 1,
  },
  {
    type: "ACHs",
    disbursed: { count: 53, amount: 8900 },
    cleared: { count: 50, amount: 8400 },
    requireAttention: 2,
  },
]

const companiesData = [
  { name: "Acme Corporation", payment: 45230.5, transactions: 1245 },
  { name: "Global Dynamics", payment: 38920.0, transactions: 5678 },
  { name: "TechStart Inc", payment: 32150.75, transactions: 892 },
  { name: "Innovate Labs", payment: 28500.0, transactions: 1890 },
  { name: "Future Systems", payment: 25890.25, transactions: 234 },
]

export function PaymentsDisbursed() {
  const [sortColumn, setSortColumn] = useState<"payment" | "transactions" | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("")

  const handleSort = (column: "payment" | "transactions") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const sortedCompanies = [...companiesData].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = sortColumn === "payment" ? a.payment : a.transactions
    const bValue = sortColumn === "payment" ? b.payment : b.transactions

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue
  })

  const SortIcon = ({ column }: { column: "payment" | "transactions" }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 inline-block" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1 inline-block" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1 inline-block" />
    )
  }

  const handleDeltaClick = (paymentType: string) => {
    setSelectedPaymentType(paymentType)
    setIsModalOpen(true)
  }

  const handleDeltaHeaderClick = () => {
    setSelectedPaymentType("All")
    setIsModalOpen(true)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Payments disbursed vs. cleared</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payment type</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Disbursed</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Cleared</th>
                  <th
                    className="text-right py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={handleDeltaHeaderClick}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      In Progress
                      <Eye className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help border-b border-dotted border-muted-foreground">
                            Require attention
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] text-center">
                          <p>
                            Number of checks and digital checks that have not been cleared for more than 14 days; and
                            ACHs for more than 5 days.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((row, index) => {
                  const countDelta = row.disbursed.count - row.cleared.count
                  const amountDelta = row.disbursed.amount - row.cleared.amount

                  return (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 font-medium">{row.type}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-semibold">{row.disbursed.count}</span>
                          <span className="text-sm text-muted-foreground">
                            ${row.disbursed.amount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-semibold">{row.cleared.count}</span>
                          <span className="text-sm text-muted-foreground">${row.cleared.amount.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-semibold">{countDelta}</span>
                          <span className="text-sm text-muted-foreground">${amountDelta.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <span className="text-sm font-medium">{row.requireAttention}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Most active companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_120px_120px] gap-4 pb-3 border-b border-border text-sm font-medium text-muted-foreground">
              <div>Company Name</div>
              <div
                className="text-right cursor-pointer hover:text-foreground transition-colors flex items-center justify-end"
                onClick={() => handleSort("payment")}
              >
                Payment Amount
                <SortIcon column="payment" />
              </div>
              <div
                className="text-right cursor-pointer hover:text-foreground transition-colors flex items-center justify-end"
                onClick={() => handleSort("transactions")}
              >
                Total Transactions
                <SortIcon column="transactions" />
              </div>
            </div>

            {sortedCompanies.map((company, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_120px_120px] gap-4 py-3 items-center hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="font-medium">{company.name}</div>
                <div className="text-right text-muted-foreground">
                  ${company.payment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-right text-muted-foreground">{company.transactions.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UnclearedPaymentsModal open={isModalOpen} onOpenChange={setIsModalOpen} paymentType={selectedPaymentType} />
    </div>
  )
}
