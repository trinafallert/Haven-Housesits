'use client'

import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'success' | 'error' | 'info'
  duration?: number
}

let toastCount = 0

const listeners: Array<(toasts: Toast[]) => void> = []
let toasts: Toast[] = []

function emit(newToasts: Toast[]) {
  toasts = newToasts
  listeners.forEach((l) => l(toasts))
}

export function toast(opts: Omit<Toast, 'id'>) {
  const id = String(++toastCount)
  const newToast: Toast = { id, duration: 4000, ...opts }
  emit([...toasts, newToast])
  setTimeout(() => {
    emit(toasts.filter((t) => t.id !== id))
  }, newToast.duration)
  return id
}

export function useToast() {
  const [localToasts, setLocalToasts] = useState<Toast[]>(toasts)

  const listener = useCallback((updated: Toast[]) => {
    setLocalToasts([...updated])
  }, [])

  if (!listeners.includes(listener)) {
    listeners.push(listener)
  }

  const dismiss = useCallback((id: string) => {
    emit(toasts.filter((t) => t.id !== id))
  }, [])

  return { toasts: localToasts, dismiss }
}
