'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:   'bg-haven-teal text-white hover:bg-haven-teal-dark shadow-haven hover:shadow-haven-lg',
        secondary: 'border-2 border-haven-teal text-haven-teal-dark hover:bg-haven-teal-pale',
        ghost:     'text-haven-navy hover:bg-haven-gray-pale',
        danger:    'bg-haven-error text-white hover:bg-red-600 shadow-sm',
        navy:      'bg-haven-navy text-white hover:bg-haven-navy-light shadow-md',
        link:      'text-haven-teal underline-offset-4 hover:underline p-0 h-auto',
        white:     'bg-white text-haven-navy hover:bg-haven-cream shadow-sm border border-haven-sand/40',
      },
      size: {
        sm:   'h-8  px-4  text-sm',
        md:   'h-11 px-6  text-sm',
        lg:   'h-13 px-8  text-base',
        xl:   'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
