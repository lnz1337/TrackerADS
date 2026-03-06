import { describe, it, expect } from 'vitest'
import {
  clamp,
  getLatestLog,
  classifyHookRate,
  classifyHoldRate,
  getCreativeRole,
  calculateHookScore,
  calculateHoldScore,
  calculateCTRScore,
  calculateCPCScore,
  calculateCPAScore,
  calculateROASScore,
  calculateFreshnessScore,
  calculateScoreBreakdown,
  classifyScore,
  calculateDeltas,
} from '../lib/metrics'
import type { CreativeMetricsLog } from '../lib/types'

function makeLog(overrides: Partial<CreativeMetricsLog> = {}): CreativeMetricsLog {
  return {
    id: 'log-1',
    creative_id: 'creative-1',
    log_date: '2026-03-05',
    impressions: null,
    cpm: null,
    cpc: null,
    ctr: null,
    link_ctr: null,
    hook_rate: null,
    hold_rate: null,
    thumbstop_rate: null,
    view_25: null,
    view_50: null,
    view_75: null,
    view_95: null,
    clicks: null,
    cost: null,
    leads: null,
    checkouts: null,
    sales: null,
    revenue: null,
    cpa: null,
    roas: null,
    notes: null,
    created_at: '2026-03-05T00:00:00Z',
    updated_at: '2026-03-05T00:00:00Z',
    ...overrides,
  }
}

// ============================================================
// clamp
// ============================================================

describe('clamp', () => {
  it('clamps value below min', () => {
    expect(clamp(-5, 0, 100)).toBe(0)
  })
  it('clamps value above max', () => {
    expect(clamp(150, 0, 100)).toBe(100)
  })
  it('leaves value within range', () => {
    expect(clamp(50, 0, 100)).toBe(50)
  })
})

// ============================================================
// getLatestLog
// ============================================================

describe('getLatestLog', () => {
  it('returns null for empty array', () => {
    expect(getLatestLog([])).toBeNull()
  })
  it('returns the most recent log', () => {
    const logs = [
      makeLog({ id: '1', log_date: '2026-03-01' }),
      makeLog({ id: '2', log_date: '2026-03-05' }),
      makeLog({ id: '3', log_date: '2026-03-03' }),
    ]
    expect(getLatestLog(logs)!.id).toBe('2')
  })
})

// ============================================================
// classifyHookRate
// ============================================================

describe('classifyHookRate', () => {
  it('returns "Sem dados" for null', () => {
    expect(classifyHookRate(null)).toBe('Sem dados')
  })
  it('returns "Ruim" for 10', () => {
    expect(classifyHookRate(10)).toBe('Ruim')
  })
  it('returns "Ruim" for 24.9', () => {
    expect(classifyHookRate(24.9)).toBe('Ruim')
  })
  it('returns "Médio" for 25', () => {
    expect(classifyHookRate(25)).toBe('Médio')
  })
  it('returns "Médio" for 49.9', () => {
    expect(classifyHookRate(49.9)).toBe('Médio')
  })
  it('returns "Bom" for 50', () => {
    expect(classifyHookRate(50)).toBe('Bom')
  })
  it('returns "Bom" for 80', () => {
    expect(classifyHookRate(80)).toBe('Bom')
  })
})

// ============================================================
// classifyHoldRate
// ============================================================

describe('classifyHoldRate', () => {
  it('returns "Sem dados" for null', () => {
    expect(classifyHoldRate(null)).toBe('Sem dados')
  })
  it('returns "Ruim" for 5', () => {
    expect(classifyHoldRate(5)).toBe('Ruim')
  })
  it('returns "Ruim" for 9.9', () => {
    expect(classifyHoldRate(9.9)).toBe('Ruim')
  })
  it('returns "Médio" for 10', () => {
    expect(classifyHoldRate(10)).toBe('Médio')
  })
  it('returns "Médio" for 19.9', () => {
    expect(classifyHoldRate(19.9)).toBe('Médio')
  })
  it('returns "Bom" for 20', () => {
    expect(classifyHoldRate(20)).toBe('Bom')
  })
  it('returns "Bom" for 35', () => {
    expect(classifyHoldRate(35)).toBe('Bom')
  })
})

