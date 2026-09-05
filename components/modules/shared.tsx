'use client'

import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-balance text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'default',
  icon,
}: {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'positive' | 'destructive'
  icon?: ReactNode
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-xs text-primary">{label}</p>
          <p className="mt-2 font-mono text-xl font-semibold">{value}</p>
          {hint && (
            <p
              className={cn(
                'mt-2 text-xs text-muted-foreground',
                tone === 'positive' && 'text-positive',
                tone === 'destructive' && 'text-destructive',
              )}
            >
              {hint}
            </p>
          )}
        </div>
        {icon && <span className="rounded-full bg-primary/15 p-2 text-primary">{icon}</span>}
      </CardContent>
    </Card>
  )
}

export function directionClass(direction: string) {
  return direction.toLowerCase() === 'buy' ? 'text-positive' : 'text-destructive'
}

export function plClass(value: number) {
  return value >= 0 ? 'text-positive' : 'text-destructive'
}

export function money(value: number, opts: { sign?: boolean } = {}) {
  const sign = opts.sign && value > 0 ? '+' : ''
  return `${sign}${value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function Sparkline({ points, className }: { points: number[]; className?: string }) {
  const w = 96
  const h = 35
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  return (
    <svg className={cn('h-9 w-24', className)} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        points={points.map((p, i) => `${(i * w) / (points.length - 1)},${h - ((p - min) / range) * 30}`).join(' ')}
      />
    </svg>
  )
}
