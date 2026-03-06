export const PLATFORMS = ['YouTube', 'Meta', 'TikTok', 'Outro'] as const

export const STATUSES = ['Em teste', 'Vencedor', 'Pausado', 'Perdedor', 'Iterando'] as const

export const CREATIVE_TYPES = [
  'UGC',
  'VSL',
  'Imagem estática',
  'Carrossel',
  'Animação',
  'Mashup',
  'Outro',
] as const

export const HOOK_TYPES = [
  'Pergunta',
  'Afirmação chocante',
  'Problema/Dor',
  'Curiosidade',
  'Prova social',
  'Antes/Depois',
  'Outro',
] as const

export const HOLD_STRUCTURES = [
  'Storytelling',
  'Listicle',
  'Demo do produto',
  'Depoimento',
  'Problema → Solução',
  'Educativo',
  'Outro',
] as const

export const CTA_TYPES = [
  'Link na bio',
  'Arraste pra cima',
  'Clique no link',
  'Saiba mais',
  'Compre agora',
  'Outro',
] as const

// Hook Rate classification thresholds
export const HOOK_RATE_THRESHOLDS = {
  BOM: 50,
  MEDIO: 25,
} as const

// Hold Rate classification thresholds
export const HOLD_RATE_THRESHOLDS = {
  BOM: 20,
  MEDIO: 10,
} as const

// Score classification thresholds
export const SCORE_THRESHOLDS = {
  WINNER_FORTE: 80,
  PROMISSOR: 60,
  EM_OBSERVACAO: 40,
  FRACO: 20,
} as const

// Compatibility criteria weights
export const COMPATIBILITY_WEIGHTS = {
  SAME_ANGLE: 25,
  SAME_CREATIVE_TYPE: 20,
  SIMILAR_DURATION: 15,
  SAME_HOOK_TYPE: 10,
  SAME_HOLD_STRUCTURE: 10,
  SAME_NICHE: 10,
  BOTH_RECENT: 10,
} as const

export const DURATION_SIMILARITY_THRESHOLD = 15 // seconds
export const RECENT_DAYS_THRESHOLD = 7 // days
