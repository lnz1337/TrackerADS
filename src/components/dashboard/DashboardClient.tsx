'use client'

import { useState, useMemo } from 'react'
import { DashboardFilters, type FilterValues } from './DashboardFilters'
import { CreativesTable, type SortField } from './CreativesTable'
import type { DashboardCreative } from '@/lib/types'

interface DashboardClientProps {
  creatives: DashboardCreative[]
}

export function DashboardClient({ creatives }: DashboardClientProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    platform: '',
    offer: '',
    region: '',
    status: '',
    angle: '',
    creativeType: '',
    dateFrom: '',
    dateTo: '',
  })
  const [sortField, setSortField] = useState<SortField>('score_desc')

  // Extract unique values for filter dropdowns
  const offers = useMemo(
    () => Array.from(new Set(creatives.map((c) => c.creative.offer_name))).sort(),
    [creatives]
  )
  const regions = useMemo(
    () => Array.from(new Set(creatives.map((c) => c.creative.region).filter(Boolean) as string[])).sort(),
    [creatives]
  )
  const angles = useMemo(
    () => Array.from(new Set(creatives.map((c) => c.creative.angle).filter(Boolean) as string[])).sort(),
    [creatives]
  )
  const creativeTypes = useMemo(
    () =>
      Array.from(new Set(creatives.map((c) => c.creative.creative_type).filter(Boolean) as string[])).sort(),
    [creatives]
  )

  // Apply filters
  const filtered = useMemo(() => {
    return creatives.filter((dc) => {
      if (filters.search && !dc.creative.name.toLowerCase().includes(filters.search.toLowerCase()))
        return false
      if (filters.platform && dc.creative.platform !== filters.platform) return false
      if (filters.offer && dc.creative.offer_name !== filters.offer) return false
      if (filters.region && dc.creative.region !== filters.region) return false
      if (filters.status && dc.creative.status !== filters.status) return false
      if (filters.angle && dc.creative.angle !== filters.angle) return false
      if (filters.creativeType && dc.creative.creative_type !== filters.creativeType) return false
      if (filters.dateFrom && dc.latestLog) {
        if (dc.latestLog.log_date < filters.dateFrom) return false
      }
      if (filters.dateTo && dc.latestLog) {
        if (dc.latestLog.log_date > filters.dateTo) return false
      }
      return true
    })
  }, [creatives, filters])

  // Apply sorting
  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      switch (sortField) {
        case 'hook_rate':
          return (b.latestLog?.hook_rate ?? -1) - (a.latestLog?.hook_rate ?? -1)
        case 'hold_rate':
          return (b.latestLog?.hold_rate ?? -1) - (a.latestLog?.hold_rate ?? -1)
        case 'ctr':
          return (b.latestLog?.ctr ?? -1) - (a.latestLog?.ctr ?? -1)
        case 'cpc':
          return (a.latestLog?.cpc ?? Infinity) - (b.latestLog?.cpc ?? Infinity)
        case 'roas':
          return (b.latestLog?.roas ?? -1) - (a.latestLog?.roas ?? -1)
        case 'score_desc':
          return b.score - a.score
        case 'score_asc':
          return a.score - b.score
        case 'updated':
          return (b.daysSinceUpdate ?? Infinity) === (a.daysSinceUpdate ?? Infinity)
            ? 0
            : (a.daysSinceUpdate ?? Infinity) - (b.daysSinceUpdate ?? Infinity)
        default:
          return 0
      }
    })
    return arr
  }, [filtered, sortField])

  return (
    <div className="space-y-4">
      <DashboardFilters
        filters={filters}
        onFiltersChange={setFilters}
        offers={offers}
        regions={regions}
        angles={angles}
        creativeTypes={creativeTypes}
      />
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <CreativesTable
          creatives={sorted}
          sortField={sortField}
          onSortChange={setSortField}
        />
      </div>
    </div>
  )
}
