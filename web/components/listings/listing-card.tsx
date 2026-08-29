'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, MapPin } from 'lucide-react'
import { Badge, MatchScore } from '@/components/ui/badge'
import { cn, formatDateRange, PET_ICONS, SIT_TYPE_LABELS } from '@/lib/utils'

export interface ListingData {
  id: string
  title: string
  city: string
  state?: string
  country: string
  startDate: string
  endDate: string
  photos: string[]
  type: string
  isPaid: boolean
  price?: number
  currency?: string
  pets: { type: string; name: string }[]
  owner: {
    firstName: string
    lastName: string
    avatar?: string
    averageRating?: number
    totalSits?: number
  }
  isNew?: boolean
  isLowApplications?: boolean
  matchScore?: number
  currentApplicants?: number
  maxApplications?: number
}

interface ListingCardProps {
  listing: ListingData
  isSaved?: boolean
  onSave?: () => void
  className?: string
}

export function ListingCard({ listing, isSaved, onSave, className }: ListingCardProps) {
  const typeInfo  = SIT_TYPE_LABELS[listing.type] || SIT_TYPE_LABELS.FREE
  const petIcons  = listing.pets.slice(0, 4).map((p) => PET_ICONS[p.type] || '🐾')
  const hasMany   = listing.pets.length > 4

  return (
    <div className={cn('group relative', className)}>
      <Link href={`/listings/${listing.id}`}>
        {/* Image */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-haven-sand/30 mb-3">
          {listing.photos[0] ? (
            <Image
              src={listing.photos[0]}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-6xl">🏡</div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 gradient-card-overlay opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {listing.isNew && (
              <span className="bg-haven-teal text-white text-xs font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide">
                New
              </span>
            )}
            {listing.isLowApplications && (
              <span className="bg-haven-navy/80 text-white text-xs font-semibold px-2 py-0.5 rounded-lg uppercase tracking-wide">
                Low applications
              </span>
            )}
            {listing.isPaid && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide">
                Paid
              </span>
            )}
          </div>

          {/* Match score */}
          {listing.matchScore && (
            <div className="absolute top-2 right-10">
              <MatchScore score={listing.matchScore} />
            </div>
          )}
        </div>
      </Link>

      {/* Save button */}
      <button
        onClick={(e) => { e.preventDefault(); onSave?.() }}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
        aria-label={isSaved ? 'Remove from favourites' : 'Add to favourites'}
      >
        <Heart
          className={cn('h-4 w-4', isSaved ? 'fill-red-500 text-red-500' : 'text-haven-navy')}
        />
      </button>

      {/* Info */}
      <div className="space-y-1.5">
        <Link href={`/listings/${listing.id}`}>
          <h3 className="font-semibold text-haven-navy text-sm leading-snug line-clamp-1 hover:text-haven-teal transition-colors">
            {listing.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-haven-gray">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          {listing.city}{listing.state ? `, ${listing.state}` : ''}, {listing.country}
        </div>

        <p className="text-xs text-haven-gray">
          {formatDateRange(listing.startDate, listing.endDate)}
        </p>

        {/* Pets row */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm">
            {petIcons.join(' ')}
            {hasMany && <span className="text-xs text-haven-gray ml-1">+{listing.pets.length - 4}</span>}
          </span>
        </div>

        {/* Price / free */}
        <div className="flex items-center justify-between">
          <div>
            {listing.isPaid && listing.price ? (
              <span className="text-sm font-semibold text-haven-navy">
                ${listing.price}/{listing.priceUnit || 'night'}
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Free exchange
              </span>
            )}
          </div>
          {listing.owner.averageRating && (
            <div className="flex items-center gap-1 text-xs text-haven-gray">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {listing.owner.averageRating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
