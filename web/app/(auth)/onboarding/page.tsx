'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  'Welcome',
  'Sitting style',
  'Pet types',
  'Pet skills',
  'Dog preferences',
  'Location',
  'About you',
  'Availability',
  'Safety',
  'Done',
]

// ─── Multi-select button ──────────────────────────────────────────────────────

function OptionBtn({
  label,
  selected,
  icon,
  onClick,
}: {
  label: string
  selected: boolean
  icon?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1.5 px-3 py-3.5 rounded-2xl border-2 font-medium transition-all duration-150 text-center w-full min-h-[72px]',
        selected
          ? 'border-haven-teal-dark bg-haven-teal-pale text-haven-teal-dark'
          : 'border-haven-sand text-haven-navy hover:border-haven-teal/60'
      )}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="text-sm leading-tight">{label}</span>
      {selected && <Check className="h-4 w-4 text-haven-teal-dark" />}
    </button>
  )
}

function YesNoBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 font-medium transition-all duration-150 text-left',
        selected
          ? 'border-haven-teal-dark bg-haven-teal-pale text-haven-teal-dark'
          : 'border-haven-sand text-haven-navy hover:border-haven-teal/60'
      )}
    >
      {label}
      {selected && <Check className="h-5 w-5 text-haven-teal-dark" />}
    </button>
  )
}

// ─── Onboarding state ─────────────────────────────────────────────────────────

interface OnboardingData {
  sittingStyle: 'SOLO' | 'DUO' | null
  hasChildren: boolean | null
  petTypes: string[]
  petSkills: string[]
  dogSizes: string[]
  locationPref: 'ANYWHERE' | 'SPECIFIC'
  placeTypes: string[]
  wantsRemoteWork: boolean | null
  happyWithVideoCall: boolean | null
  happyToMeetInPerson: boolean | null
  walkDuration: string | null
}

const PET_OPTIONS = [
  { value: 'DOG',       label: 'Dogs',        icon: '🐕' },
  { value: 'CAT',       label: 'Cats',        icon: '🐈' },
  { value: 'BIRD',      label: 'Birds',       icon: '🦜' },
  { value: 'FISH',      label: 'Fish',        icon: '🐠' },
  { value: 'REPTILE',   label: 'Reptiles',    icon: '🦎' },
  { value: 'SMALL_PET', label: 'Small pets',  icon: '🐹' },
  { value: 'RABBIT',    label: 'Rabbits',     icon: '🐰' },
  { value: 'POULTRY',   label: 'Poultry',     icon: '🐓' },
  { value: 'LIVESTOCK', label: 'Livestock',   icon: '🐑' },
  { value: 'OTHER',     label: 'Other',       icon: '🐾' },
]

const SKILL_OPTIONS = [
  'Experienced with senior dogs',
  'Experienced with puppies',
  'Experienced with senior cats',
  'Experienced with kittens',
  'Experience administering medication',
  'Experience with special needs pets',
  'Trained in pet first aid',
  'Experience with exotic animals',
]

const DOG_SIZES = [
  { value: 'XS', label: 'XS (up to 15 lbs)' },
  { value: 'S',  label: 'S (17–33 lbs)' },
  { value: 'M',  label: 'M (35–55 lbs)' },
  { value: 'L',  label: 'L (57–85 lbs)' },
  { value: 'XL', label: 'XL (88 lbs+)' },
]

const PLACE_TYPES = [
  { value: 'BEACH',       label: 'Beach',       icon: '🏖️' },
  { value: 'CITY',        label: 'City',        icon: '🏙️' },
  { value: 'COUNTRYSIDE', label: 'Countryside', icon: '🌿' },
  { value: 'MOUNTAINS',   label: 'Mountains',   icon: '⛰️' },
]

