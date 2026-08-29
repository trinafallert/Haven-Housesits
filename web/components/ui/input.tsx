'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  charCount?: { current: number; max?: number; min?: number }
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, charCount, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-haven-gray">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'input',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-haven-error focus:ring-haven-error/40',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-haven-gray">
              {rightIcon}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            {error && <p className="text-xs text-haven-error font-medium">{error}</p>}
            {hint && !error && <p className="text-xs text-haven-gray">{hint}</p>}
          </div>
          {charCount && (
            <span
              className={cn(
                'text-xs font-medium',
                charCount.min && charCount.current < charCount.min
                  ? 'text-haven-gray-light'
                  : 'text-haven-teal'
              )}
            >
              {charCount.min && charCount.current < charCount.min ? (
                `Min ${charCount.min} characters`
              ) : (
                <>&#10003; {charCount.current}</>
              )}
              {charCount.max && ` / ${charCount.max}`}
            </span>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = 'Input'

// ─── Textarea ────────────────────────────────────────────────────────────────

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  charCount?: { current: number; max?: number; min?: number }
  hintBox?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, charCount, hintBox, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        {hintBox && (
          <div className="bg-haven-gray-pale rounded-xl px-4 py-3 text-sm text-haven-gray">
            {hintBox}{' '}
            <button type="button" className="font-semibold underline text-haven-navy text-xs">
              Read more
            </button>
          </div>
        )}
        <div className="relative">
          <textarea
            id={inputId}
            ref={ref}
            className={cn(
              'input min-h-[100px] resize-none',
              error && 'border-haven-error focus:ring-haven-error/40',
              charCount && 'pb-8',
              className
            )}
            {...props}
          />
          {charCount && (
            <span
              className={cn(
                'absolute bottom-2.5 right-3 text-xs font-medium',
                charCount.min && charCount.current < charCount.min
                  ? 'text-haven-gray-light'
                  : 'text-haven-teal'
              )}
            >
              {charCount.min && charCount.current < charCount.min
                ? `Min ${charCount.min}`
                : `✓ ${charCount.current}`}
              {charCount.max && ` / ${charCount.max}`}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-haven-error font-medium">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-haven-gray">
            {hint}
          </p>
        )}
        {charCount?.min && (
          <p className="text-xs text-haven-teal">Min {charCount.min} characters</p>
        )}
        {charCount?.max && !charCount.min && (
          <p className="text-xs text-haven-teal">Max {charCount.max} characters</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Input, Textarea }
