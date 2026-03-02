'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MAX_INTRO    = 1500
const MAX_WHY      = 500
const MAX_HEADLINE = 80

export default function EditIntroductionPage() {
  const router = useRouter()

  const [headline, setHeadline]   = useState('Experienced pet lover & remote worker 🌿')
  const [intro, setIntro]         = useState(
    "Hi! I'm Jordan — a travel-loving remote worker who adores animals. I've been house sitting for 4 years across 3 countries, caring for everything from cats and dogs to rabbits and chickens. I treat every home like my own and love sending daily photo updates."
  )
  const [why, setWhy]             = useState(
    "House sitting lets me explore new places while doing something I genuinely love — caring for animals. It's a win-win that lets me travel sustainably and build meaningful connections."
  )
  const [saving, setSaving]       = useState(false)

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

        <h1 className="font-display text-2xl font-bold text-haven-navy mb-6">About you</h1>

        {/* Headline */}
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0">Profile headline</label>
            <span className={`text-xs font-medium ${headline.length > MAX_HEADLINE * 0.9 ? 'text-amber-500' : 'text-haven-gray-light'}`}>
              {headline.length}/{MAX_HEADLINE}
            </span>
          </div>
          <p className="text-xs text-haven-gray mb-2">A short, catchy line that appears at the top of your profile.</p>
          <input
            type="text"
            maxLength={MAX_HEADLINE}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="input"
            placeholder="e.g. Animal lover & remote worker 🌿"
          />
        </div>

        {/* Introduction */}
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0">Introduction</label>
            <span className={`text-xs font-medium ${intro.length > MAX_INTRO * 0.9 ? 'text-amber-500' : 'text-haven-gray-light'}`}>
              {intro.length}/{MAX_INTRO}
            </span>
          </div>
          <p className="text-xs text-haven-gray mb-2">Tell home owners who you are — your personality, lifestyle, and why you're trustworthy.</p>
          <textarea
            rows={6}
            maxLength={MAX_INTRO}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            className="input resize-none"
            placeholder="Hi! I'm…"
          />
        </div>

        {/* Why house sit */}
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0">Why do you want to house sit?</label>
            <span className={`text-xs font-medium ${why.length > MAX_WHY * 0.9 ? 'text-amber-500' : 'text-haven-gray-light'}`}>
              {why.length}/{MAX_WHY}
            </span>
          </div>
          <p className="text-xs text-haven-gray mb-2">Helps owners understand your motivation and commitment.</p>
          <textarea
            rows={4}
            maxLength={MAX_WHY}
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            className="input resize-none"
            placeholder="I love house sitting because…"
          />
        </div>

        <Button className="w-full" leftIcon={<Save className="h-4 w-4" />} loading={saving} onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
