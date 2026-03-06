import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CreativeSummary } from '@/components/details/CreativeSummary'
import { MetricsHistory } from '@/components/details/MetricsHistory'
import { PerformanceChart } from '@/components/details/PerformanceChart'
import { ScoreBreakdown } from '@/components/details/ScoreBreakdown'
import { CreativeDiagnostic } from '@/components/details/CreativeDiagnostic'
import { RelatedCombinations } from '@/components/details/RelatedCombinations'
import {
  getLatestLog,
  classifyHookRate,
  classifyHoldRate,
  getCreativeRole,
  calculateScoreBreakdown,
  classifyScore,
} from '@/lib/metrics'
import { findCombinations } from '@/lib/combination-engine'
import type { Creative, CreativeMetricsLog } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function CreativeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()
  const today = new Date()

  const { data: creative, error } = await supabase
    .from('creatives')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !creative) {
    notFound()
  }

  const { data: logs } = await supabase
    .from('creative_metrics_logs')
    .select('*')
    .eq('creative_id', params.id)
    .order('log_date', { ascending: true })

  const typedCreative = creative as Creative
  const typedLogs = (logs || []) as CreativeMetricsLog[]
  const latestLog = getLatestLog(typedLogs)
  const hookClassification = classifyHookRate(latestLog?.hook_rate ?? null)
  const holdClassification = classifyHoldRate(latestLog?.hold_rate ?? null)
  const role = getCreativeRole(hookClassification, holdClassification)
  const scoreBreakdown = calculateScoreBreakdown(latestLog, today)
  const scoreClassification = classifyScore(scoreBreakdown.total)

  // Find related combinations
  const { data: allCreatives } = await supabase.from('creatives').select('*')
  const { data: allLogs } = await supabase.from('creative_metrics_logs').select('*')

  const allLogsByCreative: Record<string, CreativeMetricsLog[]> = {}
  for (const l of (allLogs || []) as CreativeMetricsLog[]) {
    if (!allLogsByCreative[l.creative_id]) allLogsByCreative[l.creative_id] = []
    allLogsByCreative[l.creative_id].push(l)
  }

  const allCombinations = findCombinations(
    (allCreatives || []) as Creative[],
    allLogsByCreative,
    today
  )
  const relatedCombinations = allCombinations.filter(
    (c) => c.hookDonor.id === params.id || c.holdDonor.id === params.id
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-900 font-medium">{typedCreative.name}</span>
        </div>
        <div className="flex gap-2">
          <Link href={`/creatives/${params.id}/logs/new`}>
            <Button variant="secondary" size="sm">Adicionar Log</Button>
          </Link>
          <Link href={`/creatives/${params.id}/edit`}>
            <Button variant="secondary" size="sm">Editar</Button>
          </Link>
        </div>
      </div>

      <CreativeSummary creative={typedCreative} />

      <CreativeDiagnostic
        hookClassification={hookClassification}
        holdClassification={holdClassification}
        role={role}
        latestLog={latestLog}
      />

      <ScoreBreakdown breakdown={scoreBreakdown} classification={scoreClassification} />

      <PerformanceChart logs={typedLogs} />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Histórico de Métricas</h3>
        <MetricsHistory logs={typedLogs} />
      </div>

      <RelatedCombinations combinations={relatedCombinations} />
    </div>
  )
}
