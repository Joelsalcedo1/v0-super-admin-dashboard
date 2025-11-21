"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, Settings2, GripVertical, ChevronUp, ChevronDown, ChevronRight, ExternalLink } from "lucide-react"

interface UnclearedPaymentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentType: string
}

type ColumnConfig = {
  id: string
  label: string
  visible: boolean
}

export function UnclearedPaymentsModal({ open, onOpenChange, paymentType }: UnclearedPaymentsModalProps) {
  const unclearedPayments = [
    {
      id: "1",
      company: "ACME",
      paymentId: "12345",
      type: "Check",
      bankAccount: "****1234",
      payorName: "ACME Corporation",
      amount: "$2,500.00",
      payeeName: "John Smith",
      date: "2025-10-15",
      batchId: "001",
      daysInProgress: "8 days",
    },
    {
      id: "2",
      company: "Printech",
      paymentId: "12346",
      type: "Digital Check",
      bankAccount: "****5678",
      payorName: "Printech Solutions",
      amount: "$1,800.50",
      payeeName: "Jane Doe",
      date: "2025-10-16",
      batchId: "002",
      daysInProgress: "17 days",
    },
    {
      id: "3",
      company: "Ryan Bill Pay",
      paymentId: "12347",
      type: "ACH",
      bankAccount: "****9012",
      payorName: "Ryan Bill Pay Services",
      amount: "$3,200.75",
      payeeName: "Bob Johnson",
      date: "2025-10-17",
      batchId: "003",
      daysInProgress: "22 days",
    },
    {
      id: "4",
      company: "Global Dynamics",
      paymentId: "12348",
      type: "Check",
      bankAccount: "****3456",
      payorName: "Global Dynamics Inc",
      amount: "$4,500.00",
      payeeName: "Alice Williams",
      date: "2025-10-18",
      batchId: "004",
      daysInProgress: "12 days",
    },
    {
      id: "5",
      company: "TechStart Inc",
      paymentId: "12349",
      type: "Digital Check",
      bankAccount: "****7890",
      payorName: "TechStart Inc",
      amount: "$1,200.25",
      payeeName: "Charlie Brown",
      date: "2025-10-19",
      batchId: "005",
      daysInProgress: "5 days",
    },
  ]

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "company", label: "Company", visible: true },
    { id: "paymentId", label: "Payment ID / Type", visible: true },
    { id: "bankAccount", label: "Bank Account", visible: true },
    { id: "payorName", label: "Payor Name", visible: true },
    { id: "amount", label: "Amount", visible: true },
    { id: "payeeName", label: "Payee Name", visible: true },
    { id: "date", label: "Disbursed on", visible: true },
    { id: "batchId", label: "Batch #", visible: true },
    { id: "daysInProgress", label: "Days in Progress", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ])

  const [expandedFilters, setExpandedFilters] = useState<{ [key: string]: boolean }>({
    company: true,
    paymentType: false,
    daysInProgress: false,
  })

  const [filters, setFilters] = useState({
    companies: [] as string[],
    paymentTypes: [] as string[],
    daysInProgress: null as number | null,
  })

  const companies = Array.from(new Set(unclearedPayments.map((p) => p.company)))
  const paymentTypes = Array.from(new Set(unclearedPayments.map((p) => p.type)))
  const daysInProgressOptions = [15, 30, 45, 60]

  const toggleFilterSection = (section: string) => {
    setExpandedFilters((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const filteredPayments = unclearedPayments.filter((payment) => {
    if (filters.companies.length > 0 && !filters.companies.includes(payment.company)) return false
    if (filters.paymentTypes.length > 0 && !filters.paymentTypes.includes(payment.type)) return false
    if (filters.daysInProgress !== null) {
      const days = Number.parseInt(payment.daysInProgress)
      if (days < filters.daysInProgress) return false
    }
    return true
  })

  const getCellValue = (payment: (typeof unclearedPayments)[0], columnId: string) => {
    if (columnId === "paymentId") {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{payment.paymentId}</span>
          <span className="text-xs text-muted-foreground">{payment.type}</span>
        </div>
      )
    }
    if (columnId === "actions") {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => window.open("https://cashcloud.com", "_blank")}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Go to CashCloud
        </Button>
      )
    }
    return payment[columnId as keyof typeof payment]
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

  const toggleFilter = (category: keyof typeof filters, value: string | number) => {
    if (category === "daysInProgress") {
      setFilters((prev) => ({ ...prev, daysInProgress: prev.daysInProgress === value ? null : (value as number) }))
    } else {
      setFilters((prev) => {
        const currentValues = prev[category] as string[]
        const newValues = currentValues.includes(value as string)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value as string]
        return { ...prev, [category]: newValues }
      })
    }
  }

  const clearFilters = () => {
    setFilters({
      companies: [],
      paymentTypes: [],
      daysInProgress: null,
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
              <DialogTitle>
                {paymentType === "All" ? "Uncleared Payments" : `Uncleared Payments - ${paymentType}`}
              </DialogTitle>
              <DialogDescription>Payments that have been disbursed but not yet cleared</DialogDescription>
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
                          onClick={() => toggleFilterSection("paymentType")}
                          className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-foreground transition-colors"
                        >
                          <span>Payment Type</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${expandedFilters.paymentType ? "rotate-90" : ""}`}
                          />
                        </button>
                        {expandedFilters.paymentType && (
                          <div className="space-y-2">
                            {paymentTypes.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`type-${type}`}
                                  checked={filters.paymentTypes.includes(type)}
                                  onCheckedChange={() => toggleFilter("paymentTypes", type)}
                                />
                                <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                                  {type}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <button
                          onClick={() => toggleFilterSection("daysInProgress")}
                          className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-foreground transition-colors"
                        >
                          <span>Days in Progress (More than)</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${
                              expandedFilters.daysInProgress ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                        {expandedFilters.daysInProgress && (
                          <div className="space-y-2">
                            {daysInProgressOptions.map((days) => (
                              <div key={days} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`days-${days}`}
                                  checked={filters.daysInProgress === days}
                                  onCheckedChange={() => toggleFilter("daysInProgress", days)}
                                />
                                <label htmlFor={`days-${days}`} className="text-sm cursor-pointer">
                                  {days} days
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
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  {columns
                    .filter((col) => col.visible)
                    .map((column) => (
                      <TableCell key={column.id} className="whitespace-nowrap">
                        {getCellValue(payment, column.id)}
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
