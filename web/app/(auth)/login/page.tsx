import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { Home } from 'lucide-react'

export const metadata: Metadata = { title: 'Sign in — Haven Housesits' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-haven-cream flex">
      {/* Left panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 max-w-lg mx-auto lg:mx-0">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="h-8 w-8 rounded-xl gradient-haven flex items-center justify-center">
            <Home className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-haven-navy">
            Haven <span className="text-haven-teal">Housesits</span>
          </span>
        </Link>

        <h1 className="font-display text-3xl font-bold text-haven-navy mb-2">Welcome back</h1>
        <p className="text-haven-gray mb-8">
          Sign in to your account to continue your adventure.
        </p>

        <LoginForm />

        <p className="text-center text-sm text-haven-gray mt-8">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-haven-teal hover:text-haven-teal-dark transition-colors">
            Create one free
          </Link>
        </p>
      </div>

      {/* Right panel — image */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #5BA4A4 0%, #3D8A8A 50%, #1A2E35 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-12 right-12 h-64 w-64 rounded-full bg-white" />
          <div className="absolute bottom-12 left-12 h-48 w-48 rounded-full bg-white" />
        </div>
        <div className="relative text-center text-white px-12 max-w-sm">
          <div className="text-6xl mb-6">🏡</div>
          <h2 className="font-display text-3xl font-bold mb-4">
            Your next sit is waiting
          </h2>
          <p className="text-white/70 leading-relaxed">
            Join over 50,000 trusted sitters and home owners on Haven.
            Free exchange sits, paid sits, and everything in between.
          </p>
        </div>
      </div>
    </div>
  )
}
