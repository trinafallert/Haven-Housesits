import type { Metadata } from 'next'
import Link from 'next/link'
import { DollarSign, Globe, Shield, Star, ArrowRight, CheckCircle, Banknote } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Paid House Sits — Earn While You Travel | Haven Housesits',
  description: 'Browse paid house sitting jobs worldwide. Earn $30–$100/night caring for homes and pets anywhere in the world. Only on Haven.',
}

const PAID_PERKS = [
  { icon: '🌍', title: 'Browse anywhere', desc: 'Search paid sits in any city, country, or continent — not limited to your local area like Rover or Wag.' },
  { icon: '💸', title: 'Real earning potential', desc: 'Paid sitters earn $30–$100/night depending on location and pet complexity. Full-time travel funding is possible.' },
  { icon: '🔒', title: 'Secure escrow payments', desc: 'Haven holds payment in escrow until the sit is confirmed. No chasing owners for money.' },
  { icon: '⭐', title: 'Build your reputation', desc: 'Every paid sit builds your review score. Top-rated sitters get premium listings first.' },
]

const STATS = [
  { value: '2,400+', label: 'Paid sits available now' },
  { value: '$52', label: 'Average nightly rate' },
  { value: '120+', label: 'Countries with paid sits' },
  { value: '4.9★', label: 'Average sitter rating' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Create your sitter profile', desc: 'Sign up free. Add your pet experience, verifications, and references. Takes 10 minutes.' },
  { step: '02', title: 'Browse & apply', desc: 'Filter by location, dates, pay rate, and pet type. Apply with a personal message to the owner.' },
  { step: '03', title: 'Get confirmed & earn', desc: "Owner accepts your application. Haven holds the payment securely. Do a great sit, get paid." },
]

export default function PaidSitsPage() {
  return (
    <div className="bg-haven-cream">
      {/* Hero */}
      <section className="relative overflow-hidden bg-haven-navy text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-haven-teal translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-haven-teal -translate-x-16 translate-y-16" />
        </div>
        <div className="container-haven relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1 rounded-full font-semibold bg-haven-teal/20 text-haven-teal-light px-3 py-1 text-xs mb-6">
              💸 Haven exclusive
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Get paid to travel<br />
              <span className="text-haven-teal-light">and sit.</span>
            </h1>
            <p className="text-white/70 text-xl mb-10 max-w-2xl leading-relaxed">
              Browse paid house sitting jobs anywhere in the world. Unlike Rover or Wag, Haven lets you search by destination — earn while you explore.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/haven/search?type=PAID"
                className="inline-flex items-center gap-2 bg-haven-teal hover:bg-haven-teal-dark text-white font-bold px-8 py-4 rounded-2xl text-base transition-colors shadow-haven"
              >
                Browse paid sits <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/haven/signup"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-colors border border-white/20"
              >
                Create free profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-haven-sand/40">
        <div className="container-haven">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-haven-navy">{s.value}</div>
                <div className="text-sm text-haven-gray mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes Haven different */}
      <section className="py-20 container-haven">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1 rounded-full font-semibold bg-haven-teal-pale text-haven-teal-dark px-3 py-1 text-xs mb-4">Why Haven for paid sits</span>
          <h2 className="section-title mb-4">Unlike any other platform</h2>
          <p className="text-haven-gray max-w-xl mx-auto">Rover keeps you local. Wag keeps you walking. Haven lets you work from anywhere.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PAID_PERKS.map((p) => (
            <div key={p.title} className="card p-6">
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="font-semibold text-haven-navy mb-2">{p.title}</h3>
              <p className="text-sm text-haven-gray leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container-haven max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">How paid sits work</h2>
            <p className="text-haven-gray">From profile to paycheck in three steps.</p>
          </div>
          <div className="space-y-8">
            {HOW_IT_WORKS.map((h) => (
              <div key={h.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-haven-teal flex items-center justify-center text-white font-bold text-sm">
                  {h.step}
                </div>
                <div>
                  <h3 className="font-semibold text-haven-navy text-lg mb-1">{h.title}</h3>
                  <p className="text-haven-gray leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment details */}
      <section className="py-20 container-haven">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full font-semibold bg-haven-teal-pale text-haven-teal-dark px-3 py-1 text-xs mb-4">Secure payments</span>
            <h2 className="section-title mb-6">You always get paid</h2>
            <div className="space-y-4">
              {[
                { icon: <Shield className="h-5 w-5 text-haven-teal" />, title: 'Escrow protection', desc: "Owner pays upfront. Haven holds the funds until your sit starts — you're always protected." },
                { icon: <Banknote className="h-5 w-5 text-haven-teal" />, title: 'Fast payout', desc: 'Funds released within 24hrs of sit completion. Direct to your bank or PayPal.' },
                { icon: <CheckCircle className="h-5 w-5 text-haven-teal" />, title: 'Platform fee: 8%', desc: 'Haven takes a small 8% fee. The rest is yours. No hidden charges, ever.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-4 bg-white rounded-2xl border border-haven-sand/40">
                  <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-haven-navy text-sm">{item.title}</p>
                    <p className="text-xs text-haven-gray mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-haven-navy rounded-3xl p-10 text-white text-center">
            <DollarSign className="h-12 w-12 text-haven-teal mx-auto mb-4" />
            <h3 className="font-display text-3xl font-bold mb-2">$52 avg/night</h3>
            <p className="text-white/60 mb-8">Based on current listings worldwide</p>
            <div className="space-y-3 text-left">
              {[
                { location: '🇦🇺 Sydney, Australia', rate: '$45–70/night' },
                { location: '🇺🇸 New York, USA',     rate: '$55–90/night' },
                { location: '🇬🇧 London, UK',        rate: '£40–65/night' },
                { location: '🇨🇦 Vancouver, Canada', rate: '$35–55/night' },
                { location: '🇮🇩 Bali, Indonesia',   rate: '$20–35/night' },
              ].map((r) => (
                <div key={r.location} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                  <span className="text-sm text-white/80">{r.location}</span>
                  <span className="text-sm font-semibold text-haven-teal-light">{r.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container-haven text-center">
          <h2 className="section-title mb-4">Ready to get paid to travel?</h2>
          <p className="text-haven-gray mb-8 max-w-xl mx-auto">Join thousands of sitters earning while exploring the world.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/haven/search?type=PAID"
              className="inline-flex items-center gap-2 bg-haven-teal hover:bg-haven-teal-dark text-white font-bold px-8 py-4 rounded-2xl text-base transition-colors"
            >
              Browse paid sits <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/haven/pricing"
              className="inline-flex items-center gap-2 border-2 border-haven-teal text-haven-teal-dark hover:bg-haven-teal-pale font-semibold px-8 py-4 rounded-2xl text-base transition-colors"
            >
              View membership plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
