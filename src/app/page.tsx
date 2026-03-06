import { createServerSupabaseClient } from '@/lib/supabase-server'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import {
  getLatestLog,
  classifyHookRate,
  classifyHoldRate,
  getCreativeRole,
  calculateScoreBreakdown,
  classifyScore,
  daysSinceUpdate,
} from '@/lib/metrics'
import type { DashboardCreative, Creative, CreativeMetricsLog } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const today = new Date()

  const { data: creatives, error: creativesError } = await supabase
    .from('creatives')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: logs, error: logsError } = await supabase
    .from('creative_metrics_logs')
    .select('*')

  if (creativesError || logsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar dados. Verifique a conexão com o Supabase.</p>
        <p className="text-sm text-gray-500 mt-2">{creativesError?.message || logsError?.message}</p>
      </div>
    )
  }

  // Group logs by creative_id
  const logsByCreativeId: Record<string, CreativeMetricsLog[]> = {}
  for (const log of (logs || []) as CreativeMetricsLog[]) {
    if (!logsByCreativeId[log.creative_id]) {
      logsByCreativeId[log.creative_id] = []
    }
    logsByCreativeId[log.creative_id].push(log)
  }

  // Build dashboard creatives
  const dashboardCreatives: DashboardCreative[] = ((creatives || []) as Creative[]).map(
    (creative) => {
      const creativeLogs = logsByCreativeId[creative.id] || []
      const latestLog = getLatestLog(creativeLogs)
      const hookClassification = classifyHookRate(latestLog?.hook_rate ?? null)
      const holdClassification = classifyHoldRate(latestLog?.hold_rate ?? null)
      const role = getCreativeRole(hookClassification, holdClassification)
      const scoreBreakdown = calculateScoreBreakdown(latestLog, today)
      const scoreClassification = classifyScore(scoreBreakdown.total)
      const days = daysSinceUpdate(latestLog?.log_date ?? null, today)

      return {
        creative,
        latestLog,
        hookClassification,
        holdClassification,
        role,
        score: scoreBreakdown.total,
        scoreClassification,
        scoreBreakdown,
        daysSinceUpdate: days,
      }
    }
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Criativos</h1>
      </div>
      <DashboardClient creatives={dashboardCreatives} />
    </div>
  )
}
