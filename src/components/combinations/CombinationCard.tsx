'use client'

import { Badge, getHookBadgeVariant } from '@/components/ui/Badge'
import { formatPercent } from '@/lib/utils'
import { classifyHookRate, classifyHoldRate } from '@/lib/metrics'
import type { CombinationSuggestion } from '@/lib/types'
import Link from 'next/link'

interface CombinationCardProps {
  combination: CombinationSuggestion
}

export function CombinationCard({ combination: c }: CombinationCardProps) {
  const hookHookClass = classifyHookRate(c.hookDonorLog.hook_rate)
  const hookHoldClass = classifyHoldRate(c.hookDonorLog.hold_rate)
  const holdHookClass = classifyHookRate(c.holdDonorLog.hook_rate)
  const holdHoldClass = classifyHoldRate(c.holdDonorLog.hold_rate)

  const criteriaItems = [
    { label: 'Mesmo ângulo', met: c.criteria.sameAngle },
    { label: 'Mesmo tipo', met: c.criteria.sameCreativeType },
    { label: 'Duração parecida', met: c.criteria.similarDuration },
    { label: 'Mesmo hook_type', met: c.criteria.sameHookType },
    { label: 'Mesma hold_structure', met: c.criteria.sameHoldStructure },
    { label: 'Mesmo nicho', met: c.criteria.sameNiche },
    { label: 'Ambos recentes', met: c.criteria.bothRecent },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-bold">
            {c.compatibilityScore}%
          </div>
          <span className="text-sm text-gray-500">Compatibilidade</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Hook Donor */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-xs text-orange-600 font-medium mb-1">HOOK DONOR</div>
          <Link
            href={`/creatives/${c.hookDonor.id}`}
            className="text-sm font-semibold text-gray-900 hover:text-blue-600"
          >
            {c.hookDonor.name}
          </Link>
          <div className="flex gap-2 mt-2">
            <div className="text-xs">
              Hook: {formatPercent(c.hookDonorLog.hook_rate)}{' '}
              <Badge variant={getHookBadgeVariant(hookHookClass)}>{hookHookClass}</Badge>
            </div>
          </div>
          <div className="text-xs mt-1">
            Hold: {formatPercent(c.hookDonorLog.hold_rate)}{' '}
            <Badge variant={getHookBadgeVariant(hookHoldClass)}>{hookHoldClass}</Badge>
          </div>
        </div>

        {/* Hold Donor */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-xs text-green-600 font-medium mb-1">HOLD DONOR</div>
          <Link
            href={`/creatives/${c.holdDonor.id}`}
            className="text-sm font-semibold text-gray-900 hover:text-blue-600"
          >
            {c.holdDonor.name}
          </Link>
          <div className="text-xs mt-2">
            Hook: {formatPercent(c.holdDonorLog.hook_rate)}{' '}
            <Badge variant={getHookBadgeVariant(holdHookClass)}>{holdHookClass}</Badge>
          </div>
          <div className="text-xs mt-1">
            Hold: {formatPercent(c.holdDonorLog.hold_rate)}{' '}
            <Badge variant={getHookBadgeVariant(holdHoldClass)}>{holdHoldClass}</Badge>
          </div>
        </div>
      </div>

      {/* Suggestion Text */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-700">{c.suggestionText}</p>
      </div>

      {/* Criteria */}
      <div className="flex flex-wrap gap-2">
        {criteriaItems.map((item) => (
          <span
            key={item.label}
            className={`text-xs px-2 py-1 rounded-full ${
              item.met
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {item.met ? '✓' : '✗'} {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
