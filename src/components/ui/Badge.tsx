'use client'

import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-50 text-gray-600',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export function getHookBadgeVariant(classification: string): BadgeVariant {
  switch (classification) {
    case 'Bom': return 'success'
    case 'Médio': return 'warning'
    case 'Ruim': return 'danger'
    default: return 'neutral'
  }
}

export function getHoldBadgeVariant(classification: string): BadgeVariant {
  return getHookBadgeVariant(classification)
}

export function getStatusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case 'Vencedor': return 'success'
    case 'Em teste': return 'info'
    case 'Iterando': return 'warning'
    case 'Pausado': return 'neutral'
    case 'Perdedor': return 'danger'
    default: return 'default'
  }
}

export function getScoreBadgeVariant(classification: string): BadgeVariant {
  switch (classification) {
    case 'Winner forte': return 'success'
    case 'Promissor': return 'info'
    case 'Em observação': return 'warning'
    case 'Fraco': return 'danger'
    case 'Muito fraco': return 'danger'
    default: return 'neutral'
  }
}
