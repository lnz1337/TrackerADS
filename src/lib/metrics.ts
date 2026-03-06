import { differenceInDays, parseISO } from 'date-fns'
import type {
  CreativeMetricsLog,
  HookClassification,
  HoldClassification,
  CreativeRole,
  ScoreClassification,
  ScoreBreakdown,
  MetricDeltas,
} from './types'

// ============================================================
// UTILITY
// ============================================================

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ============================================================
// LATEST LOG
// ============================================================

export function getLatestLog(logs: CreativeMetricsLog[]): CreativeMetricsLog | null {
  if (logs.length === 0) return null
  const sorted = [...logs].sort(
    (a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
  )
  return sorted[0]
}

export function getLogsSortedAsc(logs: CreativeMetricsLog[]): CreativeMetricsLog[] {
  return [...logs].sort(
    (a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime()
  )
}

// ============================================================
// HOOK RATE CLASSIFICATION
// ============================================================

export function classifyHookRate(hookRate: number | null): HookClassification {
  if (hookRate == null) return 'Sem dados'
  if (hookRate >= 50) return 'Bom'
  if (hookRate >= 25) return 'Médio'
  return 'Ruim'
}

// ============================================================
// HOLD RATE CLASSIFICATION
// ============================================================

export function classifyHoldRate(holdRate: number | null): HoldClassification {
  if (holdRate == null) return 'Sem dados'
  if (holdRate >= 20) return 'Bom'
  if (holdRate >= 10) return 'Médio'
  return 'Ruim'
}

// ============================================================
// CREATIVE ROLE
// ============================================================

export function getCreativeRole(
  hookClass: HookClassification,
  holdClass: HoldClassification
): CreativeRole {
  if (hookClass === 'Sem dados' || holdClass === 'Sem dados') {
    return 'Dados insuficientes'
  }

  if (hookClass === 'Bom' && holdClass === 'Bom') return 'Benchmark / Winner potencial'
  if (hookClass === 'Bom' && holdClass === 'Médio') return 'Doador de Hook'
  if (hookClass === 'Bom' && holdClass === 'Ruim') return 'Doador de Hook'
  if (hookClass === 'Médio' && holdClass === 'Bom') return 'Criativo promissor com boa retenção'
  if (hookClass === 'Médio' && holdClass === 'Médio') return 'Em observação'
  if (hookClass === 'Médio' && holdClass === 'Ruim') return 'Hook aceitável, retenção fraca'
  if (hookClass === 'Ruim' && holdClass === 'Bom') return 'Doador de Hold'
  if (hookClass === 'Ruim' && holdClass === 'Médio') return 'Abertura fraca, retenção mediana'
  if (hookClass === 'Ruim' && holdClass === 'Ruim') return 'Criativo fraco'

  return 'Dados insuficientes'
}

// ============================================================
// SCORE COMPONENTS
// ============================================================

/** s1 — Hook Score (0–25) */
export function calculateHookScore(hookRate: number | null): number {
  if (hookRate == null) return 0
  if (hookRate < 25) return 0
  if (hookRate < 50) return ((hookRate - 25) / 25) * 15
  if (hookRate < 70) return 15 + ((hookRate - 50) / 20) * 10
  return 25
}

/** s2 — Hold Score (0–20) */
export function calculateHoldScore(holdRate: number | null): number {
  if (holdRate == null) return 0
  if (holdRate < 10) return 0
  if (holdRate < 20) return ((holdRate - 10) / 10) * 12
  if (holdRate < 35) return 12 + ((holdRate - 20) / 15) * 8
  return 20
}

/** s3 — CTR Score (0–15) */
export function calculateCTRScore(ctr: number | null): number {
  if (ctr == null) return 0
  if (ctr < 1) return 0
  if (ctr < 3) return ((ctr - 1) / 2) * 10
  if (ctr < 5) return 10 + ((ctr - 3) / 2) * 5
  return 15
}

/** s4 — CPC Score (0–10) — lower is better */
export function calculateCPCScore(cpc: number | null): number {
  if (cpc == null) return 0
  if (cpc >= 5) return 0
  if (cpc > 2) return ((5 - cpc) / 3) * 6
  if (cpc >= 1) return 6 + ((2 - cpc) / 1) * 4
  return 10
}

/** s5 — CPA Score (0–10) — lower is better */
export function calculateCPAScore(cpa: number | null): number {
  if (cpa == null) return 0
  if (cpa <= 0) return 0
  if (cpa >= 100) return 0
  if (cpa > 50) return ((100 - cpa) / 50) * 5
  if (cpa >= 20) return 5 + ((50 - cpa) / 30) * 5
  return 10
}

/** s6 — ROAS Score (0–15) — higher is better */
export function calculateROASScore(roas: number | null): number {
  if (roas == null) return 0
  if (roas < 0.5) return 0
  if (roas < 1) return ((roas - 0.5) / 0.5) * 5
  if (roas < 2) return 5 + ((roas - 1) / 1) * 5
  if (roas < 3) return 10 + ((roas - 2) / 1) * 5
  return 15
}

/** s7 — Freshness Score (0–5) */
export function calculateFreshnessScore(
  latestLogDate: Date | null,
  today: Date
): number {
  if (latestLogDate == null) return 0
  const days = differenceInDays(today, latestLogDate)
  if (days <= 1) return 5
  if (days === 2) return 3
  if (days === 3) return 1
  return 0
}

// ============================================================
// TOTAL SCORE
// ============================================================

export function calculateScoreBreakdown(
  log: CreativeMetricsLog | null,
  today: Date
): ScoreBreakdown {
  if (log == null) {
    return {
      s1_hook: 0,
      s2_hold: 0,
      s3_ctr: 0,
      s4_cpc: 0,
      s5_cpa: 0,
      s6_roas: 0,
      s7_freshness: 0,
      total: 0,
      raw: {
        hook_rate: null,
        hold_rate: null,
        ctr: null,
        cpc: null,
        cpa: null,
        roas: null,
        days_since_update: null,
      },
    }
  }

  const logDate = parseISO(log.log_date)
  const daysSinceUpdate = differenceInDays(today, logDate)

  const s1 = calculateHookScore(log.hook_rate)
  const s2 = calculateHoldScore(log.hold_rate)
  const s3 = calculateCTRScore(log.ctr)
  const s4 = calculateCPCScore(log.cpc)
  const s5 = calculateCPAScore(log.cpa)
  const s6 = calculateROASScore(log.roas)
  const s7 = calculateFreshnessScore(logDate, today)

  const total = Math.round(clamp(s1 + s2 + s3 + s4 + s5 + s6 + s7, 0, 100))

  return {
    s1_hook: s1,
    s2_hold: s2,
    s3_ctr: s3,
    s4_cpc: s4,
    s5_cpa: s5,
    s6_roas: s6,
    s7_freshness: s7,
    total,
    raw: {
      hook_rate: log.hook_rate,
      hold_rate: log.hold_rate,
      ctr: log.ctr,
      cpc: log.cpc,
      cpa: log.cpa,
      roas: log.roas,
      days_since_update: daysSinceUpdate,
    },
  }
}

// ============================================================
// SCORE CLASSIFICATION
// ============================================================

export function classifyScore(score: number): ScoreClassification {
  if (score >= 80) return 'Winner forte'
  if (score >= 60) return 'Promissor'
  if (score >= 40) return 'Em observação'
  if (score >= 20) return 'Fraco'
  return 'Muito fraco'
}

// ============================================================
// DELTAS
// ============================================================

function safeDelta(current: number | null, previous: number | null): number | null {
  if (current == null || previous == null) return null
  return current - previous
}

export function calculateDeltas(
  currentLog: CreativeMetricsLog,
  previousLog: CreativeMetricsLog | null
): MetricDeltas {
  if (previousLog == null) {
    return {
      deltaHookRate: null,
      deltaHoldRate: null,
      deltaCTR: null,
      deltaCPC: null,
      deltaCPA: null,
      deltaROAS: null,
    }
  }

  return {
    deltaHookRate: safeDelta(currentLog.hook_rate, previousLog.hook_rate),
    deltaHoldRate: safeDelta(currentLog.hold_rate, previousLog.hold_rate),
    deltaCTR: safeDelta(currentLog.ctr, previousLog.ctr),
    deltaCPC: safeDelta(currentLog.cpc, previousLog.cpc),
    deltaCPA: safeDelta(currentLog.cpa, previousLog.cpa),
    deltaROAS: safeDelta(currentLog.roas, previousLog.roas),
  }
}

// ============================================================
// DAYS SINCE UPDATE
// ============================================================

export function daysSinceUpdate(latestLogDate: string | null, today: Date): number | null {
  if (latestLogDate == null) return null
  return differenceInDays(today, parseISO(latestLogDate))
}
