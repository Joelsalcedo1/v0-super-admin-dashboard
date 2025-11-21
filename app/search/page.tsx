"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Dummy data for search results
const DUMMY_RESULTS = {
  name: [
    { id: 1, title: "Acme Corporation", type: "Company", description: "Active company with 150 payees" },
    { id: 2, title: "John Smith", type: "User", description: "Admin user - john.smith@acme.com" },
    { id: 3, title: "TechStart Inc", type: "Company", description: "Onboarding company with 45 payees" },
  ],
  payment: [
    { id: 1, title: "PAY-12345", type: "Payment ID", description: "ACH payment - $1,250.00 - Completed" },
    { id: 2, title: "PAY-12346", type: "Payment ID", description: "Check payment - $850.00 - Pending" },
    { id: 3, title: "PAY-12347", type: "Payment ID", description: "Digital Check - $2,100.00 - Cleared" },
  ],
  amount: [
    { id: 1, title: "$85,000", type: "Total Revenue", description: "Monthly revenue from all companies" },
    { id: 2, title: "$12,500", type: "Disbursed", description: "Checks disbursed this month" },
    { id: 3, title: "$1,867.50", type: "Commission", description: "ACH Remittance commission" },
  ],
  id: [
    { id: 1, title: "BATCH-001", type: "Batch ID", description: "Acme Corporation - 100 transactions" },
    { id: 2, title: "BATCH-002", type: "Batch ID", description: "TechStart Inc - 45 transactions" },
    { id: 3, title: "USR-789", type: "User ID", description: "Admin user account" },
  ],
  printer: [
    { id: 1, title: "Printer-A1", type: "Printer", description: "Office printer - Online - 89 prints" },
    { id: 2, title: "Printer-B2", type: "Printer", description: "Warehouse printer - Offline" },
    { id: 3, title: "Printer-C3", type: "Printer", description: "Remote printer - Online - 45 prints" },
  ],
  company: [
    { id: 1, title: "Global Dynamics", type: "Company", description: "892 payees - Onboarded - 5678 transactions" },
    { id: 2, title: "Innovate Labs", type: "Company", description: "234 payees - Onboarded - 1890 transactions" },
    { id: 3, title: "Future Systems", type: "Company", description: "67 payees - Onboarded - 234 transactions" },
  ],
  batch: [
    { id: 1, title: "BATCH-003", type: "Batch", description: "Global Dynamics - 2100 ACH transactions" },
    { id: 2, title: "BATCH-004", type: "Batch", description: "Innovate Labs - 780 Check transactions" },
    { id: 3, title: "BATCH-005", type: "Batch", description: "Future Systems - 89 Digital Check transactions" },
  ],
}

const CATEGORY_LABELS: Record<string, string> = {
  name: "Names",
  payment: "Payments",
  amount: "Amounts",
  id: "IDs",
  printer: "Printers",
  company: "Companies",
  batch: "Batches",
}

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const query = searchParams.get("q") || ""
  const categoriesParam = searchParams.get("categories") || ""
  const selectedCategories = categoriesParam.split(",").filter(Boolean)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [query, categoriesParam])

  const filteredResults = Object.entries(DUMMY_RESULTS).filter(([category]) => selectedCategories.includes(category))

  const totalResults = filteredResults.reduce((sum, [, results]) => sum + results.length, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Search Results</h1>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    Found {totalResults} results for "{query}" in {selectedCategories.length} categories
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Selected Categories */}
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary">
                {CATEGORY_LABELS[category] || category}
              </Badge>
            ))}
          </div>

          {/* Results by Category */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-16 w-full" />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResults.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search query or selecting different categories
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredResults.map(([category, results]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {CATEGORY_LABELS[category] || category}
                    <Badge variant="outline" className="ml-2">
                      {results.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{result.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {result.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{result.description}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