// ============================================================
// getCreativeRole
// ============================================================

describe('getCreativeRole', () => {
  it('Hook Bom + Hold Bom = Benchmark / Winner potencial', () => {
    expect(getCreativeRole('Bom', 'Bom')).toBe('Benchmark / Winner potencial')
  })
  it('Hook Bom + Hold Médio = Doador de Hook', () => {
    expect(getCreativeRole('Bom', 'Médio')).toBe('Doador de Hook')
  })
  it('Hook Bom + Hold Ruim = Doador de Hook', () => {
    expect(getCreativeRole('Bom', 'Ruim')).toBe('Doador de Hook')
  })
  it('Hook Médio + Hold Bom = Criativo promissor com boa retenção', () => {
    expect(getCreativeRole('Médio', 'Bom')).toBe('Criativo promissor com boa retenção')
  })
  it('Hook Médio + Hold Médio = Em observação', () => {
    expect(getCreativeRole('Médio', 'Médio')).toBe('Em observação')
  })
  it('Hook Médio + Hold Ruim = Hook aceitável, retenção fraca', () => {
    expect(getCreativeRole('Médio', 'Ruim')).toBe('Hook aceitável, retenção fraca')
  })
  it('Hook Ruim + Hold Bom = Doador de Hold', () => {
    expect(getCreativeRole('Ruim', 'Bom')).toBe('Doador de Hold')
  })
  it('Hook Ruim + Hold Médio = Abertura fraca, retenção mediana', () => {
    expect(getCreativeRole('Ruim', 'Médio')).toBe('Abertura fraca, retenção mediana')
  })
  it('Hook Ruim + Hold Ruim = Criativo fraco', () => {
    expect(getCreativeRole('Ruim', 'Ruim')).toBe('Criativo fraco')
  })
  it('Hook Sem dados = Dados insuficientes', () => {
    expect(getCreativeRole('Sem dados', 'Bom')).toBe('Dados insuficientes')
  })
  it('Hold Sem dados = Dados insuficientes', () => {
    expect(getCreativeRole('Bom', 'Sem dados')).toBe('Dados insuficientes')
  })
})

// ============================================================
// calculateHookScore (s1, 0–25)
// ============================================================

describe('calculateHookScore', () => {
  it('null → 0', () => {
    expect(calculateHookScore(null)).toBe(0)
  })
  it('hookRate < 25 → 0', () => {
    expect(calculateHookScore(0)).toBe(0)
    expect(calculateHookScore(24.9)).toBe(0)
  })
  it('hookRate = 25 → 0 (boundary of second range)', () => {
    expect(calculateHookScore(25)).toBeCloseTo(0, 5)
  })
  it('hookRate = 37.5 (midpoint 25-50) → 7.5', () => {
    expect(calculateHookScore(37.5)).toBeCloseTo(7.5, 5)
  })
  it('hookRate = 50 → 15', () => {
    expect(calculateHookScore(50)).toBeCloseTo(15, 5)
  })
  it('hookRate = 60 → 20', () => {
    expect(calculateHookScore(60)).toBeCloseTo(20, 5)
  })
  it('hookRate >= 70 → 25', () => {
    expect(calculateHookScore(70)).toBe(25)
    expect(calculateHookScore(100)).toBe(25)
  })
})

// ============================================================
// calculateHoldScore (s2, 0–20)
// ============================================================

