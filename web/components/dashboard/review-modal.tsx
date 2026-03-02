'use client'

import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Sit {
  id: string
  listing: { city: string; state: string }
  owner: { firstName: string; avatar: string | null }
}

interface ReviewModalProps {
  sit: Sit
  onClose: () => void
}

const CATEGORIES = [
  { key: 'communication', label: 'Communication' },
  { key: 'accuracy',      label: 'Accuracy of listing' },
  { key: 'welcome',       label: 'Welcome & handover' },
  { key: 'pets',          label: 'Pet info provided' },
]

export function ReviewModal({ sit, onClose }: ReviewModalProps) {
  const [ratings, setRatings]   = useState<Record<string, number>>({})
  const [hovered, setHovered]   = useState<Record<string, number>>({})
  const [comment, setComment]   = useState('')
  const [submitted, setSubmit]  = useState(false)
  const [loading, setLoading]   = useState(false)

  const overall = CATEGORIES.length > 0
    ? Math.round(Object.values(ratings).reduce((a, b) => a + b, 0) / Math.max(Object.keys(ratings).length, 1))
    : 0
  const allRated = CATEGORIES.every((c) => ratings[c.key])

  async function handleSubmit() {
    if (!allRated) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmit(true)
  }

  const starProps = (cat: string, i: number) => ({
    className: `h-7 w-7 cursor-pointer transition-colors ${
      i <= (hovered[cat] ?? ratings[cat] ?? 0)
        ? 'fill-amber-400 text-amber-400'
        : 'text-haven-sand'
    }`,
    onMouseEnter: () => setHovered((h) => ({ ...h, [cat]: i })),
    onMouseLeave: () => setHovered((h) => { const n = { ...h }; delete n[cat]; return n }),
    onClick:      () => setRatings((r) => ({ ...r, [cat]: i })),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-haven-navy/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

        {submitted ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">⭐</div>
            <h2 className="font-display text-2xl font-bold text-haven-navy mb-2">Review submitted!</h2>
            <p className="text-haven-gray mb-6 text-sm">
              Your review will be published once {sit.owner.firstName} also leaves a review, or after 14 days — whichever comes first.
            </p>
            <Button className="w-full" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-display text-xl font-bold text-haven-navy">Review your stay</h2>
                <p className="text-sm text-haven-gray mt-0.5">
                  {sit.listing.city}, {sit.listing.state} — hosted by {sit.owner.firstName}
                </p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-haven-gray-pale transition-colors">
                <X className="h-4 w-4 text-haven-gray" />
              </button>
            </div>

            {/* Category ratings */}
            <div className="space-y-4 mb-5">
              {CATEGORIES.map((cat) => (
                <div key={cat.key}>
                  <p className="text-sm font-semibold text-haven-navy mb-1.5">{cat.label}</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} {...starProps(cat.key, i)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Overall */}
            {allRated && (
              <div className="flex items-center gap-2 bg-amber-50 rounded-2xl px-4 py-3 mb-5">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-haven-navy">
                  Overall: {overall}/5
                </span>
              </div>
            )}

            {/* Comment */}
            <div className="mb-5">
              <label className="label">Share your experience (optional)</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What made this sit memorable? Any tips for future sitters?"
                className="input resize-none"
              />
            </div>

            {/* Blind review notice */}
            <p className="text-xs text-haven-gray mb-4">
              🔒 <span className="font-medium">Blind reviews</span> — your review is hidden until {sit.owner.firstName} reviews you too, or 14 days pass. No gaming the system.
            </p>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button
                className="flex-1"
                leftIcon={<Star className="h-4 w-4" />}
                disabled={!allRated}
                loading={loading}
                onClick={handleSubmit}
              >
                Submit review
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
