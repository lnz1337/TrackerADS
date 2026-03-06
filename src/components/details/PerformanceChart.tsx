'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getLogsSortedAsc } from '@/lib/metrics'
import { formatDate } from '@/lib/utils'
import type { CreativeMetricsLog } from '@/lib/types'

interface PerformanceChartProps {
  logs: CreativeMetricsLog[]
}

type MetricKey = 'hook_rate' | 'hold_rate' | 'ctr' | 'cpc' | 'cpa' | 'roas'

const METRIC_OPTIONS: { key: MetricKey; label: string; color: string }[] = [
  { key: 'hook_rate', label: 'Hook Rate', color: '#3b82f6' },
  { key: 'hold_rate', label: 'Hold Rate', color: '#10b981' },
  { key: 'ctr', label: 'CTR', color: '#f59e0b' },
  { key: 'cpc', label: 'CPC', color: '#ef4444' },
  { key: 'cpa', label: 'CPA', color: '#8b5cf6' },
  { key: 'roas', label: 'ROAS', color: '#06b6d4' },
]

export function PerformanceChart({ logs }: PerformanceChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>([
    'hook_rate',
    'hold_rate',
  ])

  const sorted = getLogsSortedAsc(logs)

  if (sorted.length < 2) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        Necessário pelo menos 2 logs para gerar gráfico.
      </div>
    )
  }

  const data = sorted.map((log) => ({
    date: formatDate(log.log_date),
    hook_rate: log.hook_rate,
    hold_rate: log.hold_rate,
    ctr: log.ctr,
    cpc: log.cpc,
    cpa: log.cpa,
    roas: log.roas,
  }))

  const toggleMetric = (key: MetricKey) => {
    setSelectedMetrics((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução de Performance</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {METRIC_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => toggleMetric(opt.key)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              selectedMetrics.includes(opt.key)
                ? 'border-transparent text-white'
                : 'border-gray-300 text-gray-500 bg-white'
            }`}
            style={
              selectedMetrics.includes(opt.key)
                ? { backgroundColor: opt.color }
                : {}
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          {METRIC_OPTIONS.filter((opt) => selectedMetrics.includes(opt.key)).map(
            (opt) => (
              <Line
                key={opt.key}
                type="monotone"
                dataKey={opt.key}
                name={opt.label}
                stroke={opt.color}
                strokeWidth={2}
                dot
                connectNulls
              />
            )
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
