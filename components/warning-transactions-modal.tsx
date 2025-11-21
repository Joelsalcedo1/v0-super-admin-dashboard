"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Filter, Settings2, GripVertical, ChevronUp, ChevronDown, ChevronRight, ExternalLink } from "lucide-react"

interface WarningTransactionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ColumnConfig = {
  id: string
  label: string
  visible: boolean
}

export function WarningTransactionsModal({ open, onOpenChange }: WarningTransactionsModalProps) {
  const transactions = [
    {
      id: "1",
      company: "Acme Corporation",
      paymentId: "12345",
      type: "Check",
      payee: "New Vendor LLC",
      amount: "$125,000.00",
      date: "2024-01-15",
      reason: "Amount significantly higher than usual",
      riskLevel: "high",
    },
    {
      id: "2",
      company: "TechStart Inc",
      paymentId: "12346",
      type: "Digital Check",
      payee: "Unknown Entity",
      amount: "$85,000.00",
      date: "2024-01-14",
      reason: "New/different payee information",
      riskLevel: "high",
    },
    {
      id: "3",
      company: "Global Dynamics",
      paymentId: "12347",
      type: "ACH",
      payee: "Regular Supplier Co",
      amount: "$45,000.00",
      date: "2024-01-13",
      reason: "Amount higher than usual",
      riskLevel: "medium",
    },
  ]

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "company", label: "Company", visible: true },
    { id: "paymentId", label: "Payment ID / Type", visible: true },
    { id: "payee", label: "Payee", visible: true },
    { id: "amount", label: "Amount", visible: true },
    { id: "date", label: "Date", visible: true },
    { id: "reason", label: "Risk Reason", visible: true },
    { id: "riskLevel", label: "Risk Level", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ])

  const [expandedFilters, setExpandedFilters] = useState<{ [key: string]: boolean }>({
    company: true,
    riskLevel: false,
    reason: false,
  })

  const [filters, setFilters] = useState({
    companies: [] as string[],
    riskLevels: [] as string[],
    reasons: [] as string[],
  })

  const companies = Array.from(new Set(transactions.map((t) => t.company)))
  const riskLevels = ["High", "Medium", "Low"]
  const reasons = Array.from(new Set(transactions.map((t) => t.reason)))

  const toggleFilterSection = (section: string) => {
    setExpandedFilters((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.companies.length > 0 && !filters.companies.includes(transaction.company)) return false
    if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(transaction.riskLevel)) return false
    if (filters.reasons.length > 0 && !filters.reasons.includes(transaction.reason)) return false
    return true
  })

  const getCellValue = (transaction: (typeof transactions)[0], columnId: string) => {
    if (columnId === "paymentId") {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{transaction.paymentId}</span>
          <span className="text-xs text-muted-foreground">{transaction.type}</span>
        </div>
      )
    }
    if (columnId === "riskLevel") {
      return (
        <Badge variant={transaction.riskLevel === "high" ? "destructive" : "secondary"}>
          {transaction.riskLevel.toUpperCase()}
        </Badge>
      )
    }
    if (columnId === "actions") {
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => window.open("https://cashcloud.com", "_blank")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Go to CashCloud
          </Button>
          <Button variant="ghost" size="sm">
            Ignore
          </Button>
        </div>
      )
    }
    if (columnId === "date") {
      return new Date(transaction.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }
    return transaction[columnId as keyof typeof transaction]
  }

  const moveColumn = (index: number, direction: "up" | "down") => {
    const newColumns = [...columns]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newColumns.length) return
    ;[newColumns[index], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[index]]
    setColumns(newColumns)
  }

  const toggleColumnVisibility = (columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, visible: !col.visible } : col)))
  }

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[category] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      return { ...prev, [category]: newValues }
    })
  }

  const clearFilters = () => {
    setFilters({
      companies: [],
      riskLevels: [],
      reasons: [],
    })
  }

  const [manageColumnsOpen, setManageColumnsOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const handleManageColumnsOpenChange = (open: boolean) => {
    console.log("[v0] Manage Columns open change:", open)
    setManageColumnsOpen(open)
  }

  const handleFiltersOpenChange = (open: boolean) => {
    console.log("[v0] Filters open change:", open)
    setFiltersOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] min-w-[1200px] max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Warning Transactions</DialogTitle>
              <DialogDescription>Transactions flagged for potential fraud or unusual activity</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Popover open={manageColumnsOpen} onOpenChange={handleManageColumnsOpenChange} modal={false}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Settings2 className="h-4 w-4" />
                    Manage Columns
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 z-[200]"
                  align="end"
                  sideOffset={5}
                  onInteractOutside={(e) => {
                    e.preventDefault()
                    setManageColumnsOpen(false)
                  }}
                >
                  <div className="space-y-4">
                    <h4 className="font-medium">Manage Columns</h4>
                    <div className="space-y-2">
                      {columns.map((column, index) => (
                        <div
                          key={column.id}
                          className="flex items-center justify-between gap-2 p-2 rounded hover:bg-muted"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <Checkbox
                              id={`column-${column.id}`}
                              checked={column.visible}
                              onCheckedChange={() => toggleColumnVisibility(column.id)}
                            />
                            <label htmlFor={`column-${column.id}`} className="text-sm cursor-pointer flex-1">
                              {column.label}
                            </label>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => moveColumn(index, "up")}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => moveColumn(index, "down")}
                              disabled={index === columns.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={filtersOpen} onOpenChange={handleFiltersOpenChange} modal={false}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 max-h-[500px] overflow-y-auto z-[200]"
                  align="end"
                  sideOffset={5}
                  onInteractOutside={(e) => {
                    e.preventDefault()
                    setFiltersOpen(false)
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear all
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="border-b pb-3">
                        <button
                          onClick={() => toggleFilterSection("company")}
                          className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-foreground transition-colors"
                        >
                          <span>Company</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${expandedFilters.company ? "rotate-90" : ""}`}
                          />
                        </button>
                        {expandedFilters.company && (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {companies.map((company) => (
                              <div key={company} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`company-${company}`}
                                  checked={filters.companies.includes(company)}
                                  onCheckedChange={() => toggleFilter("companies", company)}
                                />
                                <label htmlFor={`company-${company}`} className="text-sm cursor-pointer">
                                  {company}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-b pb-3">
                        <button
                          onClick={() => toggleFilterSection("riskLevel")}
                          className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-foreground transition-colors"
                        >
                          <span>Risk Level</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${expandedFilters.riskLevel ? "rotate-90" : ""}`}
                          />
                        </button>
                        {expandedFilters.riskLevel && (
                          <div className="space-y-2">
                            {riskLevels.map((level) => (
                              <div key={level} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`level-${level}`}
                                  checked={filters.riskLevels.includes(level.toLowerCase())}
                                  onCheckedChange={() => toggleFilter("riskLevels", level.toLowerCase())}
                                />
                                <label htmlFor={`level-${level}`} className="text-sm cursor-pointer">
                                  {level}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <button
                          onClick={() => toggleFilterSection("reason")}
                          className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-foreground transition-colors"
                        >
                          <span>Risk Reason</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${expandedFilters.reason ? "rotate-90" : ""}`}
                          />
                        </button>
                        {expandedFilters.reason && (
                          <div className="space-y-2">
                            {reasons.map((reason) => (
                              <div key={reason} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`reason-${reason}`}
                                  checked={filters.reasons.includes(reason)}
                                  onCheckedChange={() => toggleFilter("reasons", reason)}
                                />
                                <label htmlFor={`reason-${reason}`} className="text-sm cursor-pointer">
                                  {reason}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4 overflow-x-visible min-w-full">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                {columns
                  .filter((col) => col.visible)
                  .map((column) => (
                    <TableHead key={column.id} className="whitespace-nowrap">
                      {column.label}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  {columns
                    .filter((col) => col.visible)
                    .map((column) => (
                      <TableCell key={column.id} className="whitespace-nowrap">
                        {getCellValue(transaction, column.id)}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
