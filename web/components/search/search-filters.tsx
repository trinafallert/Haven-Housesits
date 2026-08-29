'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchFiltersProps {
  onClose: () => void
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-haven-sand/40 pb-6 mb-6 last:border-0">
      <h3 className="font-semibold text-haven-navy mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Chip({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string
  icon?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all',
        selected
          ? 'border-haven-teal-dark bg-haven-teal-pale text-haven-teal-dark'
          : 'border-haven-sand text-haven-navy hover:border-haven-teal/60'
      )}
    >
      <span className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {label}
      </span>
      {selected && <Check className="h-4 w-4" />}
    </button>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-haven-sand/30 last:border-0">
      <span className="text-sm font-medium text-haven-navy">{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors duration-200 flex-shrink-0',
          checked ? 'bg-haven-teal' : 'bg-haven-sand'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
            checked && 'translate-x-5'
          )}
        />
      </button>
    </div>
  )
}

export function SearchFilters({ onClose }: SearchFiltersProps) {
  const [sitType, setSitType]     = useState<string[]>([])
  const [pets, setPets]           = useState<string[]>([])
  const [homeType, setHomeType]   = useState<string[]>([])
  const [attractions, setAttr]    = useState<string[]>([])
  const [dogWalk, setDogWalk]     = useState<string | null>(null)
  const [minDuration, setMinDur]  = useState(0)

  // Toggles
  const [filters, setFilters] = useState({
    familyFriendly:   false,
    fastWifi:         false,
    accessible:       false,
    publicTransport:  false,
    carIncluded:      false,
    hasBackyard:      false,
    autoLitterBox:    false,  // Haven exclusive!
    remoteWorkFriendly: false,
  })

  function toggleList(list: string[], val: string): string[] {
    return list.includes(val) ? list.filter((v) => v !== val) : [...list, val]
  }

  function toggleFilter(key: keyof typeof filters) {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function clearAll() {
    setSitType([])
    setPets([])
    setHomeType([])
    setAttr([])
    setDogWalk(null)
    setMinDur(0)
    setFilters({ familyFriendly: false, fastWifi: false, accessible: false, publicTransport: false, carIncluded: false, hasBackyard: false, autoLitterBox: false, remoteWorkFriendly: false })
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-0 md:top-0 md:h-screen z-50 bg-white md:w-[420px] rounded-t-3xl md:rounded-none shadow-card-hover flex flex-col max-h-[90vh] md:max-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-haven-sand/40 flex-shrink-0">
          <button onClick={onClose} className="p-1 hover:bg-haven-gray-pale rounded-lg transition-colors">
            <X className="h-5 w-5 text-haven-navy" />
          </button>
          <span className="font-semibold text-haven-navy">Filters</span>
          <button onClick={clearAll} className="text-sm font-semibold text-haven-navy hover:text-haven-teal transition-colors">
            Clear
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* Sit type */}
          <FilterSection title="Sit type">
            <div className="space-y-2.5">
              {[
                { value: 'FREE',      label: 'Exchange sit (free)', icon: '🌿' },
                { value: 'PAID',      label: 'Paid sit',            icon: '💸' },
                { value: 'VACANT',    label: 'Vacant house',        icon: '🏠' },
                { value: 'LONG_TERM', label: 'Long-term (30+ days)', icon: '📅' },
              ].map((t) => (
                <Chip
                  key={t.value}
                  label={t.label}
                  icon={t.icon}
                  selected={sitType.includes(t.value)}
                  onClick={() => setSitType(toggleList(sitType, t.value))}
                />
              ))}
            </div>
          </FilterSection>

          {/* Pets */}
          <FilterSection title="Pets">
            <div className="space-y-2.5">
              {[
                { value: 'DOG',       label: 'Dogs',       icon: '🐕' },
                { value: 'CAT',       label: 'Cats',       icon: '🐈' },
                { value: 'BIRD',      label: 'Birds',      icon: '🦜' },
                { value: 'FISH',      label: 'Fish',       icon: '🐠' },
                { value: 'REPTILE',   label: 'Reptiles',   icon: '🦎' },
                { value: 'SMALL_PET', label: 'Small pets', icon: '🐹' },
                { value: 'LIVESTOCK', label: 'Livestock',  icon: '🐑' },
              ].map((p) => (
                <Chip
                  key={p.value}
                  label={p.label}
                  icon={p.icon}
                  selected={pets.includes(p.value)}
                  onClick={() => setPets(toggleList(pets, p.value))}
                />
              ))}
            </div>
          </FilterSection>

          {/* 🐕 Dog walk requirements — Haven exclusive */}
          <FilterSection title="Dog walk requirements">
            <p className="text-xs text-haven-gray mb-3">
              Filter sits by how much dog walking is required — great if you have preferences.
            </p>
            <div className="space-y-2.5">
              {[
                { value: 'WALK_1X_DAILY',       label: 'Walk needed 1x daily' },
                { value: 'WALK_2X_DAILY',       label: 'Walk needed 2x daily' },
                { value: 'WALK_3X_DAILY',       label: 'Walk needed 3x daily' },
                { value: 'YARD_WALK_PREFERRED', label: 'Has yard — walk preferred but not required' },
                { value: 'YARD_NO_WALK',        label: 'Has yard — no walks needed' },
                { value: 'NO_DOGS',             label: 'No dogs (vacant/cat sits only)' },
              ].map((d) => (
                <Chip
                  key={d.value}
                  label={d.label}
                  selected={dogWalk === d.value}
                  onClick={() => setDogWalk(dogWalk === d.value ? null : d.value)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Home type */}
          <FilterSection title="Home type">
            <div className="space-y-2.5">
              {[
                { value: 'HOUSE',     label: 'House',     icon: '🏡' },
                { value: 'APARTMENT', label: 'Apartment', icon: '🏢' },
                { value: 'VILLA',     label: 'Villa',     icon: '🏖️' },
                { value: 'CABIN',     label: 'Cabin',     icon: '🪵' },
                { value: 'FARM',      label: 'Farm',      icon: '🌾' },
              ].map((h) => (
                <Chip
                  key={h.value}
                  label={h.label}
                  icon={h.icon}
                  selected={homeType.includes(h.value)}
                  onClick={() => setHomeType(toggleList(homeType, h.value))}
                />
              ))}
            </div>
          </FilterSection>

          {/* Sit duration */}
          <FilterSection title="Minimum sit duration">
            <div className="px-2">
              <p className="text-sm text-haven-navy mb-3">
                {minDuration === 0 ? 'Any duration' : minDuration < 7 ? `${minDuration} days+` : minDuration < 30 ? `${Math.round(minDuration / 7)} week${minDuration >= 14 ? 's' : ''}+` : '1 month+'}
              </p>
              <input
                type="range"
                min={0}
                max={90}
                step={7}
                value={minDuration}
                onChange={(e) => setMinDur(Number(e.target.value))}
                className="w-full accent-haven-teal"
              />
              <div className="flex justify-between text-xs text-haven-gray mt-1">
                <span>Any</span>
                <span>1 week</span>
                <span>2 weeks</span>
                <span>1 month</span>
                <span>3 months</span>
              </div>
            </div>
          </FilterSection>

          {/* Local attractions */}
          <FilterSection title="Local attractions">
            <div className="space-y-2.5">
              {[
                { value: 'BEACH',       label: 'Beach',       icon: '🏖️' },
                { value: 'CITY',        label: 'City',        icon: '🏙️' },
                { value: 'COUNTRYSIDE', label: 'Countryside', icon: '🌿' },
                { value: 'MOUNTAINS',   label: 'Mountains',   icon: '⛰️' },
              ].map((a) => (
                <Chip
                  key={a.value}
                  label={a.label}
                  icon={a.icon}
                  selected={attractions.includes(a.value)}
                  onClick={() => setAttr(toggleList(attractions, a.value))}
                />
              ))}
            </div>
          </FilterSection>

          {/* Amenities toggles */}
          <FilterSection title="Amenities & features">
            <Toggle label="Family friendly home"          checked={filters.familyFriendly}   onChange={() => toggleFilter('familyFriendly')} />
            <Toggle label="High-speed WiFi"               checked={filters.fastWifi}          onChange={() => toggleFilter('fastWifi')} />
            <Toggle label="Remote-work friendly"          checked={filters.remoteWorkFriendly} onChange={() => toggleFilter('remoteWorkFriendly')} />
            <Toggle label="Has backyard"                  checked={filters.hasBackyard}        onChange={() => toggleFilter('hasBackyard')} />
            <Toggle label="Automatic litter box"          checked={filters.autoLitterBox}      onChange={() => toggleFilter('autoLitterBox')} />
            <Toggle label="Accessible for disabilities"   checked={filters.accessible}        onChange={() => toggleFilter('accessible')} />
            <Toggle label="Public transport nearby"       checked={filters.publicTransport}   onChange={() => toggleFilter('publicTransport')} />
            <Toggle label="Use of car included"           checked={filters.carIncluded}       onChange={() => toggleFilter('carIncluded')} />
          </FilterSection>

        </div>

        {/* Apply button */}
        <div className="px-6 py-4 border-t border-haven-sand/40 flex-shrink-0">
          <Button className="w-full" size="lg" onClick={onClose}>
            Apply filters
          </Button>
        </div>
      </div>
    </>
  )
}
