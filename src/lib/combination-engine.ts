import { differenceInDays, parseISO } from 'date-fns'
import type {
  Creative,
  CreativeMetricsLog,
  HookClassification,
  HoldClassification,
  CombinationSuggestion,
  CompatibilityCriteria,
} from './types'
import { classifyHookRate, classifyHoldRate, getLatestLog } from './metrics'
import {
  COMPATIBILITY_WEIGHTS,
  DURATION_SIMILARITY_THRESHOLD,
  RECENT_DAYS_THRESHOLD,
} from './constants'

// ============================================================
// DONOR IDENTIFICATION
// ============================================================

export function isHookDonor(
  hookClass: HookClassification,
  holdClass: HoldClassification
): boolean {
  return hookClass === 'Bom' && (holdClass === 'Ruim' || holdClass === 'Médio')
}

export function isHoldDonor(
  hookClass: HookClassification,
  holdClass: HoldClassification
): boolean {
  return (hookClass === 'Ruim' || hookClass === 'Médio') && holdClass === 'Bom'
}

// ============================================================
// ELIGIBILITY
// ============================================================

export function areEligibleForCombination(a: Creative, b: Creative): boolean {
  if (a.id === b.id) return false
  if (a.platform !== b.platform) return false
  if (a.offer_name !== b.offer_name) return false
  if (a.region !== b.region) return false
  return true
}

// ============================================================
// COMPATIBILITY SCORE
// ============================================================

export function evaluateCompatibilityCriteria(
  hookDonor: Creative,
  holdDonor: Creative,
  hookDonorLog: CreativeMetricsLog,
  holdDonorLog: CreativeMetricsLog,
  today: Date
): CompatibilityCriteria {
  const sameAngle =
    hookDonor.angle != null &&
    holdDonor.angle != null &&
    hookDonor.angle === holdDonor.angle

  const sameCreativeType =
    hookDonor.creative_type != null &&
    holdDonor.creative_type != null &&
    hookDonor.creative_type === holdDonor.creative_type

  let similarDuration = false
  if (hookDonor.duration_seconds != null && holdDonor.duration_seconds != null) {
    similarDuration =
      Math.abs(hookDonor.duration_seconds - holdDonor.duration_seconds) <=
      DURATION_SIMILARITY_THRESHOLD
  }

  const sameHookType =
    hookDonor.hook_type != null &&
    holdDonor.hook_type != null &&
    hookDonor.hook_type === holdDonor.hook_type

  const sameHoldStructure =
    hookDonor.hold_structure != null &&
    holdDonor.hold_structure != null &&
    hookDonor.hold_structure === holdDonor.hold_structure

  const sameNiche =
    hookDonor.niche != null &&
    holdDonor.niche != null &&
    hookDonor.niche === holdDonor.niche

  const hookDonorDays = differenceInDays(today, parseISO(hookDonorLog.log_date))
  const holdDonorDays = differenceInDays(today, parseISO(holdDonorLog.log_date))
  const bothRecent =
    hookDonorDays <= RECENT_DAYS_THRESHOLD && holdDonorDays <= RECENT_DAYS_THRESHOLD

  return {
    sameAngle,
    sameCreativeType,
    similarDuration,
    sameHookType,
    sameHoldStructure,
    sameNiche,
    bothRecent,
  }
}

export function calculateCompatibilityScore(criteria: CompatibilityCriteria): number {
  let score = 0
  if (criteria.sameAngle) score += COMPATIBILITY_WEIGHTS.SAME_ANGLE
  if (criteria.sameCreativeType) score += COMPATIBILITY_WEIGHTS.SAME_CREATIVE_TYPE
  if (criteria.similarDuration) score += COMPATIBILITY_WEIGHTS.SIMILAR_DURATION
  if (criteria.sameHookType) score += COMPATIBILITY_WEIGHTS.SAME_HOOK_TYPE
  if (criteria.sameHoldStructure) score += COMPATIBILITY_WEIGHTS.SAME_HOLD_STRUCTURE
  if (criteria.sameNiche) score += COMPATIBILITY_WEIGHTS.SAME_NICHE
  if (criteria.bothRecent) score += COMPATIBILITY_WEIGHTS.BOTH_RECENT
  return score
}

// ============================================================
// SUGGESTION TEXT
// ============================================================

