'use client'

import { formatDate, formatPercent, formatCurrency, formatDecimal } from '@/lib/utils'
import { getLogsSortedAsc, calculateDeltas } from '@/lib/metrics'
import type { CreativeMetricsLog } from '@/lib/types'

interface MetricsHistoryProps {
  logs: CreativeMetricsLog[]
}

function DeltaCell({ value }: { value: number | null }) {
  if (value == null) return <span className="text-gray-400">—</span>
  const color = value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-400'
  const sign = value > 0 ? '+' : ''
  return <span className={`text-xs ${color}`}>{sign}{value.toFixed(1)}</span>
}

export function MetricsHistory({ logs }: MetricsHistoryProps) {
  const sorted = getLogsSortedAsc(logs)

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        Nenhum log de métricas registrado.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left font-medium text-gray-500">Data</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">Hook Rate</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">Hold Rate</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">CTR</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">CPC</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">CPA</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">ROAS</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">Vendas</th>
            <th className="px-3 py-3 text-right font-medium text-gray-500">Receita</th>
            <th className="px-3 py-3 text-left font-medium text-gray-500">Obs.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sorted.map((log, i) => {
            const prev = i > 0 ? sorted[i - 1] : null
            const deltas = calculateDeltas(log, prev)
            return (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">{formatDate(log.log_date)}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatPercent(log.hook_rate)}
                  <br />
                  <DeltaCell value={deltas.deltaHookRate} />
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatPercent(log.hold_rate)}
                  <br />
                  <DeltaCell value={deltas.deltaHoldRate} />
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatPercent(log.ctr)}
                  <br />
                  <DeltaCell value={deltas.deltaCTR} />
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatCurrency(log.cpc)}
                  <br />
                  <DeltaCell value={deltas.deltaCPC} />
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatCurrency(log.cpa)}
                  <br />
                  <DeltaCell value={deltas.deltaCPA} />
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatDecimal(log.roas)}
                  <br />
                  <DeltaCell value={deltas.deltaROAS} />
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {log.sales != null ? log.sales : '—'}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatCurrency(log.revenue)}
                </td>
                <td className="px-3 py-2 text-gray-500 max-w-[150px] truncate">
                  {log.notes || '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
