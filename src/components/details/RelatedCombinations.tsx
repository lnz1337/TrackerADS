'use client'

import { CombinationCard } from '@/components/combinations/CombinationCard'
import type { CombinationSuggestion } from '@/lib/types'
import Link from 'next/link'

interface RelatedCombinationsProps {
  combinations: CombinationSuggestion[]
}

export function RelatedCombinations({ combinations }: RelatedCombinationsProps) {
  if (combinations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        Nenhuma combinação relacionada a este criativo.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Combinações Relacionadas</h3>
        <Link href="/combinations" className="text-sm text-blue-600 hover:underline">
          Ver todas
        </Link>
      </div>
      {combinations.slice(0, 5).map((combo, i) => (
        <CombinationCard key={`${combo.hookDonor.id}-${combo.holdDonor.id}-${i}`} combination={combo} />
      ))}
    </div>
  )
}
