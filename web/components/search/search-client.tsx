'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, MapPin, Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingCard } from '@/components/listings/listing-card'
import { SearchFilters } from '@/components/search/search-filters'
import { SaveSearchModal } from '@/components/search/save-search-modal'
import { MOCK_LISTINGS } from '@/lib/mock-data'

interface SearchClientProps {
  initialParams: Record<string, string | undefined>
}

export function SearchClient({ initialParams }: SearchClientProps) {
  const router = useRouter()
  const [showFilters, setShowFilters]       = useState(false)
  const [showSaveModal, setShowSaveModal]   = useState(false)
  const [showMap, setShowMap]               = useState(false)
  const [location, setLocation]             = useState(initialParams.location || '')
  const [savedListings, setSavedListings]   = useState<Set<string>>(new Set())

  const listings = MOCK_LISTINGS // In production: fetch from API with filters

  const toggleSave = useCallback((id: string) => {
    setSavedListings((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const sitTypeLabel = initialParams.type === 'PAID' ? 'Paid sits' : 'All sits'
  const resultCount  = listings.length

  return (
    <div className="min-h-screen bg-haven-cream">
      {/* ── Search bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-haven-sand/30 shadow-sm">
        <div className="container-haven py-3">
          <div className="flex items-center gap-3">
            {/* Location input */}
            <div className="flex-1 flex items-center gap-2 bg-haven-cream rounded-xl border border-haven-sand px-4 py-2.5">
              <MapPin className="h-4 w-4 text-haven-teal flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, country or anywhere..."
                className="flex-1 bg-transparent text-sm text-haven-navy placeholder:text-haven-gray-light outline-none"
              />
              {location && (
                <button onClick={() => setLocation('')} className="text-haven-gray hover:text-haven-navy">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(true)}
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            >
              Filters
            </Button>

            {/* Search */}
            <Button size="sm" leftIcon={<Search className="h-4 w-4" />}>
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="container-haven py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-haven-navy">
              {location ? `Sits in ${location}` : 'All available sits'}
            </h1>
            <p className="text-sm text-haven-gray mt-0.5">
              {resultCount} {sitTypeLabel.toLowerCase()} accepting applications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-1.5 text-sm font-medium text-haven-navy bg-white rounded-xl px-3 py-2 border border-haven-sand hover:border-haven-teal transition-colors"
            >
              <MapPin className="h-4 w-4 text-haven-teal" />
              {showMap ? 'List view' : 'Map view'}
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-haven-navy bg-white rounded-xl px-3 py-2 border border-haven-sand hover:border-haven-teal transition-colors"
            >
              <Bell className="h-4 w-4 text-haven-teal" />
              Save search
            </button>
          </div>
        </div>

        {/* Map placeholder */}
        {showMap && (
          <div className="w-full h-72 bg-haven-teal-pale rounded-3xl mb-6 flex items-center justify-center border border-haven-teal/20">
            <div className="text-center">
              <MapPin className="h-10 w-10 text-haven-teal mx-auto mb-2" />
              <p className="text-haven-teal-dark font-medium">Interactive map</p>
              <p className="text-xs text-haven-gray mt-1">Integrate with Mapbox or Google Maps in production</p>
            </div>
          </div>
        )}

        {/* Listing grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSaved={savedListings.has(listing.id)}
              onSave={() => toggleSave(listing.id)}
            />
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏡</div>
            <h2 className="font-display text-2xl font-bold text-haven-navy mb-2">No sits found</h2>
            <p className="text-haven-gray">Try adjusting your filters or searching a different location.</p>
          </div>
        )}
      </div>

      {/* Filters drawer */}
      {showFilters && (
        <SearchFilters onClose={() => setShowFilters(false)} />
      )}

      {/* Save search modal */}
      {showSaveModal && (
        <SaveSearchModal
          searchName={location || 'My search'}
          onClose={() => setShowSaveModal(false)}
          onSave={(name) => {
            console.log('Saved search:', name)
            setShowSaveModal(false)
          }}
        />
      )}
    </div>
  )
}
