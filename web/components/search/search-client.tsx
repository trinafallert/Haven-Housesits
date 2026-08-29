'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, SlidersHorizontal, MapPin, Bell, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingCard, type ListingData } from '@/components/listings/listing-card'
import { SearchFilters } from '@/components/search/search-filters'
import { SaveSearchModal } from '@/components/search/save-search-modal'

interface SearchClientProps {
  initialParams: Record<string, string | undefined>
}

export function SearchClient({ initialParams }: SearchClientProps) {
  const [showFilters, setShowFilters]     = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showMap, setShowMap]             = useState(false)
  const [location, setLocation]           = useState(initialParams.location || '')
  const [searchInput, setSearchInput]     = useState(initialParams.search || '')
  const [listings, setListings]           = useState<ListingData[]>([])
  const [total, setTotal]                 = useState(0)
  const [loading, setLoading]             = useState(true)
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set())
  const [sitType, setSitType]             = useState(initialParams.type || '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchListings = useCallback(async (params: Record<string, string>) => {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (params.search)  qs.set('search',  params.search)
      if (params.city)    qs.set('city',    params.city)
      if (params.sitType) qs.set('sitType', params.sitType)
      const res = await fetch(`/api/listings?${qs}`)
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      setListings(data.listings || [])
      setTotal(data.total ?? data.listings?.length ?? 0)
    } catch {
      setListings([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  // initial load
  useEffect(() => {
    fetchListings({
      search:  initialParams.search || '',
      city:    initialParams.location || '',
      sitType: initialParams.type || '',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // debounced re-fetch when inputs change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchListings({ search: searchInput, city: location, sitType })
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchInput, location, sitType, fetchListings])

  const toggleSave = useCallback((id: string) => {
    setSavedListings((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const sitTypeLabel = sitType === 'PAID' ? 'paid sits' : 'sits'
  const headline = location
    ? `Sits in ${location}`
    : sitType === 'PAID'
      ? 'Paid sits worldwide'
      : 'All available sits'

  // Quick-filter chips
  const quickFilters = [
    { label: '🌿 All sits',    value: '' },
    { label: '💸 Paid',       value: 'PAID' },
    { label: '🏠 Vacant',     value: 'VACANT' },
    { label: '📅 Long-term',  value: 'LONG_TERM' },
  ]

  return (
    <div className="min-h-screen bg-haven-cream">
      {/* ── Sticky search bar ──────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-haven-sand/30 shadow-sm">
        <div className="container-haven py-3">
          <div className="flex items-center gap-3">
            {/* Location */}
            <div className="flex-1 flex items-center gap-2 bg-haven-cream rounded-xl border border-haven-sand px-4 py-2.5">
              <MapPin className="h-4 w-4 text-haven-teal flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or country..."
                className="flex-1 bg-transparent text-sm text-haven-navy placeholder:text-haven-gray-light outline-none"
              />
              {location && (
                <button onClick={() => setLocation('')} className="text-haven-gray hover:text-haven-navy">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Keyword search */}
            <div className="hidden sm:flex items-center gap-2 bg-haven-cream rounded-xl border border-haven-sand px-4 py-2.5 w-48">
              <Search className="h-4 w-4 text-haven-gray flex-shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Dogs, cats, pool..."
                className="flex-1 bg-transparent text-sm text-haven-navy placeholder:text-haven-gray-light outline-none"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="text-haven-gray hover:text-haven-navy">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(true)}
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            >
              Filters
            </Button>
          </div>

          {/* Quick-filter chips */}
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-none">
            {quickFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setSitType(f.value)}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                  sitType === f.value
                    ? 'bg-haven-teal text-white border-haven-teal'
                    : 'bg-white text-haven-navy border-haven-sand hover:border-haven-teal'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-haven py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-haven-navy">{headline}</h1>
            <p className="text-sm text-haven-gray mt-0.5">
              {loading ? 'Searching...' : `${total} ${sitTypeLabel} accepting applications`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-1.5 text-sm font-medium text-haven-navy bg-white rounded-xl px-3 py-2 border border-haven-sand hover:border-haven-teal transition-colors"
            >
              <MapPin className="h-4 w-4 text-haven-teal" />
              {showMap ? 'List' : 'Map'}
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
              <p className="text-haven-teal-dark font-medium">Interactive map coming soon</p>
              <p className="text-xs text-haven-gray mt-1">Pins for all {total} current listings</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-haven-sand/40 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-haven-sand/40" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-haven-sand/60 rounded w-3/4" />
                  <div className="h-3 bg-haven-sand/40 rounded w-1/2" />
                  <div className="h-3 bg-haven-sand/40 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results grid */}
        {!loading && listings.length > 0 && (
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
        )}

        {/* Empty state */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="font-display text-2xl font-bold text-haven-navy mb-2">No sits found</h2>
            <p className="text-haven-gray mb-6">Try a different location or remove some filters.</p>
            <Button variant="secondary" onClick={() => { setLocation(''); setSearchInput(''); setSitType('') }}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {showFilters && <SearchFilters onClose={() => setShowFilters(false)} />}
      {showSaveModal && (
        <SaveSearchModal
          searchName={location || 'My search'}
          onClose={() => setShowSaveModal(false)}
          onSave={(name) => { console.log('Saved search:', name); setShowSaveModal(false) }}
        />
      )}
    </div>
  )
}