describe('calculateHoldScore', () => {
  it('null → 0', () => {
    expect(calculateHoldScore(null)).toBe(0)
  })
  it('holdRate < 10 → 0', () => {
    expect(calculateHoldScore(0)).toBe(0)
    expect(calculateHoldScore(9.9)).toBe(0)
  })
  it('holdRate = 10 → 0', () => {
    expect(calculateHoldScore(10)).toBeCloseTo(0, 5)
  })
  it('holdRate = 15 → 6', () => {
    expect(calculateHoldScore(15)).toBeCloseTo(6, 5)
  })
  it('holdRate = 20 → 12', () => {
    expect(calculateHoldScore(20)).toBeCloseTo(12, 5)
  })
  it('holdRate = 27.5 → 16', () => {
    expect(calculateHoldScore(27.5)).toBeCloseTo(16, 5)
  })
  it('holdRate >= 35 → 20', () => {
    expect(calculateHoldScore(35)).toBe(20)
    expect(calculateHoldScore(50)).toBe(20)
  })
})

// ============================================================
// calculateCTRScore (s3, 0–15)
// ============================================================

describe('calculateCTRScore', () => {
  it('null → 0', () => {
    expect(calculateCTRScore(null)).toBe(0)
  })
  it('ctr < 1 → 0', () => {
    expect(calculateCTRScore(0.5)).toBe(0)
  })
  it('ctr = 2 → 5', () => {
    expect(calculateCTRScore(2)).toBeCloseTo(5, 5)
  })
  it('ctr = 3 → 10', () => {
    expect(calculateCTRScore(3)).toBeCloseTo(10, 5)
  })
  it('ctr = 4 → 12.5', () => {
    expect(calculateCTRScore(4)).toBeCloseTo(12.5, 5)
  })
  it('ctr >= 5 → 15', () => {
    expect(calculateCTRScore(5)).toBe(15)
  })
})

// ============================================================
// calculateCPCScore (s4, 0–10)
// ============================================================

describe('calculateCPCScore', () => {
  it('null → 0', () => {
    expect(calculateCPCScore(null)).toBe(0)
  })
  it('cpc >= 5 → 0', () => {
    expect(calculateCPCScore(5)).toBe(0)
    expect(calculateCPCScore(10)).toBe(0)
  })
  it('cpc = 3.5 → 3', () => {
    expect(calculateCPCScore(3.5)).toBeCloseTo(3, 5)
  })
  it('cpc = 2 → 6', () => {
    expect(calculateCPCScore(2)).toBeCloseTo(6, 5)
  })
  it('cpc = 1.5 → 8', () => {
    expect(calculateCPCScore(1.5)).toBeCloseTo(8, 5)
  })
  it('cpc = 1 → 10', () => {
    expect(calculateCPCScore(1)).toBeCloseTo(10, 5)
  })
  it('cpc < 1 → 10', () => {
    expect(calculateCPCScore(0.5)).toBe(10)
  })
})

// ============================================================
// calculateCPAScore (s5, 0–10)
// ============================================================

describe('calculateCPAScore', () => {
  it('null → 0', () => {
    expect(calculateCPAScore(null)).toBe(0)
  })
  it('cpa >= 100 → 0', () => {
    expect(calculateCPAScore(100)).toBe(0)
    expect(calculateCPAScore(200)).toBe(0)
  })
  it('cpa = 75 → 2.5', () => {
    expect(calculateCPAScore(75)).toBeCloseTo(2.5, 5)
  })
  it('cpa = 50 → 5', () => {
    expect(calculateCPAScore(50)).toBeCloseTo(5, 5)
  })
  it('cpa = 35 → 7.5', () => {
    expect(calculateCPAScore(35)).toBeCloseTo(7.5, 5)
  })
  it('cpa = 20 → 10', () => {
    expect(calculateCPAScore(20)).toBeCloseTo(10, 5)
  })
  it('cpa < 20 → 10', () => {
    expect(calculateCPAScore(10)).toBe(10)
  })
})

// ============================================================
// calculateROASScore (s6, 0–15)
// ============================================================

