'use client'

import { useState } from 'react'
import { Heart, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PRESET_TIPS = [10, 20, 30, 50]

interface Sit {
  id: string
  owner: { firstName: string }
}

interface TipModalProps {
  sit: Sit
  onClose: () => void
}

export function TipModal({ sit, onClose }: TipModalProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [custom, setCustom]     = useState('')
  const [sent, setSent]         = useState(false)
  const [loading, setLoading]   = useState(false)

  const tipAmount = selected ?? (custom ? parseFloat(custom) : 0)

  async function handleSend() {
    if (!tipAmount || tipAmount <= 0) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-haven-navy/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">

        {sent ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="font-display text-2xl font-bold text-haven-navy mb-1">Tip sent!</h2>
            <p className="text-haven-gray mb-6">
              ${tipAmount} on its way to {sit.owner.firstName}. They'll love it!
            </p>
            <Button className="w-full" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-display text-xl font-bold text-haven-navy">Leave a tip</h2>
                <p className="text-sm text-haven-gray mt-0.5">Show {sit.owner.firstName} some love 💛</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-haven-gray-pale transition-colors">
                <X className="h-4 w-4 text-haven-gray" />
              </button>
            </div>

            {/* Preset amounts */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {PRESET_TIPS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelected(amt); setCustom('') }}
                  className={`py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
                    selected === amt
                      ? 'border-haven-teal bg-haven-teal-pale text-haven-teal-dark'
                      : 'border-haven-sand text-haven-navy hover:border-haven-teal/50'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-haven-gray font-medium">$</span>
              <input
                type="number"
                min={1}
                placeholder="Custom amount"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(null) }}
                className="input pl-8 text-haven-navy"
              />
            </div>

            {/* 100% goes note */}
            <div className="flex items-center gap-2 bg-haven-teal-pale/60 rounded-2xl px-4 py-3 mb-5">
              <Sparkles className="h-4 w-4 text-haven-teal flex-shrink-0" />
              <p className="text-xs text-haven-teal-dark font-medium">
                100% of your tip goes directly to your sitter — Haven takes nothing.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button
                className="flex-1"
                leftIcon={<Heart className="h-4 w-4" />}
                disabled={!tipAmount || tipAmount <= 0}
                loading={loading}
                onClick={handleSend}
              >
                Send ${tipAmount > 0 ? tipAmount : '—'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
