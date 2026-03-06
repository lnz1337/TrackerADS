import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return '—'
  return `${value.toFixed(1)}%`
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—'
  return `R$ ${value.toFixed(2)}`
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '—'
  return value.toLocaleString('pt-BR')
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'dd/MM/yyyy', { locale: ptBR })
}

export function formatDecimal(value: number | null | undefined, decimals: number = 2): string {
  if (value == null) return '—'
  return value.toFixed(decimals)
}