describe('calculateROASScore', () => {
  it('null → 0', () => {
    expect(calculateROASScore(null)).toBe(0)
  })
  it('roas < 0.5 → 0', () => {
    expect(calculateROASScore(0.3)).toBe(0)
  })
  it('roas = 0.75 → 2.5', () => {
    expect(calculateROASScore(0.75)).toBeCloseTo(2.5, 5)
  })
  it('roas = 1 → 5', () => {
    expect(calculateROASScore(1)).toBeCloseTo(5, 5)
  })
  it('roas = 1.5 → 7.5', () => {
    expect(calculateROASScore(1.5)).toBeCloseTo(7.5, 5)
  })
  it('roas = 2 → 10', () => {
    expect(calculateROASScore(2)).toBeCloseTo(10, 5)
  })
  it('roas = 2.5 → 12.5', () => {
    expect(calculateROASScore(2.5)).toBeCloseTo(12.5, 5)
  })
  it('roas >= 3 → 15', () => {
    expect(calculateROASScore(3)).toBe(15)
    expect(calculateROASScore(5)).toBe(15)
  })
})

// ============================================================
// calculateFreshnessScore (s7, 0–5)
// ============================================================

describe('calculateFreshnessScore', () => {
  const today = new Date('2026-03-06')

  it('null logDate → 0', () => {
    expect(calculateFreshnessScore(null, today)).toBe(0)
  })
  it('0 days ago → 5', () => {
    expect(calculateFreshnessScore(new Date('2026-03-06'), today)).toBe(5)
  })
  it('1 day ago → 5', () => {
    expect(calculateFreshnessScore(new Date('2026-03-05'), today)).toBe(5)
  })
  it('2 days ago → 3', () => {
    expect(calculateFreshnessScore(new Date('2026-03-04'), today)).toBe(3)
  })
  it('3 days ago → 1', () => {
    expect(calculateFreshnessScore(new Date('2026-03-03'), today)).toBe(1)
  })
  it('4+ days ago → 0', () => {
    expect(calculateFreshnessScore(new Date('2026-03-02'), today)).toBe(0)
    expect(calculateFreshnessScore(new Date('2026-01-01'), today)).toBe(0)
  })
})

// ============================================================
// calculateScoreBreakdown + total score
// ============================================================

describe('calculateScoreBreakdown', () => {
  const today = new Date('2026-03-06')

  it('null log → all zeros', () => {
    const breakdown = calculateScoreBreakdown(null, today)
    expect(breakdown.total).toBe(0)
    expect(breakdown.s1_hook).toBe(0)
    expect(breakdown.s2_hold).toBe(0)
  })

  it('calculates correct total from all components', () => {
    const log = makeLog({
      log_date: '2026-03-06',
      hook_rate: 60,   // s1 = 15 + ((60-50)/20)*10 = 20
      hold_rate: 25,   // s2 = 12 + ((25-20)/15)*8 = 14.667
      ctr: 3,          // s3 = 10
      cpc: 1.5,        // s4 = 6 + ((2-1.5)/1)*4 = 8
      cpa: 35,         // s5 = 5 + ((50-35)/30)*5 = 7.5
      roas: 2.5,       // s6 = 10 + ((2.5-2)/1)*5 = 12.5
    })
    const breakdown = calculateScoreBreakdown(log, today)

    expect(breakdown.s1_hook).toBeCloseTo(20, 1)
    expect(breakdown.s2_hold).toBeCloseTo(14.667, 1)
    expect(breakdown.s3_ctr).toBeCloseTo(10, 1)
    expect(breakdown.s4_cpc).toBeCloseTo(8, 1)
    expect(breakdown.s5_cpa).toBeCloseTo(7.5, 1)
    expect(breakdown.s6_roas).toBeCloseTo(12.5, 1)
    expect(breakdown.s7_freshness).toBe(5) // today

    // total = 20 + 14.667 + 10 + 8 + 7.5 + 12.5 + 5 = 77.667 → round = 78
    expect(breakdown.total).toBe(78)
  })

  it('clamps total to 100 max', () => {
    const log = makeLog({
      log_date: '2026-03-06',
      hook_rate: 100,
      hold_rate: 50,
      ctr: 10,
      cpc: 0.1,
      cpa: 5,
      roas: 10,
    })
    const breakdown = calculateScoreBreakdown(log, today)
    expect(breakdown.total).toBeLessThanOrEqual(100)
  })

  it('uses Math.round for total', () => {
    const log = makeLog({
      log_date: '2026-03-06',
      hook_rate: 30, // s1 = ((30-25)/25)*15 = 3
      hold_rate: null,
      ctr: null,
      cpc: null,
      cpa: null,
      roas: null,
    })
    const breakdown = calculateScoreBreakdown(log, today)
    // s1=3 + s7=5 = 8
    expect(breakdown.total).toBe(8)
  })
})

