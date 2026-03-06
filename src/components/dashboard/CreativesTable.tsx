'use client'

import Link from 'next/link'
import { Badge, getHookBadgeVariant, getStatusBadgeVariant, getScoreBadgeVariant } from '@/components/ui/Badge'
import { formatPercent, formatCurrency, formatDecimal } from '@/lib/utils'
import type { DashboardCreative } from '@/lib/types'

export type SortField =
  | 'hook_rate'
  | 'hold_rate'
  | 'ctr'
  | 'cpc'
  | 'roas'
  | 'score_asc'
  | 'score_desc'
  | 'updated'

interface CreativesTableProps {
  creatives: DashboardCreative[]
  sortField: SortField
  onSortChange: (field: SortField) => void
}

export function CreativesTable({ creatives, sortField, onSortChange }: CreativesTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm text-gray-500">Ordenar por:</span>
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1"
          value={sortField}
          onChange={(e) => onSortChange(e.target.value as SortField)}
        >
          <option value="score_desc">Maior Score</option>
          <option value="score_asc">Menor Score</option>
          <option value="hook_rate">Maior Hook Rate</option>
          <option value="hold_rate">Maior Hold Rate</option>
          <option value="ctr">Maior CTR</option>
          <option value="cpc">Menor CPC</option>
          <option value="roas">Maior ROAS</option>
          <option value="updated">Mais Recente</option>
        </select>
        <span className="text-sm text-gray-400 ml-auto">{creatives.length} criativos</span>
      </div>

      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left font-medium text-gray-500">Nome</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500">Plataforma</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500">Oferta</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500">Status</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">Hook Rate</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500">Hook</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">Hold Rate</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500">Hold</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500">Papel</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">CTR</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">CPC</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">CPA</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">ROAS</th>
            <th className="px-3 py-3 text-center font-medium text-gray-500">Score</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">Atualizado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {creatives.map((dc) => (
            <tr key={dc.creative.id} className="hover:bg-gray-50">
              <td className="px-3 py-3 whitespace-nowrap">
                <Link
                  href={`/creatives/${dc.creative.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {dc.creative.name}
                </Link>
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-gray-600">{dc.creative.platform}</td>
              <td className="px-3 py-3 whitespace-nowrap text-gray-600">{dc.creative.offer_name}</td>
              <td className="px-3 py-3 whitespace-nowrap">
                <Badge variant={getStatusBadgeVariant(dc.creative.status)}>
                  {dc.creative.status}
                </Badge>
              </td>
              <td className="px-3 py-3 text-right whitespace-nowrap">
                {formatPercent(dc.latestLog?.hook_rate)}
              </td>
              <td className="px-3 py-3 whitespace-nowrap">
                <Badge variant={getHookBadgeVariant(dc.hookClassification)}>
                  {dc.hookClassification}
                </Badge>
              </td>
              <td className="px-3 py-3 text-right whitespace-nowrap">
                {formatPercent(dc.latestLog?.hold_rate)}
              </td>
              <td className="px-3 py-3 whitespace-nowrap">
                <Badge variant={getHookBadgeVariant(dc.holdClassification)}>
                  {dc.holdClassification}
                </Badge>
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-xs max-w-[180px] truncate">
                {dc.role}
              </td>
              <td className="px-3 py-3 text-right whitespace-nowrap">
                {formatPercent(dc.latestLog?.ctr)}
              </td>
              <td className="px-3 py-3 text-right whitespace-nowrap">
                {formatCurrency(dc.latestLog?.cpc)}
              </td>
              <td className="px-3 py-3 text-right whitespace-nowrap">
                {formatCurrency(dc.latestLog?.cpa)}
              </td>
              <td className="px-3 py-3 text-right whitespace-nowrap">
                {formatDecimal(dc.latestLog?.roas)}
              </td>
              <td className="px-3 py-3 text-center whitespace-nowrap">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-bold text-lg">{dc.score}</span>
                  <Badge variant={getScoreBadgeVariant(dc.scoreClassification)}>
                    {dc.scoreClassification}
                  </Badge>
                </div>
              </td>
              <td className="px-3 py-3 text-right whitespace-nowrap text-gray-500">
                {dc.daysSinceUpdate != null ? (
                  dc.daysSinceUpdate === 0
                    ? 'Hoje'
                    : dc.daysSinceUpdate === 1
                    ? '1 dia'
                    : `${dc.daysSinceUpdate} dias`
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
          {creatives.length === 0 && (
            <tr>
              <td colSpan={15} className="px-3 py-8 text-center text-gray-500">
                Nenhum criativo encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
