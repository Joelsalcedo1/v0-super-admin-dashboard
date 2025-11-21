"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Eye,
  Filter,
  ExternalLink,
  Settings2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

type ColumnConfig = {
  id: string
  label: string
  visible: boolean
}

export function RecentCompanies() {
  const [selectedCompany, setSelectedCompany] = useState<{
    name: string
    status: "yellow" | "red"
    issues: string[]
  } | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "name", label: "Company Name", visible: true },
    { id: "payees", label: "# of Payees", visible: true },
    { id: "transactions", label: "Transactions (30d)", visible: true },
    { id: "health", label: "Health Check", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ])

  const companies = [
    {
      name: "Acme Corporation",
      payees: 150,
      transactions: 1245,
      transactionBreakdown: {
        ach: 450,
        check: 320,
        digitalCheck: 475,
        total: 1245,
      },
      healthStatus: "green" as const,
    },
    {
      name: "TechStart Inc",
      payees: 45,
      transactions: 0,
      transactionBreakdown: {
        ach: 0,
        check: 0,
        digitalCheck: 0,
        total: 0,
      },
      healthStatus: "yellow" as const,
      issues: [
        "Data import pending for 3 days",
        "2 signatures missing on recent documents",
        "Payment processing delayed by 24 hours",
      ],
    },
    {
      name: "Global Dynamics",
      payees: 892,
      transactions: 5678,
      transactionBreakdown: {
        ach: 2100,
        check: 1890,
        digitalCheck: 1688,
        total: 5678,
      },
      healthStatus: "green" as const,
    },
    {
      name: "Innovate Labs",
      payees: 234,
      transactions: 1890,
      transactionBreakdown: {
        ach: 780,
        check: 560,
        digitalCheck: 550,
        total: 1890,
      },
      healthStatus: "red" as const,
      issues: [
        "Critical: Printer offline for 5+ days",
        "Critical: 15 payments pending over 30 days",
        "Data import failed - requires immediate attention",
        "Output status error - system not responding",
        "Multiple signature requests expired",
      ],
    },
    {
      name: "Future Systems",
      payees: 67,
      transactions: 234,
      transactionBreakdown: {
        ach: 89,
        check: 78,
        digitalCheck: 67,
        total: 234,
      },
      healthStatus: "green" as const,
    },
    {
      name: "Quantum Tech",
      payees: 320,
      transactions: 2890,
      transactionBreakdown: {
        ach: 1100,
        check: 890,
        digitalCheck: 900,
        total: 2890,
      },
      healthStatus: "green" as const,
    },
    {
      name: "Nexus Solutions",
      payees: 156,
      transactions: 1456,
      transactionBreakdown: {
        ach: 600,
        check: 456,
        digitalCheck: 400,
        total: 1456,
      },
      healthStatus: "yellow" as const,
      issues: ["Payment batch delayed by 12 hours", "1 signature pending approval"],
    },
    {
      name: "Apex Industries",
      payees: 445,
      transactions: 3567,
      transactionBreakdown: {
        ach: 1500,
        check: 1067,
        digitalCheck: 1000,
        total: 3567,
      },
      healthStatus: "green" as const,
    },
    {
      name: "Stellar Corp",
      payees: 89,
      transactions: 678,
      transactionBreakdown: {
        ach: 250,
        check: 228,
        digitalCheck: 200,
        total: 678,
      },
      healthStatus: "green" as const,
    },
    {
      name: "Zenith Enterprises",
      payees: 567,
      transactions: 4234,
      transactionBreakdown: {
        ach: 1800,
        check: 1434,
        digitalCheck: 1000,
        total: 4234,
      },
      healthStatus: "green" as const,
    },
    {
      name: "Pinnacle Group",
      payees: 234,
      transactions: 1890,
      transactionBreakdown: {
        ach: 700,
        check: 590,
        digitalCheck: 600,
        total: 1890,
      },
      healthStatus: "red" as const,
      issues: ["Critical: System integration error", "Multiple failed payment attempts"],
    },
  ]

  const totalPages = Math.ceil(companies.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedCompanies = companies.slice(startIndex, endIndex)

  const getHealthLabel = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green":
        return "On track"
      case "yellow":
        return "Warning"
      case "red":
        return "Critical errors"
    }
  }

  const getHealthTooltip = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green":
        return "On track"
      case "yellow":
        return "Warning"
      case "red":
        return "Critical errors"
    }
  }

  const getHealthColor = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green":
        return "bg-green-500"
      case "yellow":
        return "bg-yellow-500"
      case "red":
        return "bg-red-500"
    }
  }

  const handleRowClick = (company: any) => {
    if (company.healthStatus === "yellow" || company.healthStatus === "red") {
      setSelectedCompany({
        name: company.name,
        status: company.healthStatus,
        issues: company.issues || [],
      })
    }
  }

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, visible: !col.visible } : col)))
  }

  const moveColumn = (columnId: string, direction: "up" | "down") => {
    const index = columns.findIndex((col) => col.id === columnId)
    if ((direction === "up" && index === 0) || (direction === "down" && index === columns.length - 1)) {
      return
    }

    const newColumns = [...columns]
    const newIndex = direction === "up" ? index - 1 : index + 1
    ;[newColumns[index], newColumns[newIndex]] = [newColumns[newIndex], newColumns[index]]
    setColumns(newColumns)
  }

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1))
  const goToNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1))

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing rows per page
  }

  const renderColumnContent = (columnId: string, company: any) => {
    switch (columnId) {
      case "name":
        return <td className="py-4 font-medium whitespace-nowrap px-2 tracking-normal">{company.name}</td>
      case "payees":
        return <td className="py-4 px-2 text-muted-foreground whitespace-nowrap">{company.payees}</td>
      case "transactions":
        return (
          <td className="py-4 px-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 whitespace-nowrap">
                ACH: {company.transactionBreakdown.ach}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                Check: {company.transactionBreakdown.check}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                Digital check: {company.transactionBreakdown.digitalCheck}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-foreground border border-border whitespace-nowrap">
                {company.transactionBreakdown.total}
              </span>
            </div>
          </td>
        )
      case "health":
        return (
          <td className="py-4 px-2 whitespace-nowrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <div className={`h-3 w-3 rounded-full ${getHealthColor(company.healthStatus)}`} />
                    <span className="text-sm">{getHealthLabel(company.healthStatus)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getHealthTooltip(company.healthStatus)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </td>
        )
      case "actions":
        return (
          <td className="py-4 px-2 whitespace-nowrap">
            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log("[v0] View clicked for", company.name)
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log("[v0] Go to CashCloud clicked for", company.name)
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to CashCloud
              </Button>
            </div>
          </td>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>All Companies</CardTitle>
              <CardDescription>Latest company activity and status updates</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters + sorting
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Manage Columns
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Column Visibility</h4>
                      <div className="space-y-2">
                        {columns.map((column) => (
                          <div key={column.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={column.id}
                                checked={column.visible}
                                onCheckedChange={() => toggleColumnVisibility(column.id)}
                              />
                              <label htmlFor={column.id} className="text-sm cursor-pointer">
                                {column.label}
                              </label>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveColumn(column.id, "up")}
                                disabled={columns.indexOf(column) === 0}
                              >
                                ↑
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveColumn(column.id, "down")}
                                disabled={columns.indexOf(column) === columns.length - 1}
                              >
                                ↓
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {columns
                    .filter((col) => col.visible)
                    .map((column) => (
                      <th
                        key={column.id}
                        className={`text-left py-3 px-2 text-sm font-medium text-muted-foreground ${
                          column.id === "actions" ? "text-right" : ""
                        }`}
                      >
                        {column.label}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {paginatedCompanies.map((company, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border last:border-0 ${
                      company.healthStatus === "yellow" || company.healthStatus === "red"
                        ? "cursor-pointer hover:bg-muted/50"
                        : ""
                    }`}
                    onClick={(e) => {
                      const target = e.target as HTMLElement
                      if (!target.closest("button") && !target.closest('[role="menuitem"]')) {
                        handleRowClick(company)
                      }
                    }}
                  >
                    {columns.filter((col) => col.visible).map((column) => renderColumnContent(column.id, company))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-4">
                Showing {startIndex + 1}-{Math.min(endIndex, companies.length)} of {companies.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={goToFirstPage} disabled={currentPage === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToLastPage} disabled={currentPage === totalPages}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCompany?.status === "red" ? "Critical Errors" : "Warnings"} - {selectedCompany?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedCompany?.status === "red"
                ? "The following critical issues require immediate attention"
                : "The following warnings should be addressed soon"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedCompany?.issues.map((issue, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  selectedCompany.status === "red"
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                      selectedCompany.status === "red" ? "bg-red-500" : "bg-yellow-500"
                    }`}
                  />
                  <p className="text-sm">{issue}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
