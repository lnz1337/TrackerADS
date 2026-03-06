'use client'

import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { Creative } from '@/lib/types'

interface CreativeSummaryProps {
  creative: Creative
}

export function CreativeSummary({ creative }: CreativeSummaryProps) {
  const fields = [
    { label: 'Plataforma', value: creative.platform },
    { label: 'Oferta', value: creative.offer_name },
    { label: 'Nicho', value: creative.niche },
    { label: 'Região', value: creative.region },
    { label: 'Tipo', value: creative.creative_type },
    { label: 'Ângulo', value: creative.angle },
    { label: 'Tipo de Hook', value: creative.hook_type },
    { label: 'Estrutura de Hold', value: creative.hold_structure },
    { label: 'CTA', value: creative.cta_type },
    { label: 'Duração', value: creative.duration_seconds ? `${creative.duration_seconds}s` : null },
    { label: 'Início', value: formatDate(creative.start_date) },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{creative.name}</h2>
        <Badge variant={getStatusBadgeVariant(creative.status)}>{creative.status}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fields.map((f) => (
          <div key={f.label}>
            <dt className="text-xs text-gray-500">{f.label}</dt>
            <dd className="text-sm font-medium text-gray-900">{f.value || '—'}</dd>
          </div>
        ))}
      </div>

      {creative.hook_text && (
        <div className="mt-4">
          <dt className="text-xs text-gray-500">Texto do Hook</dt>
          <dd className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">{creative.hook_text}</dd>
        </div>
      )}

      {creative.notes && (
        <div className="mt-4">
          <dt className="text-xs text-gray-500">Observações</dt>
          <dd className="text-sm text-gray-700 mt-1">{creative.notes}</dd>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {creative.creative_url && (
          <a href={creative.creative_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
            Ver Criativo
          </a>
        )}
        {creative.ad_url && (
          <a href={creative.ad_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
            Ver Anúncio
          </a>
        )}
      </div>
    </div>
  )
}
