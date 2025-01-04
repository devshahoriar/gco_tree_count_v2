'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FilterIcon, RefreshCw } from 'lucide-react'
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
} from '@/components/ui/credenza'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const Filter = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { push } = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || '',
    orderBy: searchParams.get('orderBy') || '',
    perPage: searchParams.get('perPage') || '',
  })

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams)

    // Update search params
    if (filters.search) params.set('search', filters.search)
    else params.delete('search')

    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    else params.delete('sortBy')

    if (filters.orderBy) params.set('orderBy', filters.orderBy)
    else params.delete('orderBy')

    if (filters.perPage) params.set('limit', filters.perPage)
    else params.delete('limit')

    // Reset to page 1 when filters change
    params.set('page', '1')

    push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button>
          <span className="hidden md:inline-block mr-2">Filter</span>
          <FilterIcon className="h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Filter Options</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Name, ID, Phone Number, MASTER ID"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortBy: value }))
                }
              >
                <SelectTrigger id="sortBy">
                  <SelectValue placeholder="Select sort field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="masterId">Master ID</SelectItem>
                  <SelectItem value="createdAt">Created At</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <Label htmlFor="orderBy">Order By</Label>
              <Select
                value={filters.orderBy}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, orderBy: value }))
                }
              >
                <SelectTrigger id="orderBy">
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="perPage">Items per page</Label>
            <Select
              value={filters.perPage}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, perPage: value }))
              }
            >
              <SelectTrigger id="perPage">
                <SelectValue placeholder="Select items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export default Filter

export const RefreshButton = () => {
  const { refresh } = useRouter()
  const [isRotating, setIsRotating] = useState(false)

  const handleRefresh = () => {
    setIsRotating(true)
    refresh()
    setTimeout(() => setIsRotating(false), 1500)
  }

  return (
    <Button onClick={handleRefresh}>
      <span className="hidden md:inline-block mr-2">Refresh</span>
      <RefreshCw className={`h-4 w-4 ${isRotating ? 'animate-spin' : ''}`} />
    </Button>
  )
}

