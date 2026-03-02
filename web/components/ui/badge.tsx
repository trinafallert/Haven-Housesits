import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'teal' | 'new' | 'paid' | 'free' | 'hot' | 'navy' | 'warning' | 'success'
  size?: 'sm' | 'md'
  className?: string
}

const variantMap: Record<string, string> = {
  teal:    'bg-haven-teal-pale text-haven-teal-dark',
  new:     'bg-haven-teal text-white',
  paid:    'bg-amber-50 text-amber-700 border border-amber-200',
  free:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  hot:     'bg-red-50 text-red-600',
  navy:    'bg-haven-navy text-white',
  warning: 'bg-amber-50 text-amber-700',
  success: 'bg-emerald-50 text-emerald-700',
}

const sizeMap: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({ children, variant = 'teal', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold',
        variantMap[variant],
        sizeMap[size],
        className
      )}
    >
      {children}
    </span>
  )
}

// ─── Verified chip ─────────────────────────────────────────────────────────

interface VerifiedChipProps {
  label?: string
  className?: string
}

export function VerifiedChip({ label = 'Verified', className }: VerifiedChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-haven-teal-pale text-haven-teal-dark text-xs font-semibold',
        className
      )}
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  )
}

// ─── Sit Match Score badge (Haven exclusive) ─────────────────────────────

interface MatchScoreProps {
  score: number
  className?: string
}

export function MatchScore({ score, className }: MatchScoreProps) {
  const color =
    score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-haven-gray-pale text-haven-gray border-haven-sand'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border',
        color,
        className
      )}
    >
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {score}% Match
    </span>
  )
}
