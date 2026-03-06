'use client'

import { Badge, getScoreBadgeVariant } from '@/components/ui/Badge'
import { formatPercent, formatCurrency, formatDecimal } from '@/lib/utils'
import type { ScoreBreakdown as ScoreBreakdownType, ScoreClassification } from '@/lib/types'

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType
  classification: ScoreClassification
}

export function ScoreBreakdown({ breakdown, classification }: ScoreBreakdownProps) {
  const components = [
    {
      label: 'Hook Score (s1)',
      score: breakdown.s1_hook,
      max: 25,
      rawLabel: 'Hook Rate',
      rawValue: formatPercent(breakdown.raw.hook_rate),
    },
    {
      label: 'Hold Score (s2)',
      score: breakdown.s2_hold,
      max: 20,
      rawLabel: 'Hold Rate',
      rawValue: formatPercent(breakdown.raw.hold_rate),
    },
    {
      label: 'CTR Score (s3)',
      score: breakdown.s3_ctr,
      max: 15,
      rawLabel: 'CTR',
      rawValue: formatPercent(breakdown.raw.ctr),
    },
    {
      label: 'CPC Score (s4)',
      score: breakdown.s4_cpc,
      max: 10,
      rawLabel: 'CPC',
      rawValue: formatCurrency(breakdown.raw.cpc),
    },
    {
      label: 'CPA Score (s5)',
      score: breakdown.s5_cpa,
      max: 10,
      rawLabel: 'CPA',
      rawValue: formatCurrency(breakdown.raw.cpa),
    },
    {
      label: 'ROAS Score (s6)',
      score: breakdown.s6_roas,
      max: 15,
      rawLabel: 'ROAS',
      rawValue: formatDecimal(breakdown.raw.roas),
    },
    {
      label: 'Frescor (s7)',
      score: breakdown.s7_freshness,
      max: 5,
      rawLabel: 'Dias desde update',
      rawValue:
        breakdown.raw.days_since_update != null
          ? `${breakdown.raw.days_since_update} dia(s)`
          : '—',
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Score Breakdown</h3>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">{breakdown.total}</span>
          <Badge variant={getScoreBadgeVariant(classification)}>{classification}</Badge>
        </div>
      </div>

      <div className="space-y-3">
        {components.map((comp) => {
          const pct = comp.max > 0 ? (comp.score / comp.max) * 100 : 0
          return (
            <div key={comp.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{comp.label}</span>
                <span className="text-gray-500">
                  {comp.rawLabel}: {comp.rawValue} | {comp.score.toFixed(1)} / {comp.max}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
