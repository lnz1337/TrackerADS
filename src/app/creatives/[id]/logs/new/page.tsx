import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MetricsLogForm } from '@/components/logs/MetricsLogForm'
import type { Creative } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function NewLogPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()

  const { data: creative, error } = await supabase
    .from('creatives')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !creative) {
    notFound()
  }

  const typedCreative = creative as Creative

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/creatives/${params.id}`} className="text-sm text-gray-500 hover:text-gray-700">
          Voltar
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-900 font-medium">Adicionar Métricas</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Registrar Métricas</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <MetricsLogForm creativeId={params.id} creativeName={typedCreative.name} />
      </div>
    </div>
  )
}