// ============================================================
// classifyScore
// ============================================================

describe('classifyScore', () => {
  it('80–100 → Winner forte', () => {
    expect(classifyScore(80)).toBe('Winner forte')
    expect(classifyScore(100)).toBe('Winner forte')
  })
  it('60–79 → Promissor', () => {
    expect(classifyScore(60)).toBe('Promissor')
    expect(classifyScore(79)).toBe('Promissor')
  })
  it('40–59 → Em observação', () => {
    expect(classifyScore(40)).toBe('Em observação')
    expect(classifyScore(59)).toBe('Em observação')
  })
  it('20–39 → Fraco', () => {
    expect(classifyScore(20)).toBe('Fraco')
    expect(classifyScore(39)).toBe('Fraco')
  })
  it('0–19 → Muito fraco', () => {
    expect(classifyScore(0)).toBe('Muito fraco')
    expect(classifyScore(19)).toBe('Muito fraco')
  })
})

// ============================================================
// calculateDeltas
// ============================================================

describe('calculateDeltas', () => {
  it('no previous log → all null deltas', () => {
    const current = makeLog({ hook_rate: 50, hold_rate: 20, ctr: 3, cpc: 1.5, cpa: 30, roas: 2 })
    const deltas = calculateDeltas(current, null)
    expect(deltas.deltaHookRate).toBeNull()
    expect(deltas.deltaHoldRate).toBeNull()
    expect(deltas.deltaCTR).toBeNull()
    expect(deltas.deltaCPC).toBeNull()
    expect(deltas.deltaCPA).toBeNull()
    expect(deltas.deltaROAS).toBeNull()
  })

  it('calculates correct deltas', () => {
    const previous = makeLog({ hook_rate: 40, hold_rate: 15, ctr: 2, cpc: 2, cpa: 50, roas: 1.5 })
    const current = makeLog({ hook_rate: 55, hold_rate: 20, ctr: 3, cpc: 1.5, cpa: 30, roas: 2.5 })
    const deltas = calculateDeltas(current, previous)
    expect(deltas.deltaHookRate).toBeCloseTo(15, 5)
    expect(deltas.deltaHoldRate).toBeCloseTo(5, 5)
    expect(deltas.deltaCTR).toBeCloseTo(1, 5)
    expect(deltas.deltaCPC).toBeCloseTo(-0.5, 5)
    expect(deltas.deltaCPA).toBeCloseTo(-20, 5)
    expect(deltas.deltaROAS).toBeCloseTo(1, 5)
  })

  it('returns null for individual null metrics', () => {
    const previous = makeLog({ hook_rate: 40, hold_rate: null })
    const current = makeLog({ hook_rate: 55, hold_rate: 20 })
    const deltas = calculateDeltas(current, previous)
    expect(deltas.deltaHookRate).toBeCloseTo(15, 5)
    expect(deltas.deltaHoldRate).toBeNull()
  })
})
