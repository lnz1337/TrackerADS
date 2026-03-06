'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { PLATFORMS, STATUSES } from '@/lib/constants'

export interface FilterValues {
  search: string
  platform: string
  offer: string
  region: string
  status: string
  angle: string
  creativeType: string
  dateFrom: string
  dateTo: string
}

interface DashboardFiltersProps {
  filters: FilterValues
  onFiltersChange: (filters: FilterValues) => void
  offers: string[]
  regions: string[]
  angles: string[]
  creativeTypes: string[]
}

export function DashboardFilters({
  filters,
  onFiltersChange,
  offers,
  regions,
  angles,
  creativeTypes,
}: DashboardFiltersProps) {
  const [showMore, setShowMore] = useState(false)

  const update = (key: keyof FilterValues, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearAll = () => {
    onFiltersChange({
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
  }

  const toOpts = (arr: string[] | readonly string[]) =>
    arr.map((v) => ({ value: v, label: v }))

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          placeholder="Buscar por nome..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
        />
        <Select
          options={toOpts(PLATFORMS)}
          placeholder="Plataforma"
          value={filters.platform}
          onChange={(e) => update('platform', e.target.value)}
        />
        <Select
          options={toOpts(offers)}
          placeholder="Oferta"
          value={filters.offer}
          onChange={(e) => update('offer', e.target.value)}
        />
        <Select
          options={toOpts(STATUSES)}
          placeholder="Status"
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
        />
      </div>

      {showMore && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Select
            options={toOpts(regions)}
            placeholder="Região"
            value={filters.region}
            onChange={(e) => update('region', e.target.value)}
          />
          <Select
            options={toOpts(angles)}
            placeholder="Ângulo"
            value={filters.angle}
            onChange={(e) => update('angle', e.target.value)}
          />
          <Select
            options={toOpts(creativeTypes)}
            placeholder="Tipo de Criativo"
            value={filters.creativeType}
            onChange={(e) => update('creativeType', e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="De"
              value={filters.dateFrom}
              onChange={(e) => update('dateFrom', e.target.value)}
            />
            <Input
              type="date"
              placeholder="Até"
              value={filters.dateTo}
              onChange={(e) => update('dateTo', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setShowMore(!showMore)}>
          {showMore ? 'Menos filtros' : 'Mais filtros'}
        </Button>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          Limpar filtros
        </Button>
      </div>
    </div>
  )
}
