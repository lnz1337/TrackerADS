'use client'

import { CombinationCard } from './CombinationCard'
import type { CombinationSuggestion } from '@/lib/types'

interface CombinationsListProps {
  combinations: CombinationSuggestion[]
}

export function CombinationsList({ combinations }: CombinationsListProps) {
  if (combinations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        <p className="text-lg font-medium mb-2">Nenhuma combinação encontrada</p>
        <p className="text-sm">
          Combinações são sugeridas quando existem criativos Hook Donors e Hold Donors
          na mesma plataforma, oferta e região.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        {combinations.length} combinação{combinations.length !== 1 ? 'ões' : ''} encontrada{combinations.length !== 1 ? 's' : ''}
      </div>
      {combinations.map((combo, i) => (
        <CombinationCard key={`${combo.hookDonor.id}-${combo.holdDonor.id}-${i}`} combination={combo} />
      ))}
    </div>
  )
}
