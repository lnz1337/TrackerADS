import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CombinationsList } from '@/components/combinations/CombinationsList'
import { findCombinations } from '@/lib/combination-engine'
import type { Creative, CreativeMetricsLog } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function CombinationsPage() {
  const supabase = createServerSupabaseClient()
  const today = new Date()

  const { data: creatives, error: creativesError } = await supabase
    .from('creatives')
    .select('*')

  const { data: logs, error: logsError } = await supabase
    .from('creative_metrics_logs')
    .select('*')

  if (creativesError || logsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar dados.</p>
        <p className="text-sm text-gray-500 mt-2">{creativesError?.message || logsError?.message}</p>
      </div>
    )
  }

  const logsByCreativeId: Record<string, CreativeMetricsLog[]> = {}
  for (const log of (logs || []) as CreativeMetricsLog[]) {
    if (!logsByCreativeId[log.creative_id]) logsByCreativeId[log.creative_id] = []
    logsByCreativeId[log.creative_id].push(log)
  }

  const combinations = findCombinations(
    (creatives || []) as Creative[],
    logsByCreativeId,
    today
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sugestões de Combinação</h1>
      <p className="text-sm text-gray-500 mb-6">
        Combinações entre criativos Hook Donors e Hold Donors da mesma plataforma, oferta e região.
      </p>
      <CombinationsList combinations={combinations} />
    </div>
  )
}
