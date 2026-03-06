'use client'

import { Badge, getHookBadgeVariant } from '@/components/ui/Badge'
import { formatPercent } from '@/lib/utils'
import type { HookClassification, HoldClassification, CreativeRole, CreativeMetricsLog } from '@/lib/types'

interface CreativeDiagnosticProps {
  hookClassification: HookClassification
  holdClassification: HoldClassification
  role: CreativeRole
  latestLog: CreativeMetricsLog | null
}

const roleDescriptions: Record<CreativeRole, string> = {
  'Benchmark / Winner potencial': 'Criativo com performance excepcional em hook e retenção. Candidato forte para escalar.',
  'Doador de Hook': 'Excelente abertura, mas a retenção precisa melhorar. Use o hook deste criativo em combinações.',
  'Criativo promissor com boa retenção': 'Boa retenção com hook que pode melhorar. Itere o hook mantendo o corpo.',
  'Em observação': 'Métricas medianas em ambas frentes. Monitore a evolução antes de decidir.',
  'Hook aceitável, retenção fraca': 'Hook razoável mas a audiência não está engajando. Revise o corpo do criativo.',
  'Doador de Hold': 'Retenção forte mas abertura fraca. Use o corpo deste criativo em combinações.',
  'Abertura fraca, retenção mediana': 'Ambas métricas abaixo do ideal. Considere uma reformulação completa.',
  'Criativo fraco': 'Métricas fracas em ambas frentes. Considere pausar e realocar orçamento.',
  'Dados insuficientes': 'Dados insuficientes para classificar. Registre mais métricas.',
}

export function CreativeDiagnostic({
  hookClassification,
  holdClassification,
  role,
  latestLog,
}: CreativeDiagnosticProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnóstico</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Hook Rate</div>
          <div className="text-2xl font-bold mb-2">{formatPercent(latestLog?.hook_rate)}</div>
          <Badge variant={getHookBadgeVariant(hookClassification)}>{hookClassification}</Badge>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Hold Rate</div>
          <div className="text-2xl font-bold mb-2">{formatPercent(latestLog?.hold_rate)}</div>
          <Badge variant={getHookBadgeVariant(holdClassification)}>{holdClassification}</Badge>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Papel do Criativo</div>
          <div className="text-sm font-semibold mt-2">{role}</div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">{roleDescriptions[role]}</p>
      </div>
    </div>
  )
}
