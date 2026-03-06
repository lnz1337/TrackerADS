import { z } from 'zod'

export const creativeSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  platform: z.enum(['YouTube', 'Meta', 'TikTok', 'Outro'], {
    message: 'Plataforma é obrigatória',
  }),
  offer_name: z.string().min(1, 'Nome da oferta é obrigatório'),
  niche: z.string().optional().or(z.literal('')),
  region: z.string().optional().or(z.literal('')),
  creative_type: z.string().optional().or(z.literal('')),
  angle: z.string().optional().or(z.literal('')),
  hook_text: z.string().optional().or(z.literal('')),
  hook_type: z.string().optional().or(z.literal('')),
  hold_structure: z.string().optional().or(z.literal('')),
  main_copy: z.string().optional().or(z.literal('')),
  cta_type: z.string().optional().or(z.literal('')),
  duration_seconds: z
    .union([z.coerce.number().int().min(0, 'Duração deve ser >= 0'), z.literal(''), z.null()])
    .optional(),
  creative_url: z.string().url('URL inválida').optional().or(z.literal('')),
  ad_url: z.string().url('URL inválida').optional().or(z.literal('')),
  status: z.enum(['Em teste', 'Vencedor', 'Pausado', 'Perdedor', 'Iterando'], {
    message: 'Status é obrigatório',
  }),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  notes: z.string().optional().or(z.literal('')),
})

export type CreativeFormData = z.infer<typeof creativeSchema>

const optionalPositiveNumber = z
  .union([z.coerce.number().min(0, 'Valor deve ser >= 0'), z.literal(''), z.null()])
  .optional()

const optionalPositiveInt = z
  .union([z.coerce.number().int().min(0, 'Valor deve ser >= 0'), z.literal(''), z.null()])
  .optional()

export const metricsLogSchema = z.object({
  log_date: z.string().min(1, 'Data é obrigatória'),
  impressions: optionalPositiveInt,
  cpm: optionalPositiveNumber,
  cpc: optionalPositiveNumber,
  ctr: optionalPositiveNumber,
  link_ctr: optionalPositiveNumber,
  hook_rate: optionalPositiveNumber,
  hold_rate: optionalPositiveNumber,
  thumbstop_rate: optionalPositiveNumber,
  view_25: optionalPositiveNumber,
  view_50: optionalPositiveNumber,
  view_75: optionalPositiveNumber,
  view_95: optionalPositiveNumber,
  clicks: optionalPositiveInt,
  cost: optionalPositiveNumber,
  leads: optionalPositiveInt,
  checkouts: optionalPositiveInt,
  sales: optionalPositiveInt,
  revenue: optionalPositiveNumber,
  cpa: optionalPositiveNumber,
  roas: optionalPositiveNumber,
  notes: z.string().optional().or(z.literal('')),
})

export type MetricsLogFormData = z.infer<typeof metricsLogSchema>
