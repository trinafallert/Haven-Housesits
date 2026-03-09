'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Check, MapPin, Calendar, Cat, Home,
  DollarSign, Settings, Camera, Plus, Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PET_ICONS, PET_LABELS } from '@/lib/utils'

/* ─── Step definitions ─── */
const STEPS = [
  { id: 1, label: 'Sit type',      icon: DollarSign },
  { id: 2, label: 'Location',      icon: MapPin },
  { id: 3, label: 'Dates',         icon: Calendar },
  { id: 4, label: 'Home',          icon: Home },
  { id: 5, label: 'Pets',          icon: Cat },
  { id: 6, label: 'Details',       icon: Settings },
  { id: 7, label: 'Photos',        icon: Camera },
]

const SIT_TYPES = [
  { key: 'FREE',      label: 'Free exchange',  desc: 'Sitter stays for free — no money changes hands.', icon: '🏡', color: 'border-emerald-400 bg-emerald-50' },
  { key: 'PAID',      label: 'Paid sit',        desc: 'You pay the sitter. Rate set by you.', icon: '💰', color: 'border-amber-400 bg-amber-50' },
  { key: 'VACANT',    label: 'Vacant sit',      desc: 'No pets — you just need someone to house-watch.', icon: '🔑', color: 'border-haven-teal bg-haven-teal-pale' },
  { key: 'LONG_TERM', label: 'Long-term (30+ days)', desc: 'Extended sit — often with reduced utility expectations.', icon: '📅', color: 'border-blue-400 bg-blue-50' },
  { key: 'PET_ONLY',  label: 'Pet-only sit',   desc: "You're away and need someone at their home with your pets.", icon: '🐾', color: 'border-purple-400 bg-purple-50' },
]

const HOME_TYPES = [
  { key: 'HOUSE', label: 'House', icon: '🏠' },
  { key: 'APARTMENT', label: 'Apartment', icon: '🏢' },
  { key: 'COTTAGE', label: 'Cottage', icon: '🏡' },
  { key: 'RURAL', label: 'Rural/Farm', icon: '🌾' },
  { key: 'VILLA', label: 'Villa', icon: '🏛️' },
]

const PET_TYPES = ['DOG', 'CAT', 'RABBIT', 'BIRD', 'FISH', 'SMALL_PET', 'REPTILE', 'POULTRY', 'LIVESTOCK']

const DOG_WALK_OPTIONS = [
  { key: 'WALK_1X_DAILY',         label: '1 walk per day',         icon: '🚶' },
  { key: 'WALK_2X_DAILY',         label: '2 walks per day',        icon: '🚶🚶' },
  { key: 'WALK_3X_DAILY',         label: '3 walks per day',        icon: '🚶🚶🚶' },
  { key: 'YARD_WALK_PREFERRED',   label: 'Yard + walk preferred',  icon: '🌿🚶' },
  { key: 'YARD_NO_WALK',          label: 'Yard — no walk needed',  icon: '🌿' },
  { key: 'NO_DOGS',               label: 'No dogs',                icon: '🐱' },
]

const AMENITIES = [
  { key: 'hasWifi',          label: 'WiFi' },
  { key: 'hasParking',       label: 'Parking' },
  { key: 'hasPool',          label: 'Pool' },
  { key: 'hasGarden',        label: 'Garden' },
  { key: 'hasBackyard',      label: 'Backyard' },
  { key: 'hasAutoLitterBox', label: 'Auto litter box' },
  { key: 'remoteWorkFriendly', label: 'Remote-work friendly' },
  { key: 'isFamilyFriendly', label: 'Family friendly' },
]

const ADDONS = [
  { key: 'DEEP_CLEAN', label: 'Deep clean before return', price: 120 },
]

interface Pet {
  id: string
  type: string
  name: string
  breed: string
  age: string
}

