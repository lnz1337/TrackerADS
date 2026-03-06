export interface Creative {
  id: string
  name: string
  platform: string
  offer_name: string
  niche: string | null
  region: string | null
  creative_type: string | null
  angle: string | null
  hook_text: string | null
  hook_type: string | null
  hold_structure: string | null
  main_copy: string | null
  cta_type: string | null
  duration_seconds: number | null
  creative_url: string | null
  ad_url: string | null
  status: string
  start_date: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CreativeMetricsLog {
  id: string
  creative_id: string
  log_date: string
  impressions: number | null
  cpm: number | null
  cpc: number | null
  ctr: number | null
  link_ctr: number | null
  hook_rate: number | null
  hold_rate: number | null
  thumbstop_rate: number | null
  view_25: number | null
  view_50: number | null
  view_75: number | null
  view_95: number | null
  clicks: number | null
  cost: number | null
  leads: number | null
  checkouts: number | null
  sales: number | null
  revenue: number | null
  cpa: number | null
  roas: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type HookClassification = 'Bom' | 'Médio' | 'Ruim' | 'Sem dados'
export type HoldClassification = 'Bom' | 'Médio' | 'Ruim' | 'Sem dados'

export type CreativeRole =
  | 'Benchmark / Winner potencial'
  | 'Doador de Hook'
  | 'Criativo promissor com boa retenção'
  | 'Em observação'
  | 'Hook aceitável, retenção fraca'
  | 'Doador de Hold'
  | 'Abertura fraca, retenção mediana'
  | 'Criativo fraco'
  | 'Dados insuficientes'

export type ScoreClassification =
  | 'Winner forte'
  | 'Promissor'
  | 'Em observação'
  | 'Fraco'
  | 'Muito fraco'

export interface ScoreBreakdown {
  s1_hook: number
  s2_hold: number
  s3_ctr: number
  s4_cpc: number
  s5_cpa: number
  s6_roas: number
  s7_freshness: number
  total: number
  raw: {
    hook_rate: number | null
    hold_rate: number | null
    ctr: number | null
    cpc: number | null
    cpa: number | null
    roas: number | null
    days_since_update: number | null
  }
}

export interface MetricDeltas {
  deltaHookRate: number | null
  deltaHoldRate: number | null
  deltaCTR: number | null
  deltaCPC: number | null
  deltaCPA: number | null
  deltaROAS: number | null
}

export interface CompatibilityCriteria {
  sameAngle: boolean
  sameCreativeType: boolean
  similarDuration: boolean
  sameHookType: boolean
  sameHoldStructure: boolean
  sameNiche: boolean
  bothRecent: boolean
}

export interface CombinationSuggestion {
  hookDonor: Creative
  holdDonor: Creative
  hookDonorLog: CreativeMetricsLog
  holdDonorLog: CreativeMetricsLog
  compatibilityScore: number
  criteria: CompatibilityCriteria
  suggestionText: string
  tested: boolean
}

export interface DashboardCreative {
  creative: Creative
  latestLog: CreativeMetricsLog | null
  hookClassification: HookClassification
  holdClassification: HoldClassification
  role: CreativeRole
  score: number
  scoreClassification: ScoreClassification
  scoreBreakdown: ScoreBreakdown
  daysSinceUpdate: number | null
}
