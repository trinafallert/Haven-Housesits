'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, Search, MessageSquare, Star, CheckCircle2, Clock, XCircle, Plus, ChevronRight, Gift, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { formatDateRange, PET_ICONS } from '@/lib/utils'
import { TipModal } from '@/components/dashboard/tip-modal'
import { ReviewModal } from '@/components/dashboard/review-modal'

const MOCK_APPLICATIONS = [
  {
    id: 'a1',
    status: 'PENDING',
    listing: {
      id: '1',
      title: 'Two lovable golden retrievers in sunny LA',
      city: 'Lexington', state: 'KY', country: 'US',
      startDate: '2026-03-10', endDate: '2026-04-12',
      photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=70',
      pets: [{ type: 'DOG', name: 'Buddy' }],
    },
    owner: { firstName: 'Michael', lastName: 'K', avatar: null },
  },
  {
    id: 'a2',
    status: 'PENDING',
    listing: {
      id: '2',
      title: 'Cosy San Francisco apartment with two cats',
      city: 'Los Angeles', state: 'CA', country: 'US',
      startDate: '2026-03-14', endDate: '2026-03-22',
      photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70',
      pets: [{ type: 'CAT', name: 'Luna' }],
    },
    owner: { firstName: 'Ali', lastName: 'B', avatar: null },
  },
  {
    id: 'a3',
    status: 'PENDING',
    listing: {
      id: '8',
      title: 'Arroyo Grande ranch',
      city: 'Arroyo Grande', state: 'CA', country: 'US',
      startDate: '2026-03-15', endDate: '2026-04-03',
      photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=70',
      pets: [{ type: 'DOG', name: 'Duke' }],
    },
    owner: { firstName: 'Kate', lastName: 'S', avatar: null },
  },
]

