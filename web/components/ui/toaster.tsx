'use client'

import { useToast } from '@/hooks/use-toast'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-2xl shadow-card-hover border animate-slide-up',
            toast.variant === 'success' && 'bg-white border-emerald-100',
            toast.variant === 'error'   && 'bg-white border-red-100',
            toast.variant === 'info'    && 'bg-white border-haven-teal/20',
            !toast.variant              && 'bg-white border-haven-sand/40',
          )}
        >
          {toast.variant === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />}
          {toast.variant === 'error'   && <AlertCircle  className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />}
          {toast.variant === 'info'    && <Info         className="h-5 w-5 text-haven-teal mt-0.5 flex-shrink-0" />}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="text-sm font-semibold text-haven-navy">{toast.title}</p>
            )}
            {toast.description && (
              <p className="text-xs text-haven-gray mt-0.5">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="flex-shrink-0 text-haven-gray hover:text-haven-navy transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
