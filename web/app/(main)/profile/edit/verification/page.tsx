'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Shield, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CHECKS = [
  {
    key: 'id',
    title: 'ID Verification',
    description: "We'll verify your government-issued ID (passport, driver's license) to confirm your identity.",
    status: 'VERIFIED',
    provider: 'Stripe Identity',
    badge: 'Adds an ID Verified badge to your profile',
    cost: 'Free',
  },
  {
    key: 'background',
    title: 'Background Check',
    description: 'A comprehensive criminal record and identity check powered by Evident. Covers all 50 US states.',
    status: 'VERIFIED',
    provider: 'Evident',
    badge: 'Adds a Background Check badge — 3× more likely to be chosen',
    cost: '$19.99 one-time (US only)',
  },
]

const STATUS_CONFIG = {
  VERIFIED:   { icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />, label: 'Verified',    color: 'text-emerald-600', bg: 'bg-emerald-50' },
  PENDING:    { icon: <Clock className="h-5 w-5 text-amber-500" />,          label: 'Pending',     color: 'text-amber-600',  bg: 'bg-amber-50'   },
  NOT_STARTED:{ icon: <AlertCircle className="h-5 w-5 text-haven-gray-light" />, label: 'Not started', color: 'text-haven-gray', bg: 'bg-haven-gray-pale' },
}

export default function VerificationPage() {
  return (
    <div className="bg-haven-cream min-h-screen">
      <div className="container-haven max-w-xl py-8">

        <Link href="/profile/edit" className="inline-flex items-center gap-1.5 text-sm text-haven-gray hover:text-haven-navy transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-haven-teal" />
          <h1 className="font-display text-2xl font-bold text-haven-navy">Verification</h1>
        </div>
        <p className="text-haven-gray text-sm mb-6">
          Verified sitters are trusted more by home owners. Complete both checks for maximum sit invitations.
        </p>

        <div className="space-y-4 mb-6">
          {CHECKS.map((check) => {
            const sc = STATUS_CONFIG[check.status as keyof typeof STATUS_CONFIG]
            const isVerified = check.status === 'VERIFIED'
            return (
              <div key={check.key} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-display text-lg font-bold text-haven-navy">{check.title}</h2>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.color}`}>
                    {sc.icon}
                    {sc.label}
                  </div>
                </div>
                <p className="text-sm text-haven-gray mb-3">{check.description}</p>

                <div className="bg-haven-teal-pale/50 rounded-xl px-3 py-2.5 mb-4">
                  <p className="text-xs font-medium text-haven-teal-dark">✨ {check.badge}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-haven-gray mb-4">
                  <span>Powered by <span className="font-semibold">{check.provider}</span></span>
                  <span className="font-semibold">{check.cost}</span>
                </div>

                {!isVerified && (
                  <Button className="w-full" rightIcon={<ExternalLink className="h-4 w-4" />}>
                    Start {check.title}
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {/* Haven Guarantee mention */}
        <div className="bg-haven-navy rounded-3xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-haven-teal-light" />
            <span className="font-bold">Haven Guarantee</span>
          </div>
          <p className="text-sm text-white/80">
            All verified sitters are covered by the Haven Guarantee — up to $1,000 property protection for every sit booked through Haven.
          </p>
        </div>

      </div>
    </div>
  )
}
