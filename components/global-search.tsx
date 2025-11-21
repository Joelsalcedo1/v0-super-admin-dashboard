"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Building2, DollarSign, Hash, Printer, FileText, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const SEARCH_CATEGORIES = [
  { id: "name", label: "Names", icon: Users },
  { id: "payment", label: "Payments", icon: DollarSign },
  { id: "amount", label: "Amounts", icon: DollarSign },
  { id: "id", label: "IDs", icon: Hash },
  { id: "printer", label: "Printers", icon: Printer },
  { id: "company", label: "Companies", icon: Building2 },
  { id: "batch", label: "Batches", icon: FileText },
]

const DUMMY_RESULTS = {
  name: [
    { id: "1", name: "Paula Lagos", subtitle: "PLAGOS", initials: "PL" },
    { id: "2", name: "Juan Pablo Ardila Otero", subtitle: "JPARDILA", initials: "JO" },
    { id: "3", name: "Gabriela y Paula", subtitle: "Team Lead", initials: "GP" },
  ],
  company: [
    { id: "1", name: "Acme Corporation", subtitle: "150 employees", initials: "AC" },
    { id: "2", name: "TechStart Inc", subtitle: "5 users", initials: "TS" },
    { id: "3", name: "Global Dynamics", subtitle: "320 employees", initials: "GD" },
  ],
  payment: [
    { id: "1", name: "PAY-12345", subtitle: "$12,500.00 • Check" },
    { id: "2", name: "PAY-12346", subtitle: "$5,670.00 • ACH" },
    { id: "3", name: "PAY-12347", subtitle: "$9,012.00 • Digital Check" },
  ],
  batch: [
    {
      id: "1",
      name: "BATCH-001",
      subtitle: "Parking Lot: Grooming + Enhanced ACH",
      members: "Gabriela, Juan, Roberto, +3",
    },
    { id: "2", name: "BATCH-002", subtitle: "Weekly Payroll Processing", members: "Paula, Santiago, +5" },
  ],
  printer: [
    { id: "1", name: "All TEAM PRINTECH", subtitle: "Paula, Accounting, +11", initials: "A" },
    { id: "2", name: "[HOL] Grooming session Part II", subtitle: "Active session", initials: "H" },
  ],
}

export function GlobalSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(SEARCH_CATEGORIES.map((cat) => cat.id))
  const [showResults, setShowResults] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleSearch = () => {
    if (searchQuery.trim() && selectedCategories.length > 0) {
      const params = new URLSearchParams({
        q: searchQuery,
        categories: selectedCategories.join(","),
      })
      router.push(`/search?${params.toString()}`)
      setShowResults(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getFilteredResults = () => {
    if (!searchQuery.trim()) return {}

    const filtered: Record<string, any[]> = {}
    const query = searchQuery.toLowerCase()

    selectedCategories.forEach((categoryId) => {
      const categoryData = DUMMY_RESULTS[categoryId as keyof typeof DUMMY_RESULTS]
      if (categoryData) {
        const matches = categoryData.filter(
          (item) => item.name.toLowerCase().includes(query) || item.subtitle?.toLowerCase().includes(query),
        )

        if (matches.length > 0) {
          filtered[categoryId] = matches.slice(0, 3) // Show max 3 results per category
        }
      }
    })

    return filtered
  }

  const filteredResults = getFilteredResults()
  const hasResults = Object.keys(filteredResults).length > 0

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <div className={`relative rounded-md transition-all duration-300 ${isFocused ? "rainbow-border" : ""}`}>
        <div className="relative bg-background rounded-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            placeholder="Global Search"
            className="pl-10 pr-10 bg-background border-border"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowResults(e.target.value.trim().length > 0)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true)
              searchQuery.trim().length > 0 && setShowResults(true)
            }}
            onBlur={() => setIsFocused(false)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 z-10"
              onClick={() => {
                setSearchQuery("")
                setShowResults(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-lg shadow-lg max-h-[600px] overflow-y-auto z-50">
          <div className="p-3">
            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {SEARCH_CATEGORIES.map((category) => {
                const Icon = category.icon
                const isSelected = selectedCategories.includes(category.id)
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {category.label}
                  </button>
                )
              })}
            </div>

            {hasResults ? (
              <div className="space-y-4">
                {Object.entries(filteredResults).map(([categoryId, results]) => {
                  const category = SEARCH_CATEGORIES.find((cat) => cat.id === categoryId)
                  if (!category) return null

                  return (
                    <div key={categoryId}>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{category.label}</h3>
                      <div className="space-y-1">
                        {results.map((result) => (
                          <button
                            key={result.id}
                            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
                            onClick={() => {
                              console.log("[v0] Selected result:", result)
                              setShowResults(false)
                            }}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {result.initials || result.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{result.name}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {result.subtitle}
                                {result.members && ` • ${result.members}`}
                              </div>
                            </div>
                            {result.date && <div className="text-xs text-muted-foreground">{result.date}</div>}
                          </button>
                        ))}
                      </div>
                      {categoryId !== Object.keys(filteredResults)[Object.keys(filteredResults).length - 1] && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">No results found for "{searchQuery}"</div>
            )}

            {hasResults && (
              <>
                <Separator className="my-3" />
                <Button
                  variant="ghost"
                  className="w-full text-primary hover:text-primary hover:bg-primary/10"
                  onClick={handleSearch}
                >
                  View all results
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
