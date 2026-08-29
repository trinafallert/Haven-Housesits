import Link from 'next/link'
import { Search, Send, Home, Star, DollarSign, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SITTER_STEPS = [
  {
    icon: '📝',
    title: 'Create your profile',
    desc: 'Tell owners who you are — add photos, your experience, pet types you love, and verify your ID for a trust boost.',
  },
  {
    icon: '🔍',
    title: 'Browse sits worldwide',
    desc: 'Filter by location, dates, pet type, sit type (free, paid, or vacant), and unique Haven filters like dog walk requirements and auto litter box.',
  },
  {
    icon: '📬',
    title: 'Apply in minutes',
    desc: 'Send a personalised message to up to 10 sits per day. Haven\'s Sit Match Score shows how well you fit each listing.',
  },
  {
    icon: '📹',
    title: 'Meet the owner',
    desc: 'Many owners prefer a quick video call. You can schedule it right from the inbox.',
  },
  {
    icon: '🏡',
    title: 'Sit & enjoy',
    desc: 'Move in, care for the pets, and treat the home as your own. Send daily photo updates — owners love them.',
  },
  {
    icon: '⭐',
    title: 'Get reviewed — and tip',
    desc: 'Blind reviews protect honesty. Owners can also leave a tip (100% goes to you — Haven takes nothing from tips).',
  },
]

const OWNER_STEPS = [
  {
    icon: '🏠',
    title: 'Post your listing',
    desc: 'Describe your home, pets, dates, and what you need. Set up amenities (WiFi, parking, pool), dog walk frequency, and optional add-on services.',
  },
  {
    icon: '👥',
    title: 'Receive applications',
    desc: 'Haven shows up to 10 applications (vs TrustedHousesitters\' 5-cap limit). Each applicant\'s Haven Match Score helps you compare quickly.',
  },
  {
    icon: '🔍',
    title: 'Review & chat',
    desc: 'Browse sitter profiles, read reviews and references, and message shortlisted sitters directly. Video call from inside the app.',
  },
  {
    icon: '✅',
    title: 'Confirm your sitter',
    desc: 'Accept your favourite applicant. For paid sits, funds are held securely in escrow — not charged until sit completion.',
  },
  {
    icon: '✈️',
    title: 'Travel with peace of mind',
    desc: 'Receive daily photo updates, message your sitter anytime, and know your home and pets are in verified, insured hands.',
  },
  {
    icon: '💛',
    title: 'Return home happy',
    desc: 'Leave a review. For paid sits, escrow releases automatically 24 hrs after sit ends. Add a tip if they deserve it.',
  },
]

const PAID_SIT_FLOW = [
  { icon: DollarSign, label: 'You set the rate', color: 'bg-amber-50 text-amber-700' },
  { icon: Shield,     label: 'Funds held in escrow', color: 'bg-haven-teal-pale text-haven-teal-dark' },
  { icon: Home,       label: 'Sitter cares for home', color: 'bg-haven-cream-dark text-haven-navy' },
  { icon: Star,       label: 'Sit ends — escrow releases', color: 'bg-emerald-50 text-emerald-700' },
]

export default function HowItWorksPage() {
  return (
    <div className="bg-haven-cream">

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container-haven max-w-3xl">
          <h1 className="font-display text-5xl font-bold text-haven-navy mb-4">
            How Haven works
          </h1>
          <p className="text-lg text-haven-gray">
            Whether you're a sitter looking for your next adventure or a home owner planning a trip —
            Haven makes it safe, simple, and fair for everyone.
          </p>
        </div>
      </section>

      {/* For Sitters */}
      <section className="py-16 bg-haven-cream-dark">
        <div className="container-haven max-w-4xl">
          <div className="text-center mb-12">
            <span className="badge-teal mb-3">For sitters</span>
            <h2 className="font-display text-3xl font-bold text-haven-navy">
              Travel & sit for free — or get paid
            </h2>
            <p className="text-haven-gray mt-2">Stay in amazing homes while looking after beloved pets.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SITTER_STEPS.map((step, i) => (
              <div key={i} className="card p-5">
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-haven-teal bg-haven-teal-pale px-2 py-0.5 rounded-full">Step {i + 1}</span>
                </div>
                <h3 className="font-bold text-haven-navy mb-1">{step.title}</h3>
                <p className="text-sm text-haven-gray leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/signup?role=SITTER">
              <Button size="lg">Join as a sitter — 3 months free</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Owners */}
      <section className="py-16">
        <div className="container-haven max-w-4xl">
          <div className="text-center mb-12">
            <span className="badge-teal mb-3">For home owners</span>
            <h2 className="font-display text-3xl font-bold text-haven-navy">
              Find a trusted sitter in 48 hours
            </h2>
            <p className="text-haven-gray mt-2">More applicants, better matching, and built-in insurance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {OWNER_STEPS.map((step, i) => (
              <div key={i} className="card p-5">
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-haven-teal bg-haven-teal-pale px-2 py-0.5 rounded-full">Step {i + 1}</span>
                </div>
                <h3 className="font-bold text-haven-navy mb-1">{step.title}</h3>
                <p className="text-sm text-haven-gray leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/signup?role=OWNER">
              <Button size="lg">Post your first sit — free</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Paid sit escrow explainer */}
      <section className="py-16 bg-haven-navy text-white">
        <div className="container-haven max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold mb-2">How paid sit escrow works</h2>
            <p className="text-white/70">Funds are protected for both parties — no awkward payment conversations.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {PAID_SIT_FLOW.map((step, i) => (
              <div key={i} className="flex items-center gap-4 flex-1">
                <div className={`flex-1 rounded-2xl p-4 text-center ${step.color}`}>
                  <step.icon className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-semibold">{step.label}</p>
                </div>
                {i < PAID_SIT_FLOW.length - 1 && (
                  <div className="hidden md:block text-haven-teal-light text-xl">→</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white/10 rounded-2xl p-4 text-sm text-white/80 text-center">
            <span className="font-semibold text-white">Haven's 8% service fee</span> is deducted at escrow release.
            A $500 sit → sitter receives $460. Tips are 100% commission-free.
          </div>
        </div>
      </section>

      {/* Haven vs competitors */}
      <section className="py-16">
        <div className="container-haven max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-haven-navy text-center mb-10">
            Why Haven beats the alternatives
          </h2>
          <div className="overflow-hidden rounded-3xl border border-haven-sand/50 shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-haven-navy text-white">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold text-haven-teal-light">Haven ✨</th>
                  <th className="text-center p-4 font-semibold opacity-60">TrustedHousesitters</th>
                  <th className="text-center p-4 font-semibold opacity-60">Rover</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Free exchange sits', '✅', '✅', '❌'],
                  ['Paid sits (browse globally)', '✅', '❌', '✅ (local only)'],
                  ['Application cap', '10 (custom)', '5 (hard limit)', 'N/A'],
                  ['Escrow payments', '✅', '❌', '✅'],
                  ['Tip feature (0% fee)', '✅', '❌', '❌'],
                  ['Dog walk req. filter', '✅ (unique)', '❌', '❌'],
                  ['Auto litter box filter', '✅ (unique)', '❌', '❌'],
                  ['Built-in insurance', '✅ $1k free', '❌', '✅ $25k'],
                  ['Blind reviews', '✅', '❌', '❌'],
                  ['Student discount', '✅ 30% off', '❌', '❌'],
                  ['3-month free trial', '✅', '❌', 'N/A'],
                  ['24/7 live human support', '✅', '❌ (bots)', '✅'],
                  ['Pricing (annual)', '$79/yr', '$129/yr', '20% per booking'],
                ].map(([feature, haven, th, rover]) => (
                  <tr key={feature} className="border-t border-haven-sand/30 hover:bg-haven-cream/50">
                    <td className="p-4 text-haven-navy font-medium">{feature}</td>
                    <td className="p-4 text-center text-haven-teal-dark font-semibold">{haven}</td>
                    <td className="p-4 text-center text-haven-gray">{th}</td>
                    <td className="p-4 text-center text-haven-gray">{rover}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 gradient-hero text-center">
        <div className="container-haven max-w-xl">
          <h2 className="font-display text-4xl font-bold text-haven-navy mb-3">Ready to start?</h2>
          <p className="text-haven-gray mb-8">A global community of sitters and owners, growing daily. First 3 months completely free.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup"><Button size="lg">Get started free</Button></Link>
            <Link href="/search"><Button size="lg" variant="secondary">Browse sits</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
