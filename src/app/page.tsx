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
    const errorMsg = creativesError?.message || logsError?.message || ''
    const isTableMissing = errorMsg.includes('schema cache') || errorMsg.includes('does not exist')

    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg font-medium">
          {isTableMissing
            ? 'As tabelas do banco de dados ainda não foram criadas.'
            : 'Erro ao carregar dados. Verifique a conexão com o Supabase.'}
        </p>
        {isTableMissing ? (
          <div className="mt-4 text-sm text-gray-600 max-w-md mx-auto text-left">
            <p className="mb-2">Para configurar o banco de dados:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Abra o <strong>SQL Editor</strong> no Supabase Dashboard</li>
              <li>Cole e execute o conteúdo de <code className="bg-gray-100 px-1 rounded">supabase/schema.sql</code></li>
              <li>Opcionalmente, execute <code className="bg-gray-100 px-1 rounded">supabase/seed.sql</code> para dados de exemplo</li>
              <li>Recarregue esta página</li>
            </ol>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">{errorMsg}</p>
        )}
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