export default function CreateListingPage() {
  const router  = useRouter()
  const [step, setStep] = useState(1)

  // Form state
  const [sitType, setSitType]         = useState('FREE')
  const [city, setCity]               = useState('')
  const [state, setState]             = useState('')
  const [country, setCountry]         = useState('US')
  const [startDate, setStartDate]     = useState('')
  const [endDate, setEndDate]         = useState('')
  const [homeType, setHomeType]       = useState('HOUSE')
  const [bedrooms, setBedrooms]       = useState(2)
  const [bathrooms, setBathrooms]     = useState(1)
  const [pets, setPets]               = useState<Pet[]>([])
  const [dogWalkReq, setDogWalkReq]   = useState('YARD_WALK_PREFERRED')
  const [amenities, setAmenities]     = useState<string[]>(['hasWifi'])
  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [responsibilities, setResponsibilities] = useState('')
  const [dailyRate, setDailyRate]     = useState(80)
  const [maxApps, setMaxApps]         = useState(10)
  const [addons, setAddons]           = useState<string[]>([])
  const [submitting, setSubmitting]   = useState(false)

  const hasDogs = pets.some((p) => p.type === 'DOG')

  function addPet() {
    setPets((prev) => [...prev, { id: `p${Date.now()}`, type: 'DOG', name: '', breed: '', age: '' }])
  }

  function removePet(id: string) {
    setPets((prev) => prev.filter((p) => p.id !== id))
  }

  function updatePet(id: string, field: keyof Pet, value: string) {
    setPets((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p))
  }

  function toggleAmenity(key: string) {
    setAmenities((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
  }

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    router.push('/dashboard')
  }

  const canNext: Record<number, boolean> = {
    1: !!sitType,
    2: !!(city && state),
    3: !!(startDate && endDate && startDate < endDate),
    4: !!homeType,
    5: true, // pets optional for VACANT
    6: !!(title && description),
    7: true,
  }

  return (
    <div className="bg-haven-cream min-h-screen">
      <div className="container-haven max-w-2xl py-8">

        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-haven-gray hover:text-haven-navy transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <h1 className="font-display text-3xl font-bold text-haven-navy mb-2">Post a sit</h1>
        <p className="text-haven-gray mb-6">Tell sitters what your home and pets need.</p>

        {/* Progress steps */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  step === s.id
                    ? 'bg-haven-teal text-white'
                    : step > s.id
                      ? 'bg-haven-teal-pale text-haven-teal-dark cursor-pointer'
                      : 'text-haven-gray opacity-50 cursor-default'
                }`}
              >
                {step > s.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
                <span className="text-[10px] font-semibold">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <div className="h-px w-4 bg-haven-sand flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* ─── Step 1: Sit type ─── */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="font-display text-xl font-bold text-haven-navy mb-4">What type of sit is this?</h2>
            {SIT_TYPES.map((type) => (
              <button
                key={type.key}
                onClick={() => setSitType(type.key)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  sitType === type.key
                    ? `${type.color} shadow-sm`
                    : 'border-haven-sand bg-white hover:border-haven-teal/50'
                }`}
              >
                <span className="text-3xl">{type.icon}</span>
                <div>
                  <p className="font-semibold text-haven-navy">{type.label}</p>
                  <p className="text-sm text-haven-gray">{type.desc}</p>
                </div>
                {sitType === type.key && (
                  <div className="ml-auto h-6 w-6 rounded-full bg-haven-teal flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ─── Step 2: Location ─── */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-xl font-bold text-haven-navy mb-4">Where is your home?</h2>
            <div className="card p-5 space-y-4">
              <div>
                <label className="label">City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input" placeholder="e.g. Los Angeles" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">State / Region</label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="input" placeholder="e.g. CA" />
                </div>
                <div>
                  <label className="label">Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="input">
                    <option value="US">🇺🇸 United States</option>
                    <option value="UK">🇬🇧 United Kingdom</option>
                    <option value="AU">🇦🇺 Australia</option>
                    <option value="CA">🇨🇦 Canada</option>
                    <option value="NZ">🇳🇿 New Zealand</option>
                    <option value="FR">🇫🇷 France</option>
                    <option value="ES">🇪🇸 Spain</option>
                    <option value="IT">🇮🇹 Italy</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 3: Dates ─── */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-bold text-haven-navy mb-4">When do you need a sitter?</h2>
            <div className="card p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="label">End date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" min={startDate} />
                </div>
              </div>
              {startDate && endDate && startDate >= endDate && (
                <p className="text-red-500 text-xs mt-2">End date must be after start date.</p>
              )}
            </div>
          </div>
        )}

        {/* ─── Step 4: Home type ─── */}
        {step === 4 && (
          <div>
            <h2 className="font-display text-xl font-bold text-haven-navy mb-4">Tell us about your home</h2>
            <div className="card p-5 mb-4">
              <label className="label">Home type</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {HOME_TYPES.map((ht) => (
                  <button
                    key={ht.key}
                    onClick={() => setHomeType(ht.key)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 text-sm font-medium transition-all ${
                      homeType === ht.key
                        ? 'border-haven-teal bg-haven-teal-pale text-haven-teal-dark'
                        : 'border-haven-sand text-haven-navy hover:border-haven-teal/50'
                    }`}
                  >
                    <span className="text-2xl">{ht.icon}</span>
                    <span className="text-xs">{ht.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Bedrooms</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setBedrooms(Math.max(0, bedrooms - 1))} className="h-9 w-9 rounded-xl border border-haven-sand flex items-center justify-center font-bold text-haven-navy hover:border-haven-teal transition-colors">−</button>
                    <span className="font-bold text-haven-navy w-6 text-center">{bedrooms}</span>
                    <button onClick={() => setBedrooms(bedrooms + 1)} className="h-9 w-9 rounded-xl border border-haven-sand flex items-center justify-center font-bold text-haven-navy hover:border-haven-teal transition-colors">+</button>
                  </div>
                </div>
                <div>
                  <label className="label">Bathrooms</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setBathrooms(Math.max(0, bathrooms - 1))} className="h-9 w-9 rounded-xl border border-haven-sand flex items-center justify-center font-bold text-haven-navy hover:border-haven-teal transition-colors">−</button>
                    <span className="font-bold text-haven-navy w-6 text-center">{bathrooms}</span>
                    <button onClick={() => setBathrooms(bathrooms + 1)} className="h-9 w-9 rounded-xl border border-haven-sand flex items-center justify-center font-bold text-haven-navy hover:border-haven-teal transition-colors">+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="card p-5">
              <label className="label mb-3">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => toggleAmenity(a.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      amenities.includes(a.key)
                        ? 'border-haven-teal bg-haven-teal-pale text-haven-teal-dark'
                        : 'border-haven-sand text-haven-navy hover:border-haven-teal/50'
                    }`}
                  >
                    {amenities.includes(a.key) && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 5: Pets ─── */}
        {step === 5 && (
          <div>
            <h2 className="font-display text-xl font-bold text-haven-navy mb-1">Your pets</h2>
            <p className="text-haven-gray text-sm mb-4">Add each pet so sitters know what to expect.</p>

            {pets.map((pet) => (
              <div key={pet.id} className="card p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{PET_ICONS[pet.type] || '🐾'}</span>
                  <button onClick={() => removePet(pet.id)} className="p-1.5 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="label">Type</label>
                    <select value={pet.type} onChange={(e) => updatePet(pet.id, 'type', e.target.value)} className="input">
                      {PET_TYPES.map((t) => (
                        <option key={t} value={t}>{PET_ICONS[t]} {PET_LABELS[t]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Name</label>
                    <input type="text" value={pet.name} onChange={(e) => updatePet(pet.id, 'name', e.target.value)} className="input" placeholder="Buddy" />
                  </div>
                  <div>
                    <label className="label">Breed</label>
                    <input type="text" value={pet.breed} onChange={(e) => updatePet(pet.id, 'breed', e.target.value)} className="input" placeholder="Golden Retriever" />
                  </div>
                  <div>
                    <label className="label">Age</label>
                    <input type="text" value={pet.age} onChange={(e) => updatePet(pet.id, 'age', e.target.value)} className="input" placeholder="3 years" />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addPet}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-haven-sand hover:border-haven-teal text-haven-gray hover:text-haven-teal transition-all mb-4 font-medium text-sm"
            >
              <Plus className="h-4 w-4" />
              Add a pet
            </button>

            {/* Dog walk requirement */}
            {hasDogs && (
              <div className="card p-5">
                <h3 className="font-semibold text-haven-navy mb-1">Dog walk requirements</h3>
                <p className="text-xs text-haven-gray mb-3">Sitters can filter by this — be specific to find the right fit.</p>
                <div className="space-y-2">
                  {DOG_WALK_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setDogWalkReq(opt.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all text-left ${
                        dogWalkReq === opt.key
                          ? 'border-haven-teal bg-haven-teal-pale text-haven-teal-dark'
                          : 'border-haven-sand text-haven-navy hover:border-haven-teal/50'
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      {opt.label}
                      {dogWalkReq === opt.key && <Check className="h-4 w-4 ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 6: Details ─── */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-haven-navy mb-2">Listing details</h2>

            <div className="card p-5">
              <label className="label">Listing title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="e.g. Cosy beachside cottage with two cats"
                maxLength={80}
              />
              <p className="text-xs text-haven-gray-light mt-1">{title.length}/80</p>
            </div>

            <div className="card p-5">
              <label className="label">Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input resize-none"
                placeholder="Describe your home, neighbourhood, and what the stay will be like…"
              />
            </div>

            <div className="card p-5">
              <label className="label">Sitter responsibilities</label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="input resize-none"
                placeholder="e.g. Feed cats twice daily, clean litter box, water plants weekly…"
              />
            </div>

            {/* Paid sit rate */}
            {sitType === 'PAID' && (
              <div className="card p-5">
                <label className="label">Daily rate (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-haven-gray font-medium">$</span>
                  <input
                    type="number"
                    min={20}
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="input pl-8"
                  />
                </div>
                <p className="text-xs text-haven-gray mt-2">
                  Sitter receives ${Math.round(dailyRate * 0.92)}/day after Haven's 8% service fee.
                </p>
              </div>
            )}

            {/* Max applications */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-1">
                <label className="label mb-0">Maximum applications</label>
                <span className="text-haven-teal font-bold">{maxApps}</span>
              </div>
              <p className="text-xs text-haven-gray mb-3">Haven allows up to 15 applications. More options = better match.</p>
              <input
                type="range"
                min={5}
                max={15}
                step={1}
                value={maxApps}
                onChange={(e) => setMaxApps(Number(e.target.value))}
                className="w-full accent-haven-teal"
              />
              <div className="flex justify-between text-xs text-haven-gray mt-1">
                <span>5</span>
                <span>15</span>
              </div>
            </div>

            {/* Optional add-ons */}
            <div className="card p-5">
              <h3 className="font-semibold text-haven-navy mb-1">Optional add-ons</h3>
              <p className="text-xs text-haven-gray mb-3">Sitters can offer these services for an extra fee.</p>
              {ADDONS.map((addon) => (
                <label key={addon.key} className="flex items-center gap-3 cursor-pointer py-2.5 border-b border-haven-sand/30 last:border-0">
                  <div
                    onClick={() => setAddons((prev) =>
                      prev.includes(addon.key) ? prev.filter((k) => k !== addon.key) : [...prev, addon.key]
                    )}
                    className={`h-5 w-5 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                      addons.includes(addon.key) ? 'bg-haven-teal border-haven-teal' : 'border-haven-sand'
                    }`}
                  >
                    {addons.includes(addon.key) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-haven-navy">{addon.label}</p>
                  </div>
                  <span className="text-sm text-haven-gray font-medium">+${addon.price}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ─── Step 7: Photos ─── */}
        {step === 7 && (
          <div>
            <h2 className="font-display text-xl font-bold text-haven-navy mb-2">Add photos</h2>
            <p className="text-haven-gray text-sm mb-5">Listings with 5+ photos get 3× more applications.</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl border-2 border-dashed border-haven-sand hover:border-haven-teal transition-colors flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-haven-teal-pale/20"
                >
                  <Camera className="h-6 w-6 text-haven-gray-light mb-1" />
                  <span className="text-xs text-haven-gray-light">Add photo</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-haven-gray text-center">
              JPEG, PNG or WEBP · Max 10MB each · First photo becomes cover image
            </p>
          </div>
        )}

        {/* ─── Navigation ─── */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button variant="secondary" className="flex-1" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < STEPS.length ? (
            <Button
              className="flex-1"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              disabled={!canNext[step]}
              onClick={() => setStep(step + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button
              className="flex-1"
              leftIcon={<Check className="h-4 w-4" />}
              loading={submitting}
              onClick={handleSubmit}
            >
              Publish listing
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
