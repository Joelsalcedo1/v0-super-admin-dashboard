"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Filter, Settings2, GripVertical, ChevronUp, ChevronDown, ChevronRight } from "lucide-react"

interface PendingPaymentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ColumnConfig = {
  id: string
  label: string
  visible: boolean
}

export function PendingPaymentsModal({ open, onOpenChange }: PendingPaymentsModalProps) {
  const pendingPayments = [
    {
      id: "1",
      companyName: "Acme Corporation",
      batch: "BATCH-001",
      paymentId: "PAY-12345",
      type: "ACH",
      bankAccount: "****1234",
      amount: "$5,230.00",
      timePending: "35 days",
      daysInProgress: "35 days",
      status: "Pending Approval",
    },
    {
      id: "2",
      companyName: "TechStart Inc",
      batch: "BATCH-002",
      paymentId: "PAY-12346",
      type: "Check",
      bankAccount: "****5678",
      amount: "$3,450.00",
      timePending: "42 days",
      daysInProgress: "42 days",
      status: "Pending Approval",
    },
    {
      id: "3",
      companyName: "Global Dynamics",
      batch: "BATCH-003",
      paymentId: "PAY-12347",
      type: "Digital Check",
      bankAccount: "****9012",
      amount: "$12,890.00",
      timePending: "58 days",
      daysInProgress: "58 days",
      status: "Pending Approval",
    },
    {
      id: "4",
      companyName: "Innovate Labs",
      batch: "BATCH-004",
      paymentId: "PAY-12348",
      type: "ACH",
      bankAccount: "****3456",
      amount: "$8,120.00",
      timePending: "67 days",
      daysInProgress: "67 days",
      status: "Pending Approval",
    },
    {
      id: "5",
      companyName: "Future Systems",
      batch: "BATCH-005",
      paymentId: "PAY-12349",
      type: "Check",
      bankAccount: "****7890",
      amount: "$2,340.00",
      timePending: "95 days",
      daysInProgress: "95 days",
      status: "Pending Approval",
    },
    {
      id: "6",
      companyName: "Quantum Corp",
      batch: "BATCH-006",
      paymentId: "PAY-12350",
      type: "Digital Check",
      bankAccount: "****2345",
      amount: "$15,670.00",
      timePending: "120 days",
      daysInProgress: "120 days",
      status: "Pending Approval",
    },
    {
      id: "7",
      companyName: "Nexus Industries",
      batch: "BATCH-007",
      paymentId: "PAY-12351",
      type: "ACH",
      bankAccount: "****6789",
      amount: "$4,560.00",
      timePending: "180 days",
      daysInProgress: "180 days",
      status: "Pending Approval",
    },
    {
      id: "8",
      companyName: "Stellar Enterprises",
      batch: "BATCH-008",
      paymentId: "PAY-12352",
      type: "Check",
      bankAccount: "****0123",
      amount: "$9,870.00",
      timePending: "365 days",
      daysInProgress: "365 days",
      status: "Pending Approval",
    },
  ]

  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "companyName", label: "Company Name", visible: true },
    { id: "batch", label: "Batch", visible: true },
    { id: "paymentId", label: "Payment ID", visible: true },
    { id: "type", label: "Type", visible: true },
    { id: "bankAccount", label: "Bank Account", visible: true },
    { id: "amount", label: "Amount", visible: true },
    { id: "timePending", label: "Time Pending", visible: true },
    { id: "daysInProgress", label: "Days in Progress", visible: true },
    { id: "status", label: "Status", visible: true },
  ])

  const [expandedFilters, setExpandedFilters] = useState<{ [key: string]: boolean }>({
    company: true,
    paymentType: false,
    status: false,
    timePending: false,
  })

  const [filters, setFilters] = useState({
    companies: [] as string[],
    paymentTypes: [] as string[],
    statuses: [] as string[],
    timePending: null as string | null,
    customTimePending: "" as string,
  })

  const companies = Array.from(new Set(pendingPayments.map((p) => p.companyName)))
  const paymentTypes = Array.from(new Set(pendingPayments.map((p) => p.type)))
  const statuses = Array.from(new Set(pendingPayments.map((p) => p.status)))
  const timePendingOptions = ["45 days", "90 days", "6 months", "1 year"]

  const toggleFilterSection = (section: string) => {
    setExpandedFilters((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleSelectAll = () => {
    setSelectedRows((prev) => {
      const filteredPayments = pendingPayments.filter((payment) => {
        if (filters.companies.length > 0 && !filters.companies.includes(payment.companyName)) return false
        if (filters.paymentTypes.length > 0 && !filters.paymentTypes.includes(payment.type)) return false
        if (filters.statuses.length > 0 && !filters.statuses.includes(payment.status)) return false

        if (filters.customTimePending) {
          const days = Number.parseInt(payment.timePending)
          const customDays = Number.parseInt(filters.customTimePending)
          if (days < customDays) return false
        } else if (filters.timePending) {
          const days = Number.parseInt(payment.timePending)
          if (filters.timePending === "45 days" && days < 45) return false
          if (filters.timePending === "90 days" && days < 90) return false
          if (filters.timePending === "6 months" && days < 180) return false
          if (filters.timePending === "1 year" && days < 365) return false
        }

        return true
      })

      return prev.length === filteredPayments.length ? [] : filteredPayments.map((p) => p.id)
    })
  }

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) => {
      const filteredPayments = pendingPayments.filter((payment) => {
        if (filters.companies.length > 0 && !filters.companies.includes(payment.companyName)) return false
        if (filters.paymentTypes.length > 0 && !filters.paymentTypes.includes(payment.type)) return false
        if (filters.statuses.length > 0 && !filters.statuses.includes(payment.status)) return false

        if (filters.customTimePending) {
          const days = Number.parseInt(payment.timePending)
          const customDays = Number.parseInt(filters.customTimePending)
          if (days < customDays) return false
        } else if (filters.timePending) {
          const days = Number.parseInt(payment.timePending)
          if (filters.timePending === "45 days" && days < 45) return false
          if (filters.timePending === "90 days" && days < 90) return false
          if (filters.timePending === "6 months" && days < 180) return false
          if (filters.timePending === "1 year" && days < 365) return false
        }

        return true
      })

      return prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    })
  }

  const filteredPayments = pendingPayments.filter((payment) => {
    if (filters.companies.length > 0 && !filters.companies.includes(payment.companyName)) return false
    if (filters.paymentTypes.length > 0 && !filters.paymentTypes.includes(payment.type)) return false
    if (filters.statuses.length > 0 && !filters.statuses.includes(payment.status)) return false

    if (filters.customTimePending) {
      const days = Number.parseInt(payment.timePending)
      const customDays = Number.parseInt(filters.customTimePending)
      if (days < customDays) return false
    } else if (filters.timePending) {
      const days = Number.parseInt(payment.timePending)
      if (filters.timePending === "45 days" && days < 45) return false
      if (filters.timePending === "90 days" && days < 90) return false
      if (filters.timePending === "6 months" && days < 180) return false
      if (filters.timePending === "1 year" && days < 365) return false
    }

    return true
  })

  const getCellValue = (payment: (typeof pendingPayments)[0], columnId: string) => {
    return payment[columnId as keyof typeof payment]
  }

  const isAllSelected = filteredPayments.length > 0 && selectedRows.length === filteredPayments.length
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < filteredPayments.length

  const handleSendReminders = () => {
    console.log("[v0] Sending reminders to:", selectedRows)
    // TODO: Implement send reminders logic
    setSelectedRows([])
  }

  const handleIgnore = () => {
    console.log("[v0] Ignoring payments:", selectedRows)
    // TODO: Implement ignore logic
    setSelectedRows([])
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
    if (category === "timePending") {
      setFilters((prev) => ({ ...prev, timePending: prev.timePending === value ? null : value }))
    } else {
      setFilters((prev) => {
        const currentValues = prev[category] as string[]
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value]
        return { ...prev, [category]: newValues }
      })
    }
  }

  const clearFilters = () => {
    setFilters({
      companies: [],
      paymentTypes: [],
      statuses: [],
      timePending: null,
      customTimePending: "",
    })
  }

  const selectAllCheckboxRef = useRef<HTMLButtonElement>(null)

  const [manageColumnsOpen, setManageColumnsOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeFilterCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) {
      return count + filter.length
    }
    return filter ? count + 1 : count
  }, 0)

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const checkboxElement = selectAllCheckboxRef.current.querySelector('input[type="checkbox"]')
      if (checkboxElement) {
        ;(checkboxElement as HTMLInputElement).indeterminate = isSomeSelected
      }
    }
  }, [isSomeSelected])

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
              <DialogTitle>Pending Payments: 30+ days</DialogTitle>
              <DialogDescription>Payments that have been pending for more than 30 days</DialogDescription>
            </div>
            <div className="flex items-center gap-2 pr-6">
              {selectedRows.length > 0 && (
                <div className="flex items-center gap-2 mr-2">
                  <Button onClick={handleSendReminders} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Send Reminders ({selectedRows.length})
                  </Button>
                  <Button onClick={handleIgnore} variant="outline" size="sm">
                    Ignore ({selectedRows.length})
                  </Button>
                </div>
              )}

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
                    {activeFilterCount > 0 && (
                      <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    )}
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

                      <div className="border-b pb-3">
                        <button
                          onClick={() => toggleFilterSection("status")}
                          className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-foreground transition-colors"
                        >
                          <span>Status</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${expandedFilters.status ? "rotate-90" : ""}`}
                          />
                        </button>
                        {expandedFilters.status && (
                          <div className="space-y-2">
                            {statuses.map((status) => (
                              <div key={status} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`status-${status}`}
                                  checked={filters.statuses.includes(status)}
                                  onCheckedChange={() => toggleFilter("statuses", status)}
                                />
                                <label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                                  {status}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <button
                          onClick={() => toggleFilterSection("timePending")}
                          className="flex items-center justify-between w-full text-sm font-medium mb-2 hover:text-foreground transition-colors"
                        >
                          <span>Time Pending (More than)</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${expandedFilters.timePending ? "rotate-90" : ""}`}
                          />
                        </button>
                        {expandedFilters.timePending && (
                          <div className="space-y-2">
                            {timePendingOptions.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`time-${option}`}
                                  checked={filters.timePending === option}
                                  onCheckedChange={() => toggleFilter("timePending", option)}
                                />
                                <label htmlFor={`time-${option}`} className="text-sm cursor-pointer">
                                  {option}
                                </label>
                              </div>
                            ))}
                            <div className="pt-2 border-t">
                              <Label htmlFor="custom-days" className="text-xs text-muted-foreground mb-1.5 block">
                                Or enter custom days
                              </Label>
                              <Input
                                id="custom-days"
                                type="number"
                                placeholder="Enter days..."
                                value={filters.customTimePending}
                                onChange={(e) =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    customTimePending: e.target.value,
                                    timePending: null,
                                  }))
                                }
                                className="h-8 text-sm"
                              />
                            </div>
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
                <TableHead className="w-[50px]">
                  <Checkbox
                    ref={selectAllCheckboxRef}
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
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
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(payment.id)}
                      onCheckedChange={() => toggleSelectRow(payment.id)}
                      aria-label={`Select ${payment.companyName}`}
                    />
                  </TableCell>
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
