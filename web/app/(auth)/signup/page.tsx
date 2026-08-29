import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'
import { Home, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Create account — Haven Housesits' }

const perks = [
  '3 months free — no credit card needed',
  'Browse free & paid sits worldwide',
  'One login for web & mobile app',
  'Haven Guarantee on every sit',
]

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-haven-cream flex">
      {/* Left panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 max-w-lg mx-auto lg:mx-0">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="h-8 w-8 rounded-xl gradient-haven flex items-center justify-center">
            <Home className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-haven-navy">
            Haven <span className="text-haven-teal">Housesits</span>
          </span>
        </Link>

        <h1 className="font-display text-3xl font-bold text-haven-navy mb-2">
          Join Haven free
        </h1>
        <p className="text-haven-gray mb-8">
          Create your account and get 3 months free on any paid plan.
        </p>

        <SignupForm />

        <p className="text-center text-sm text-haven-gray mt-8">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-haven-teal hover:text-haven-teal-dark transition-colors">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-haven-gray-light mt-4">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="underline">Terms</Link> and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>

      {/* Right panel */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5BA4A4 0%, #3D8A8A 60%, #1A2E35 100%)' }}
      >
        <div className="relative text-white px-12 max-w-sm">
          <div className="text-5xl mb-6">🌊</div>
          <h2 className="font-display text-3xl font-bold mb-6">
            Start your haven journey today
          </h2>
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-white/80">
                <CheckCircle2 className="h-5 w-5 text-haven-teal-light flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
          <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/20">
            <p className="text-sm text-white/70">
              💡 <span className="text-white font-medium">Student?</span>{' '}
              Sign up with your .edu email for{' '}
              <span className="text-haven-teal-light font-semibold">30% off</span> any paid plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
