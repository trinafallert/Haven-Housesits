'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Globe, Monitor, Video, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PET_LABELS, PET_ICONS } from '@/lib/utils'

const PLACE_TYPES = [
  { key: 'HOUSE',        label: 'House',        icon: '🏠' },
  { key: 'APARTMENT',    label: 'Apartment',    icon: '🏢' },
  { key: 'COTTAGE',      label: 'Cottage',      icon: '🏡' },
  { key: 'RURAL',        label: 'Rural/Farm',   icon: '🌾' },
  { key: 'VILLA',        label: 'Villa',        icon: '🏛️' },
]

const COUNTRIES = [
  { code: 'US', label: '🇺🇸 United States' },
  { code: 'UK', label: '🇬🇧 United Kingdom' },
  { code: 'AU', label: '🇦🇺 Australia' },
  { code: 'CA', label: '🇨🇦 Canada' },
  { code: 'NZ', label: '🇳🇿 New Zealand' },
  { code: 'FR', label: '🇫🇷 France' },
  { code: 'ES', label: '🇪🇸 Spain' },
  { code: 'IT', label: '🇮🇹 Italy' },
  { code: 'PT', label: '🇵🇹 Portugal' },
  { code: 'DE', label: '🇩🇪 Germany' },
]

const ANIMAL_TYPES = ['DOG', 'CAT', 'RABBIT', 'BIRD', 'FISH', 'SMALL_PET', 'REPTILE', 'POULTRY', 'LIVESTOCK']

function Toggle({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-haven-sand/30 last:border-0">
      <div>
        <p className="font-medium text-haven-navy text-sm">{label}</p>
        {desc && <p className="text-xs text-haven-gray mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${value ? 'bg-haven-teal' : 'bg-haven-sand'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}

export default function EditPreferencesPage() {
  const router = useRouter()
  const [placeTypes, setPlaceTypes]   = useState(['HOUSE', 'APARTMENT', 'COTTAGE'])
  const [anywhere, setAnywhere]       = useState(false)
  const [countries, setCountries]     = useState(['US', 'UK', 'AU', 'CA'])
  const [animals, setAnimals]         = useState(['DOG', 'CAT', 'RABBIT'])
  const [remoteWork, setRemoteWork]   = useState(true)
  const [videoCall, setVideoCall]     = useState(true)
  const [inPerson, setInPerson]       = useState(false)
  const [saving, setSaving]           = useState(false)

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    setSaving(false)
    router.push('/profile/edit')
  }

  return (
    <div className="bg-haven-cream min-h-screen">
      <div className="container-haven max-w-xl py-8">

        <Link href="/profile/edit" className="inline-flex items-center gap-1.5 text-sm text-haven-gray hover:text-haven-navy transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Link>

        <h1 className="font-display text-2xl font-bold text-haven-navy mb-6">Sitting preferences</h1>

        {/* Place types */}
        <div className="card p-5 mb-4">
          <h2 className="font-semibold text-haven-navy mb-3">Types of places I prefer</h2>
          <div className="grid grid-cols-3 gap-2">
            {PLACE_TYPES.map((p) => (
              <button
                key={p.key}
                onClick={() => setPlaceTypes(toggle(placeTypes, p.key))}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 text-sm font-medium transition-all ${
                  placeTypes.includes(p.key)
                    ? 'border-haven-teal bg-haven-teal-pale text-haven-teal-dark'
                    : 'border-haven-sand text-haven-navy hover:border-haven-teal/50'
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <span className="text-xs">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-haven-navy flex items-center gap-2">
              <Globe className="h-4 w-4 text-haven-teal" /> Country preferences
            </h2>
          </div>

          {/* Anywhere toggle */}
          <label className="flex items-center gap-3 cursor-pointer mb-4 p-3 rounded-2xl border-2 border-haven-sand hover:border-haven-teal/50 transition-colors">
            <input
              type="checkbox"
              className="sr-only"
              checked={anywhere}
              onChange={(e) => setAnywhere(e.target.checked)}
            />
            <div className={`h-5 w-5 rounded flex items-center justify-center border-2 transition-colors ${anywhere ? 'bg-haven-teal border-haven-teal' : 'border-haven-sand'}`}>
              {anywhere && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            <span className="font-medium text-haven-navy text-sm">I'll sit anywhere in the world 🌍</span>
          </label>

          {!anywhere && (
            <div className="grid grid-cols-2 gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCountries(toggle(countries, c.code))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    countries.includes(c.code)
                      ? 'border-haven-teal bg-haven-teal-pale text-haven-teal-dark'
                      : 'border-haven-sand text-haven-navy hover:border-haven-teal/50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Animal preferences */}
        <div className="card p-5 mb-4">
          <h2 className="font-semibold text-haven-navy mb-3">Animals I'm happy to care for</h2>
          <div className="flex flex-wrap gap-2">
            {ANIMAL_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setAnimals(toggle(animals, type))}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  animals.includes(type)
                    ? 'border-haven-teal bg-haven-teal-pale text-haven-teal-dark'
                    : 'border-haven-sand text-haven-navy hover:border-haven-teal/50'
                }`}
              >
                {PET_ICONS[type]} {PET_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Sit preferences toggles */}
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-haven-navy mb-1">How I like to connect</h2>
          <Toggle
            value={remoteWork}
            onChange={setRemoteWork}
            label="Remote work friendly"
            desc="I work remotely and need reliable WiFi"
          />
          <Toggle
            value={videoCall}
            onChange={setVideoCall}
            label="Happy with video call intro"
            desc="I'm comfortable meeting owners virtually first"
          />
          <Toggle
            value={inPerson}
            onChange={setInPerson}
            label="Prefer in-person meet"
            desc="I'd like to visit before the sit (if local)"
          />
        </div>

        <Button className="w-full" leftIcon={<Save className="h-4 w-4" />} loading={saving} onClick={handleSave}>
          Save preferences
        </Button>
      </div>
    </div>
  )
}