const WALK_DURATIONS = [
  "I'm not able to provide dog walks",
  'Up to 30 mins',
  'Up to 60 mins',
  '2+ hours',
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const [data, setData] = useState<OnboardingData>({
    sittingStyle:        null,
    hasChildren:         null,
    petTypes:            [],
    petSkills:           [],
    dogSizes:            [],
    locationPref:        'ANYWHERE',
    placeTypes:          [],
    wantsRemoteWork:     null,
    happyWithVideoCall:  null,
    happyToMeetInPerson: null,
    walkDuration:        null,
  })

  const firstName = session?.user?.name?.split(' ')[0] ?? (session?.user as any)?.firstName ?? ''
  const displayName = firstName || 'there'

  function toggleArray(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
  }

  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)) }
  function back() { setStep((s) => Math.max(s - 1, 0)) }

  async function finish() {
    setSubmitting(true)
    try {
      await fetch('/api/profile/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      router.push('/search')
    } catch {
      router.push('/search')
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-haven-cream flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-haven-sand/30 px-6 py-4 flex items-center gap-4">
        <div className="h-8 w-8 rounded-xl gradient-haven flex items-center justify-center">
          <Home className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <div className="h-2 bg-haven-sand/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-haven-teal rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-haven-gray mt-1">Step {step + 1} of {STEPS.length}</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <div className="text-center py-8">
                  <div className="text-7xl mb-6">🏡</div>
                  <h1 className="font-display text-4xl font-bold text-haven-navy mb-4">
                    Welcome to Haven, {displayName}!
                  </h1>
                  <p className="text-haven-gray text-lg leading-relaxed mb-8">
                    Let's set up your profile so we can match you with the perfect sits.
                    It only takes a few minutes.
                  </p>
                  <div className="bg-haven-teal-pale rounded-2xl p-4 text-sm text-haven-teal-dark font-medium mb-6">
                    🎁 Your 3 months free have started — enjoy!
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-display text-3xl font-bold text-haven-navy mb-2">
                    Who will be sitting with you?
                  </h2>
                  <p className="text-haven-gray mb-8">
                    Let us know if a partner, friend or family member will join you for house sits.
                  </p>
                  <div className="space-y-3 mb-8">
                    <YesNoBtn label="I'm a solo sitter"   selected={data.sittingStyle === 'SOLO'} onClick={() => setData({ ...data, sittingStyle: 'SOLO' })} />
                    <YesNoBtn label="I'll be co-sitting"  selected={data.sittingStyle === 'DUO'}  onClick={() => setData({ ...data, sittingStyle: 'DUO'  })} />
                  </div>
                  {data.sittingStyle === 'DUO' && (
                    <div>
                      <p className="font-display text-xl font-semibold text-haven-navy mb-4">
                        Will any children join you?
                      </p>
                      <div className="space-y-3">
                        <YesNoBtn label="Yes" selected={data.hasChildren === true}  onClick={() => setData({ ...data, hasChildren: true  })} />
                        <YesNoBtn label="No"  selected={data.hasChildren === false} onClick={() => setData({ ...data, hasChildren: false })} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display text-3xl font-bold text-haven-navy mb-2">
                    Which animals do you want to sit for?
                  </h2>
                  <p className="text-haven-gray mb-6">Pick all the pets you're happy to care for.</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {PET_OPTIONS.map((p) => (
                      <OptionBtn
                        key={p.value}
                        label={p.label}
                        icon={p.icon}
                        selected={data.petTypes.includes(p.value)}
                        onClick={() => setData({ ...data, petTypes: toggleArray(data.petTypes, p.value) })}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-haven-gray mt-3">You can select as many as you like.</p>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display text-3xl font-bold text-haven-navy mb-2">
                    Your pet care skills
                  </h2>
                  <div className="bg-haven-gray-pale rounded-xl p-3 text-sm text-haven-gray mb-6">
                    Select the skills that best match your experience. These help owners feel confident in your abilities.{' '}
                    <span className="font-semibold text-haven-navy cursor-pointer">Read more</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SKILL_OPTIONS.map((skill) => (
                      <OptionBtn
                        key={skill}
                        label={skill}
                        selected={data.petSkills.includes(skill)}
                        onClick={() => setData({ ...data, petSkills: toggleArray(data.petSkills, skill) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="font-display text-3xl font-bold text-haven-navy mb-2">
                    Dog preferences
                  </h2>
                  <div className="mb-6">
                    <p className="font-semibold text-haven-navy mb-3">What size dogs are you happy to sit for?</p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {DOG_SIZES.map((s) => (
                        <OptionBtn
                          key={s.value}
                          label={s.label}
                          selected={data.dogSizes.includes(s.value)}
                          onClick={() => setData({ ...data, dogSizes: toggleArray(data.dogSizes, s.value) })}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-haven-gray mt-2">You can select as many as you like.</p>
                  </div>
                  <div className="border-t border-haven-sand/40 pt-6">
                    <p className="font-semibold text-haven-navy mb-3">How long are you happy to walk a dog each day?</p>
                    <div className="space-y-2.5">
                      {WALK_DURATIONS.map((d) => (
                        <YesNoBtn
                          key={d}
                          label={d}
                          selected={data.walkDuration === d}
                          onClick={() => setData({ ...data, walkDuration: d })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="font-display text-3xl font-bold text-haven-navy mb-2">
                    Your preferences
                  </h2>
                  <p className="text-haven-gray mb-6">
                    Help us suggest sits you'll love by telling us what you're looking for.
                  </p>
                  <div className="mb-6">
                    <p className="font-semibold text-haven-navy mb-3">Where would you like to go?</p>
                    <div className="space-y-2.5">
                      <YesNoBtn label="Anywhere in the world" selected={data.locationPref === 'ANYWHERE'} onClick={() => setData({ ...data, locationPref: 'ANYWHERE' })} />
                      <YesNoBtn label="I'd like specific countries" selected={data.locationPref === 'SPECIFIC'} onClick={() => setData({ ...data, locationPref: 'SPECIFIC' })} />
                    </div>
                  </div>
                  <div className="mb-6 border-t border-haven-sand/40 pt-6">
                    <p className="font-semibold text-haven-navy mb-3">What kind of places do you love?</p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {PLACE_TYPES.map((p) => (
                        <OptionBtn
                          key={p.value}
                          label={p.label}
                          icon={p.icon}
                          selected={data.placeTypes.includes(p.value)}
                          onClick={() => setData({ ...data, placeTypes: toggleArray(data.placeTypes, p.value) })}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-haven-gray mt-2">Select as many as you want.</p>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <h2 className="font-display text-3xl font-bold text-haven-navy mb-6">
                    Your sit preferences
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <p className="font-semibold text-haven-navy mb-1">Remote work sits?</p>
                      <div className="bg-haven-gray-pale rounded-xl p-3 text-sm text-haven-gray mb-3">
                        If you work remotely we can filter sits with fast WiFi and a dedicated workspace.{' '}
                        <span className="font-semibold text-haven-navy cursor-pointer">Read more</span>
                      </div>
                      <div className="space-y-2.5">
                        <YesNoBtn label="Yes, show me remote-work-friendly sits" selected={data.wantsRemoteWork === true}  onClick={() => setData({ ...data, wantsRemoteWork: true  })} />
                        <YesNoBtn label="No thanks"                               selected={data.wantsRemoteWork === false} onClick={() => setData({ ...data, wantsRemoteWork: false })} />
                      </div>
                    </div>
                    <div className="border-t border-haven-sand/40 pt-6">
                      <p className="font-semibold text-haven-navy mb-1">Video call before a sit?</p>
                      <div className="bg-haven-gray-pale rounded-xl p-3 text-sm text-haven-gray mb-3">
                        Many owners love a video chat to get to know you before confirming a sit.{' '}
                        <span className="font-semibold text-haven-navy cursor-pointer">Read more</span>
                      </div>
                      <div className="space-y-2.5">
                        <YesNoBtn label="Yes, I'm happy to video call"  selected={data.happyWithVideoCall === true}  onClick={() => setData({ ...data, happyWithVideoCall: true  })} />
                        <YesNoBtn label="I'd prefer not to"             selected={data.happyWithVideoCall === false} onClick={() => setData({ ...data, happyWithVideoCall: false })} />
                      </div>
                    </div>
                    <div className="border-t border-haven-sand/40 pt-6">
                      <p className="font-semibold text-haven-navy mb-1">Meet in person before a sit?</p>
                      <div className="bg-haven-gray-pale rounded-xl p-3 text-sm text-haven-gray mb-3">
                        Some owners like to meet sitters in person first when they're nearby.{' '}
                        <span className="font-semibold text-haven-navy cursor-pointer">Read more</span>
                      </div>
                      <div className="space-y-2.5">
                        <YesNoBtn label="Yes, that works for me" selected={data.happyToMeetInPerson === true}  onClick={() => setData({ ...data, happyToMeetInPerson: true  })} />
                        <YesNoBtn label="No, I'd prefer not to"  selected={data.happyToMeetInPerson === false} onClick={() => setData({ ...data, happyToMeetInPerson: false })} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="text-center py-6">
                  <div className="text-7xl mb-6">📅</div>
                  <h2 className="font-display text-3xl font-bold text-haven-navy mb-4">
                    Availability
                  </h2>
                  <p className="text-haven-gray mb-6">
                    Set dates when you're available so owners can invite you directly.
                    Most sits happen through applications — you can always add this later.
                  </p>
                  <div className="bg-haven-gray-pale rounded-2xl p-6 text-center">
                    <p className="text-haven-gray text-sm">
                      You can manage your availability calendar in your profile after setup.
                    </p>
                  </div>
                </div>
              )}

              {step === 8 && (
                <div>
                  <h2 className="font-display text-3xl font-bold text-haven-navy mb-2">
                    Safety & Security
                  </h2>
                  <div className="bg-haven-gray-pale rounded-xl p-4 text-sm text-haven-gray mb-8">
                    Member safety is our top priority. We'd like to be able to reach someone
                    in the unlikely event of an emergency during a sit.
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Emergency contact name</label>
                      <input type="text" placeholder="Full name" className="input" />
                    </div>
                    <div>
                      <label className="label">Their relationship to you</label>
                      <input type="text" placeholder="e.g. Dad, Sister, Friend" className="input" />
                    </div>
                    <div>
                      <label className="label">Their phone number</label>
                      <div className="grid grid-cols-3 gap-2">
                        <select className="input col-span-1">
                          <option>🇺🇸 (+1)</option>
                          <option>🇬🇧 (+44)</option>
                          <option>🇦🇺 (+61)</option>
                          <option>🇨🇦 (+1)</option>
                        </select>
                        <input type="tel" placeholder="Phone number" className="input col-span-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 9 && (
                <div className="text-center py-8">
                  <div className="text-7xl mb-6">🎉</div>
                  <h2 className="font-display text-4xl font-bold text-haven-navy mb-4">
                    You're all set, {displayName}!
                  </h2>
                  <p className="text-haven-gray text-lg mb-8">
                    Your Haven profile is ready. Start browsing sits or complete your
                    profile to stand out to owners.
                  </p>
                  <div className="space-y-3 text-left mb-8">
                    {[
                      { icon: '🔍', text: 'Browse thousands of free & paid sits' },
                      { icon: '✅', text: 'Complete your profile to get more applications accepted' },
                      { icon: '🛡️', text: 'Add verifications to build trust with owners' },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-haven-sand/40">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-sm text-haven-navy">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer nav */}
      <div className="sticky bottom-0 bg-white border-t border-haven-sand/30 px-6 py-4">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 0 && (
            <Button variant="secondary" onClick={back} leftIcon={<ChevronLeft className="h-4 w-4" />}>
              Back
            </Button>
          )}
          <div className="flex-1" />
          {step < STEPS.length - 1 ? (
            <Button onClick={next} rightIcon={<ChevronRight className="h-4 w-4" />}>
              Continue
            </Button>
          ) : (
            <Button onClick={finish} loading={submitting} size="lg" className="px-10">
              Start exploring
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
