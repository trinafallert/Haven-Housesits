'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Shield, Users, Star, ChevronDown, ChevronUp, Gift, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ListingData } from './listing-card'
import { formatDateRange, sitDuration, formatCurrency } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

const ADDONS = [
  { id: 'deep_clean',   icon: '🧹', title: 'Deep Clean',        desc: 'Professional clean before you return', price: 120 },
  { id: 'grocery',      icon: '🛒', title: 'Grocery Stock',      desc: 'Fridge stocked on your arrival back',  price: 60  },
  { id: 'pet_photos',   icon: '📸', title: 'Pet Photo Package',  desc: 'Gallery of pet photos during sit',     price: 45  },
  { id: 'plant_care',   icon: '🪴', title: 'Plant Care',         desc: 'Dedicated plant watering & care',      price: 25  },
]

export function ApplicationPanel({ listing }: { listing: ListingData }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [applying, setApplying]         = useState(false)
  const [message, setMessage]           = useState('')
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [submitting, setSubmitting]     = useState(false)

  const duration = sitDuration(listing.startDate, listing.endDate)
  const sitNights = Math.max(1,
    Math.round((new Date(listing.endDate).getTime() - new Date(listing.startDate).getTime()) / 86_400_000)
  )
  const sitTotal  = listing.isPaid && listing.price ? listing.price * sitNights : 0
  const addonTotal = selectedAddons.reduce((sum, id) => {
    const addon = ADDONS.find((a) => a.id === id)
    return sum + (addon?.price || 0)
  }, 0)
  const platformFee = listing.isPaid ? Math.round(sitTotal * 0.08) : 0
  const sitterReceives = sitTotal - platformFee

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  async function handleApply() {
    if (!session) { router.push('/login'); return }
    if (!message.trim()) {
      toast({ title: 'Add a message', description: 'Tell the owner a bit about yourself.', variant: 'error' })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id, message, addons: selectedAddons }),
      })
      if (res.ok) {
        toast({ title: 'Application sent!', description: 'The owner will be in touch.', variant: 'success' })
        setShowApplyForm(false)
        router.push('/dashboard/sits')
      } else {
        const err = await res.json()
        toast({ title: 'Failed to apply', description: err.error, variant: 'error' })
      }
    } catch {
      toast({ title: 'Something went wrong', variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card p-6 space-y-5">
      {/* Dates & duration */}
      <div className="text-center border-b border-haven-sand/30 pb-4">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-center p-3 bg-haven-cream rounded-xl">
            <p className="text-xs text-haven-gray mb-0.5 uppercase tracking-wide font-medium">From</p>
            <p className="font-display font-bold text-2xl text-haven-navy leading-none">
              {new Date(listing.startDate).getDate()}
            </p>
            <p className="text-xs text-haven-gray">
              {new Date(listing.startDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            </p>
          </div>
          <div className="text-center p-3 bg-haven-cream rounded-xl">
            <p className="text-xs text-haven-gray mb-0.5 uppercase tracking-wide font-medium">To</p>
            <p className="font-display font-bold text-2xl text-haven-navy leading-none">
              {new Date(listing.endDate).getDate()}
            </p>
            <p className="text-xs text-haven-gray">
              {new Date(listing.endDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            </p>
          </div>
        </div>
        <p className="text-xs text-haven-gray">{duration} · {formatDateRange(listing.startDate, listing.endDate)}</p>
      </div>

      {/* Price / free */}
      {listing.isPaid && listing.price ? (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-amber-800">Sit rate</span>
            <span className="font-bold text-amber-800">{formatCurrency(listing.price, listing.currency)} / night</span>
          </div>
          <div className="flex justify-between text-xs text-amber-700 mb-1">
            <span>{formatCurrency(listing.price)} × {sitNights} nights</span>
            <span>{formatCurrency(sitTotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-amber-700 mb-2">
            <span>Haven fee (8%)</span>
            <span>−{formatCurrency(platformFee)}</span>
          </div>
          <div className="flex justify-between font-bold text-amber-800 border-t border-amber-200 pt-2">
            <span>You receive</span>
            <span className="text-haven-teal-dark">{formatCurrency(sitterReceives)}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-amber-700">
            <Shield className="h-3 w-3" />
            Held securely in escrow — released after sit
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center">
          <p className="font-semibold text-emerald-700 mb-1">🌿 Free exchange sit</p>
          <p className="text-xs text-emerald-600">No payment — free accommodation in exchange for caring for the home</p>
        </div>
      )}

      {/* Add-ons (owner view) */}
      <div>
        <button
          type="button"
          onClick={() => setApplying(!applying)}
          className="flex items-center justify-between w-full text-sm font-semibold text-haven-navy mb-3"
        >
          <span className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-haven-teal" />
            Premium add-ons
          </span>
          {applying ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {applying && (
          <div className="space-y-2 mb-3">
            {ADDONS.map((addon) => (
              <label key={addon.id} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAddons.includes(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                  className="mt-1 accent-haven-teal"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-haven-navy">{addon.icon} {addon.title}</span>
                    <span className="text-sm font-semibold text-haven-teal">${addon.price}</span>
                  </div>
                  <p className="text-xs text-haven-gray">{addon.desc}</p>
                </div>
              </label>
            ))}
            {addonTotal > 0 && (
              <div className="flex justify-between text-sm font-semibold text-haven-navy border-t border-haven-sand/40 pt-2">
                <span>Add-ons total</span>
                <span>{formatCurrency(addonTotal)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Applicants count */}
      <div className="flex items-center gap-2 text-xs text-haven-gray">
        <Users className="h-3.5 w-3.5" />
        {listing.currentApplicants ?? 0} of {listing.maxApplications ?? 10} applications received
      </div>

      {/* Apply form */}
      {showApplyForm ? (
        <div className="space-y-4">
          <div>
            <label className="label">Your message to {listing.owner.firstName}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi ${listing.owner.firstName}! I'd love to care for your home and pets. Tell them a bit about yourself, your experience, and why you'd be a great fit...`}
              className="input min-h-[120px] resize-none"
              minLength={50}
            />
            <p className="text-xs text-haven-teal mt-1">{message.length < 50 ? `Min 50 characters (${50 - message.length} more)` : `✓ ${message.length} characters`}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setShowApplyForm(false)}>Cancel</Button>
            <Button onClick={handleApply} loading={submitting} disabled={message.length < 50}>
              Send application
            </Button>
          </div>
        </div>
      ) : (
        <Button className="w-full" size="lg" onClick={() => setShowApplyForm(true)}>
          Apply for this sit
        </Button>
      )}

      {/* Tip note */}
      <div className="text-center">
        <p className="text-xs text-haven-gray flex items-center justify-center gap-1">
          <Heart className="h-3 w-3 text-haven-teal" />
          Owners can tip sitters after any sit — free or paid
        </p>
      </div>

      {/* Haven guarantee */}
      <div className="flex items-center gap-2 p-3 bg-haven-gray-pale rounded-xl">
        <Shield className="h-4 w-4 text-haven-teal flex-shrink-0" />
        <p className="text-xs text-haven-gray">
          <span className="font-semibold text-haven-navy">Haven Guarantee</span> — up to $1,000 coverage on every sit.
        </p>
      </div>
    </div>
  )
}