const PAST_SITS = [
  {
    id: 'p1',
    status: 'COMPLETED',
    listing: {
      city: 'Redondo Beach', state: 'CA',
      startDate: '2026-02-10', endDate: '2026-02-22',
      photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70',
      pets: [{ type: 'CAT', name: 'Cleo' }],
    },
    owner: { firstName: 'Sandra', lastName: 'D', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    rating: null, // hasn't reviewed yet
    tip: null,
  },
  {
    id: 'p2',
    status: 'COMPLETED',
    listing: {
      city: 'San Francisco', state: 'CA',
      startDate: '2025-12-20', endDate: '2026-01-04',
      photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70',
      pets: [{ type: 'CAT', name: 'Luna' }],
    },
    owner: { firstName: 'Jake', lastName: 'M', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    rating: 5,
    tip: 50,
  },
]

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PENDING:   { label: 'Application sent', icon: <Clock className="h-4 w-4" />,        color: 'text-haven-gray' },
  ACCEPTED:  { label: 'Confirmed!',       icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-emerald-600' },
  DECLINED:  { label: 'Not this time',   icon: <XCircle className="h-4 w-4" />,       color: 'text-red-500' },
  COMPLETED: { label: 'Sit complete',     icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-haven-teal' },
}

export default function DashboardPage() {
  const [tab, setTab]             = useState<'open' | 'past'>('open')
  const [tipModalSit, setTipModal]     = useState<typeof PAST_SITS[0] | null>(null)
  const [reviewModalSit, setReviewModal] = useState<typeof PAST_SITS[0] | null>(null)

  return (
    <div className="bg-haven-cream min-h-screen">
      <div className="container-haven py-8 max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="teal" size="sm">
                <Gift className="h-3 w-3" /> 3 months free
              </Badge>
            </div>
            <h1 className="font-display text-3xl font-bold text-haven-navy">My Sits</h1>
          </div>
          <button className="relative p-2">
            <Bell className="h-5 w-5 text-haven-navy" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-haven-teal rounded-full border-2 border-white" />
          </button>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'open',  label: 'Open Applications', icon: <Clock className="h-4 w-4" /> },
            { key: 'past',  label: 'Past',              icon: <CheckCircle2 className="h-4 w-4" /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'open' | 'past')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all ${
                tab === t.key
                  ? 'border-haven-teal bg-haven-teal-pale text-haven-teal-dark'
                  : 'border-haven-sand text-haven-gray hover:border-haven-teal/50'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Open applications */}
        {tab === 'open' && (
          <div className="space-y-4">
            {MOCK_APPLICATIONS.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="font-display text-xl font-bold text-haven-navy mb-2">No open applications</h2>
                <p className="text-haven-gray mb-6">Browse sits and apply to ones you love.</p>
                <Link href="/search">
                  <Button leftIcon={<Search className="h-4 w-4" />}>Find a sit</Button>
                </Link>
              </div>
            ) : (
              MOCK_APPLICATIONS.map((app) => {
                const sc = statusConfig[app.status]
                return (
                  <Link key={app.id} href={`/listings/${app.listing.id}`} className="block">
                    <div className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-haven-sand/30">
                        <Image src={app.listing.photo} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`flex items-center gap-1.5 text-xs font-medium mb-0.5 ${sc.color}`}>
                          {sc.icon} {sc.label}
                        </p>
                        <p className="font-semibold text-haven-navy truncate">
                          {app.listing.city}, {app.listing.state}
                        </p>
                        <p className="text-xs text-haven-gray">
                          {formatDateRange(app.listing.startDate, app.listing.endDate)}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-sm">
                          {app.listing.pets.map((p) => PET_ICONS[p.type] || '🐾').join(' ')}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-haven-gray flex-shrink-0" />
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        )}

        {/* Past sits */}
        {tab === 'past' && (
          <div className="space-y-4">
            {PAST_SITS.map((sit) => {
              const sc = statusConfig[sit.status]
              return (
                <div key={sit.id} className="card overflow-hidden">
                  <div className="relative h-44 w-full">
                    <Image src={sit.listing.photo} alt="" fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <p className={`flex items-center gap-1.5 text-sm font-medium mb-1 ${sc.color}`}>
                      {sc.icon} {sc.label}
                    </p>
                    <h3 className="font-display font-bold text-xl text-haven-navy mb-0.5">
                      {sit.listing.city}, {sit.listing.state}
                    </h3>
                    <p className="text-sm text-haven-gray mb-1">
                      {formatDateRange(sit.listing.startDate, sit.listing.endDate)}
                    </p>
                    <div className="flex items-center gap-1 mb-3 text-sm">
                      {sit.listing.pets.map((p) => PET_ICONS[p.type] || '🐾').join(' ')}
                    </div>

                    {/* Rating stars */}
                    {sit.rating && (
                      <div className="flex items-center gap-0.5 mb-3">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className={`h-4 w-4 ${i <= sit.rating! ? 'fill-amber-400 text-amber-400' : 'text-haven-sand'}`} />
                        ))}
                      </div>
                    )}

                    {/* Tip received */}
                    {sit.tip && (
                      <div className="flex items-center gap-1.5 text-sm text-haven-teal font-medium mb-3">
                        <Heart className="h-4 w-4" />
                        ${sit.tip} tip received — thank you! 🎉
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {/* Leave review */}
                      {!sit.rating && (
                        <button
                          onClick={() => setReviewModal(sit)}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-haven-sand text-sm font-medium text-haven-navy hover:border-haven-teal transition-all"
                        >
                          <Star className="h-4 w-4 text-haven-teal" />
                          Leave a review
                        </button>
                      )}
                      {/* Chat */}
                      <Link href="/inbox">
                        <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-haven-sand text-sm font-medium text-haven-navy hover:border-haven-teal transition-all">
                          <MessageSquare className="h-4 w-4 text-haven-teal" />
                          Chat to {sit.owner.firstName}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link href="/search">
            <div className="card p-4 flex items-center gap-3 hover:shadow-card-hover transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-haven-teal-pale flex items-center justify-center">
                <Search className="h-5 w-5 text-haven-teal" />
              </div>
              <div>
                <p className="font-semibold text-haven-navy text-sm">Find a sit</p>
                <p className="text-xs text-haven-gray">Browse available sits</p>
              </div>
            </div>
          </Link>
          <Link href="/create-listing">
            <div className="card p-4 flex items-center gap-3 hover:shadow-card-hover transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-haven-teal-pale flex items-center justify-center">
                <Plus className="h-5 w-5 text-haven-teal" />
              </div>
              <div>
                <p className="font-semibold text-haven-navy text-sm">Post a sit</p>
                <p className="text-xs text-haven-gray">List your home</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Tip modal */}
      {tipModalSit && <TipModal sit={tipModalSit} onClose={() => setTipModal(null)} />}

      {/* Review modal */}
      {reviewModalSit && <ReviewModal sit={reviewModalSit} onClose={() => setReviewModal(null)} />}
    </div>
  )
}
