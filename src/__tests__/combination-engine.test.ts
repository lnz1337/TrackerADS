import { describe, it, expect } from 'vitest'
import {
  isHookDonor,
  isHoldDonor,
  areEligibleForCombination,
  evaluateCompatibilityCriteria,
  calculateCompatibilityScore,
  generateSuggestionText,
  findCombinations,
  rankCombinations,
} from '../lib/combination-engine'
import type { Creative, CreativeMetricsLog, CombinationSuggestion } from '../lib/types'

function makeCreative(overrides: Partial<Creative> = {}): Creative {
  return {
    id: 'c-1',
    name: 'Creative 1',
    platform: 'Meta',
    offer_name: 'Oferta A',
    niche: 'Saúde',
    region: 'Brasil',
    creative_type: 'UGC',
    angle: 'Dor',
    hook_text: null,
    hook_type: 'Pergunta',
    hold_structure: 'Storytelling',
    main_copy: null,
    cta_type: null,
    duration_seconds: 30,
    creative_url: null,
    ad_url: null,
    status: 'Em teste',
    start_date: '2026-03-01',
    notes: null,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    ...overrides,
  }
}

function makeLog(overrides: Partial<CreativeMetricsLog> = {}): CreativeMetricsLog {
  return {
    id: 'log-1',
    creative_id: 'c-1',
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
// isHookDonor
// ============================================================

describe('isHookDonor', () => {
  it('Bom + Ruim → true', () => {
    expect(isHookDonor('Bom', 'Ruim')).toBe(true)
  })
  it('Bom + Médio → true', () => {
    expect(isHookDonor('Bom', 'Médio')).toBe(true)
  })
  it('Bom + Bom → false', () => {
    expect(isHookDonor('Bom', 'Bom')).toBe(false)
  })
  it('Médio + Ruim → false', () => {
    expect(isHookDonor('Médio', 'Ruim')).toBe(false)
  })
  it('Sem dados → false', () => {
    expect(isHookDonor('Sem dados', 'Ruim')).toBe(false)
  })
})

// ============================================================
// isHoldDonor
// ============================================================

describe('isHoldDonor', () => {
  it('Ruim + Bom → true', () => {
    expect(isHoldDonor('Ruim', 'Bom')).toBe(true)
  })
  it('Médio + Bom → true', () => {
    expect(isHoldDonor('Médio', 'Bom')).toBe(true)
  })
  it('Bom + Bom → false', () => {
    expect(isHoldDonor('Bom', 'Bom')).toBe(false)
  })
  it('Ruim + Médio → false', () => {
    expect(isHoldDonor('Ruim', 'Médio')).toBe(false)
  })
  it('Sem dados → false', () => {
    expect(isHoldDonor('Sem dados', 'Bom')).toBe(false)
  })
})

// ============================================================
// areEligibleForCombination
// ============================================================

describe('areEligibleForCombination', () => {
  it('same platform/offer/region → eligible', () => {
    const a = makeCreative({ id: 'a', platform: 'Meta', offer_name: 'X', region: 'BR' })
    const b = makeCreative({ id: 'b', platform: 'Meta', offer_name: 'X', region: 'BR' })
    expect(areEligibleForCombination(a, b)).toBe(true)
  })

  it('same id → not eligible', () => {
    const a = makeCreative({ id: 'a' })
    expect(areEligibleForCombination(a, a)).toBe(false)
  })

  it('different platform → not eligible', () => {
    const a = makeCreative({ id: 'a', platform: 'Meta' })
    const b = makeCreative({ id: 'b', platform: 'TikTok' })
    expect(areEligibleForCombination(a, b)).toBe(false)
  })

  it('different offer → not eligible', () => {
    const a = makeCreative({ id: 'a', offer_name: 'Oferta A' })
    const b = makeCreative({ id: 'b', offer_name: 'Oferta B' })
    expect(areEligibleForCombination(a, b)).toBe(false)
  })

  it('different region → not eligible', () => {
    const a = makeCreative({ id: 'a', region: 'Brasil' })
    const b = makeCreative({ id: 'b', region: 'EUA' })
    expect(areEligibleForCombination(a, b)).toBe(false)
  })
})

// ============================================================
// calculateCompatibilityScore
// ============================================================

describe('calculateCompatibilityScore', () => {
  it('all criteria met → 100', () => {
    const score = calculateCompatibilityScore({
      sameAngle: true,
      sameCreativeType: true,
      similarDuration: true,
      sameHookType: true,
      sameHoldStructure: true,
      sameNiche: true,
      bothRecent: true,
    })
    expect(score).toBe(100)
  })

  it('no criteria met → 0', () => {
    const score = calculateCompatibilityScore({
      sameAngle: false,
      sameCreativeType: false,
      similarDuration: false,
      sameHookType: false,
      sameHoldStructure: false,
      sameNiche: false,
      bothRecent: false,
    })
    expect(score).toBe(0)
  })

  it('partial criteria → correct sum', () => {
    const score = calculateCompatibilityScore({
      sameAngle: true,    // 25
      sameCreativeType: false,
      similarDuration: true, // 15
      sameHookType: false,
      sameHoldStructure: false,
      sameNiche: true,    // 10
      bothRecent: false,
    })
    expect(score).toBe(50)
  })
})

// ============================================================
// evaluateCompatibilityCriteria
// ============================================================

describe('evaluateCompatibilityCriteria', () => {
  const today = new Date('2026-03-06')

  it('evaluates all criteria correctly when matched', () => {
    const hookDonor = makeCreative({
      id: 'a',
      angle: 'Dor',
      creative_type: 'UGC',
      duration_seconds: 30,
      hook_type: 'Pergunta',
      hold_structure: 'Storytelling',
      niche: 'Saúde',
    })
    const holdDonor = makeCreative({
      id: 'b',
      angle: 'Dor',
      creative_type: 'UGC',
      duration_seconds: 35,
      hook_type: 'Pergunta',
      hold_structure: 'Storytelling',
      niche: 'Saúde',
    })
    const hookLog = makeLog({ creative_id: 'a', log_date: '2026-03-05' })
    const holdLog = makeLog({ creative_id: 'b', log_date: '2026-03-04' })

    const criteria = evaluateCompatibilityCriteria(hookDonor, holdDonor, hookLog, holdLog, today)

    expect(criteria.sameAngle).toBe(true)
    expect(criteria.sameCreativeType).toBe(true)
    expect(criteria.similarDuration).toBe(true) // |30-35| = 5 <= 15
    expect(criteria.sameHookType).toBe(true)
    expect(criteria.sameHoldStructure).toBe(true)
    expect(criteria.sameNiche).toBe(true)
    expect(criteria.bothRecent).toBe(true) // both within 7 days
  })

  it('duration null → similarDuration false', () => {
    const hookDonor = makeCreative({ id: 'a', duration_seconds: null })
    const holdDonor = makeCreative({ id: 'b', duration_seconds: 30 })
    const hookLog = makeLog({ creative_id: 'a' })
    const holdLog = makeLog({ creative_id: 'b' })

    const criteria = evaluateCompatibilityCriteria(hookDonor, holdDonor, hookLog, holdLog, today)
    expect(criteria.similarDuration).toBe(false)
  })

  it('duration difference > 15 → similarDuration false', () => {
    const hookDonor = makeCreative({ id: 'a', duration_seconds: 10 })
    const holdDonor = makeCreative({ id: 'b', duration_seconds: 60 })
    const hookLog = makeLog({ creative_id: 'a' })
    const holdLog = makeLog({ creative_id: 'b' })

    const criteria = evaluateCompatibilityCriteria(hookDonor, holdDonor, hookLog, holdLog, today)
    expect(criteria.similarDuration).toBe(false)
  })

  it('old logs → bothRecent false', () => {
    const hookDonor = makeCreative({ id: 'a' })
    const holdDonor = makeCreative({ id: 'b' })
    const hookLog = makeLog({ creative_id: 'a', log_date: '2026-02-01' })
    const holdLog = makeLog({ creative_id: 'b', log_date: '2026-03-05' })

    const criteria = evaluateCompatibilityCriteria(hookDonor, holdDonor, hookLog, holdLog, today)
    expect(criteria.bothRecent).toBe(false)
  })
})

// ============================================================
// generateSuggestionText
// ============================================================

describe('generateSuggestionText', () => {
  it('generates correct text', () => {
    const hookDonor = makeCreative({ id: 'a', name: 'Criativo Alpha' })
    const holdDonor = makeCreative({ id: 'b', name: 'Criativo Beta' })
    const hookLog = makeLog({ hook_rate: 65.3, hold_rate: 8.2 })
    const holdLog = makeLog({ hook_rate: 18.5, hold_rate: 28.7 })

    const text = generateSuggestionText(hookDonor, holdDonor, hookLog, holdLog)

    expect(text).toContain('Criativo Alpha')
    expect(text).toContain('Criativo Beta')
    expect(text).toContain('65.3%')
    expect(text).toContain('8.2%')
    expect(text).toContain('18.5%')
    expect(text).toContain('28.7%')
  })

  it('handles null rates with N/A', () => {
    const hookDonor = makeCreative({ id: 'a', name: 'A' })
    const holdDonor = makeCreative({ id: 'b', name: 'B' })
    const hookLog = makeLog({ hook_rate: null, hold_rate: null })
    const holdLog = makeLog({ hook_rate: null, hold_rate: null })

    const text = generateSuggestionText(hookDonor, holdDonor, hookLog, holdLog)
    expect(text).toContain('N/A')
  })
})

// ============================================================
// findCombinations
// ============================================================

describe('findCombinations', () => {
  const today = new Date('2026-03-06')

  it('finds valid combination between hook and hold donors', () => {
    const hookDonorCreative = makeCreative({
      id: 'hd',
      name: 'Hook Donor',
      platform: 'Meta',
      offer_name: 'Oferta A',
      region: 'Brasil',
    })
    const holdDonorCreative = makeCreative({
      id: 'hld',
      name: 'Hold Donor',
      platform: 'Meta',
      offer_name: 'Oferta A',
      region: 'Brasil',
    })

    const logs: Record<string, CreativeMetricsLog[]> = {
      hd: [makeLog({ creative_id: 'hd', hook_rate: 60, hold_rate: 8 })], // Hook Bom, Hold Ruim
      hld: [makeLog({ creative_id: 'hld', hook_rate: 15, hold_rate: 25 })], // Hook Ruim, Hold Bom
    }

    const combos = findCombinations([hookDonorCreative, holdDonorCreative], logs, today)

    expect(combos).toHaveLength(1)
    expect(combos[0].hookDonor.id).toBe('hd')
    expect(combos[0].holdDonor.id).toBe('hld')
  })

  it('no combination when platforms differ', () => {
    const a = makeCreative({ id: 'a', platform: 'Meta', offer_name: 'X', region: 'BR' })
    const b = makeCreative({ id: 'b', platform: 'TikTok', offer_name: 'X', region: 'BR' })

    const logs: Record<string, CreativeMetricsLog[]> = {
      a: [makeLog({ creative_id: 'a', hook_rate: 60, hold_rate: 5 })],
      b: [makeLog({ creative_id: 'b', hook_rate: 10, hold_rate: 25 })],
    }

    expect(findCombinations([a, b], logs, today)).toHaveLength(0)
  })

  it('no combination when offers differ', () => {
    const a = makeCreative({ id: 'a', platform: 'Meta', offer_name: 'A', region: 'BR' })
    const b = makeCreative({ id: 'b', platform: 'Meta', offer_name: 'B', region: 'BR' })

    const logs: Record<string, CreativeMetricsLog[]> = {
      a: [makeLog({ creative_id: 'a', hook_rate: 60, hold_rate: 5 })],
      b: [makeLog({ creative_id: 'b', hook_rate: 10, hold_rate: 25 })],
    }

    expect(findCombinations([a, b], logs, today)).toHaveLength(0)
  })

  it('no combination when regions differ', () => {
    const a = makeCreative({ id: 'a', platform: 'Meta', offer_name: 'X', region: 'BR' })
    const b = makeCreative({ id: 'b', platform: 'Meta', offer_name: 'X', region: 'US' })

    const logs: Record<string, CreativeMetricsLog[]> = {
      a: [makeLog({ creative_id: 'a', hook_rate: 60, hold_rate: 5 })],
      b: [makeLog({ creative_id: 'b', hook_rate: 10, hold_rate: 25 })],
    }

    expect(findCombinations([a, b], logs, today)).toHaveLength(0)
  })

  it('no combination when no logs', () => {
    const a = makeCreative({ id: 'a' })
    const b = makeCreative({ id: 'b' })

    expect(findCombinations([a, b], {}, today)).toHaveLength(0)
  })
})

// ============================================================
// rankCombinations
// ============================================================

describe('rankCombinations', () => {
  it('ranks by compatibilityScore descending', () => {
    const combo1 = {
      compatibilityScore: 50,
      hookDonorLog: makeLog({ hook_rate: 60 }),
      holdDonorLog: makeLog({ hold_rate: 25 }),
    } as CombinationSuggestion

    const combo2 = {
      compatibilityScore: 80,
      hookDonorLog: makeLog({ hook_rate: 55 }),
      holdDonorLog: makeLog({ hold_rate: 22 }),
    } as CombinationSuggestion

    const ranked = rankCombinations([combo1, combo2])
    expect(ranked[0].compatibilityScore).toBe(80)
    expect(ranked[1].compatibilityScore).toBe(50)
  })

  it('breaks ties with hook_rate of hook donor', () => {
    const combo1 = {
      compatibilityScore: 50,
      hookDonorLog: makeLog({ hook_rate: 60 }),
      holdDonorLog: makeLog({ hold_rate: 25, log_date: '2026-03-05' }),
    } as CombinationSuggestion

    const combo2 = {
      compatibilityScore: 50,
      hookDonorLog: makeLog({ hook_rate: 70 }),
      holdDonorLog: makeLog({ hold_rate: 25, log_date: '2026-03-05' }),
    } as CombinationSuggestion

    const ranked = rankCombinations([combo1, combo2])
    expect(ranked[0].hookDonorLog.hook_rate).toBe(70)
  })

  it('breaks ties further with hold_rate of hold donor', () => {
    const combo1 = {
      compatibilityScore: 50,
      hookDonorLog: makeLog({ hook_rate: 60, log_date: '2026-03-05' }),
      holdDonorLog: makeLog({ hold_rate: 25, log_date: '2026-03-05' }),
    } as CombinationSuggestion

    const combo2 = {
      compatibilityScore: 50,
      hookDonorLog: makeLog({ hook_rate: 60, log_date: '2026-03-05' }),
      holdDonorLog: makeLog({ hold_rate: 30, log_date: '2026-03-05' }),
    } as CombinationSuggestion

    const ranked = rankCombinations([combo1, combo2])
    expect(ranked[0].holdDonorLog.hold_rate).toBe(30)
  })
})