export function generateSuggestionText(
  hookDonor: Creative,
  holdDonor: Creative,
  hookDonorLog: CreativeMetricsLog,
  holdDonorLog: CreativeMetricsLog
): string {
  const hookHookRate = hookDonorLog.hook_rate != null ? `${hookDonorLog.hook_rate.toFixed(1)}%` : 'N/A'
  const hookHoldRate = hookDonorLog.hold_rate != null ? `${hookDonorLog.hold_rate.toFixed(1)}%` : 'N/A'
  const holdHookRate = holdDonorLog.hook_rate != null ? `${holdDonorLog.hook_rate.toFixed(1)}%` : 'N/A'
  const holdHoldRate = holdDonorLog.hold_rate != null ? `${holdDonorLog.hold_rate.toFixed(1)}%` : 'N/A'

  return `Teste um novo criativo usando o hook de ${hookDonor.name} com o desenvolvimento/hold de ${holdDonor.name}. O primeiro apresenta Hook forte (${hookHookRate}), mas retenção mais fraca (${hookHoldRate}). O segundo tem abertura mais fraca (${holdHookRate}), porém segura melhor a audiência (${holdHoldRate}).`
}

// ============================================================
// COMBINATION ENGINE
// ============================================================

export function findCombinations(
  creatives: Creative[],
  logsByCreativeId: Record<string, CreativeMetricsLog[]>,
  today: Date
): CombinationSuggestion[] {
  const combinations: CombinationSuggestion[] = []

  // Pre-compute classifications for each creative
  const creativeData = creatives.map((c) => {
    const logs = logsByCreativeId[c.id] || []
    const latestLog = getLatestLog(logs)
    const hookClass = latestLog ? classifyHookRate(latestLog.hook_rate) : 'Sem dados' as HookClassification
    const holdClass = latestLog ? classifyHoldRate(latestLog.hold_rate) : 'Sem dados' as HoldClassification
    return { creative: c, latestLog, hookClass, holdClass }
  })

  for (const a of creativeData) {
    for (const b of creativeData) {
      // A is hook donor, B is hold donor
      if (!a.latestLog || !b.latestLog) continue
      if (!isHookDonor(a.hookClass, a.holdClass)) continue
      if (!isHoldDonor(b.hookClass, b.holdClass)) continue
      if (!areEligibleForCombination(a.creative, b.creative)) continue

      const criteria = evaluateCompatibilityCriteria(
        a.creative,
        b.creative,
        a.latestLog,
        b.latestLog,
        today
      )
      const compatibilityScore = calculateCompatibilityScore(criteria)
      const suggestionText = generateSuggestionText(
        a.creative,
        b.creative,
        a.latestLog,
        b.latestLog
      )

      combinations.push({
        hookDonor: a.creative,
        holdDonor: b.creative,
        hookDonorLog: a.latestLog,
        holdDonorLog: b.latestLog,
        compatibilityScore,
        criteria,
        suggestionText,
        tested: false,
      })
    }
  }

  return rankCombinations(combinations)
}

// ============================================================
// RANKING
// ============================================================

export function rankCombinations(
  combinations: CombinationSuggestion[]
): CombinationSuggestion[] {
  return [...combinations].sort((a, b) => {
    // 1. higher compatibilityScore
    if (b.compatibilityScore !== a.compatibilityScore) {
      return b.compatibilityScore - a.compatibilityScore
    }
    // 2. higher hook_rate of hook donor
    const aHookRate = a.hookDonorLog.hook_rate ?? 0
    const bHookRate = b.hookDonorLog.hook_rate ?? 0
    if (bHookRate !== aHookRate) {
      return bHookRate - aHookRate
    }
    // 3. higher hold_rate of hold donor
    const aHoldRate = a.holdDonorLog.hold_rate ?? 0
    const bHoldRate = b.holdDonorLog.hold_rate ?? 0
    if (bHoldRate !== aHoldRate) {
      return bHoldRate - aHoldRate
    }
    // 4. most recent update
    const aDate = Math.max(
      new Date(a.hookDonorLog.log_date).getTime(),
      new Date(a.holdDonorLog.log_date).getTime()
    )
    const bDate = Math.max(
      new Date(b.hookDonorLog.log_date).getTime(),
      new Date(b.holdDonorLog.log_date).getTime()
    )
    return bDate - aDate
  })
}
