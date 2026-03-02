import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2, X, ArrowRight, Zap, Shield,
  Star, Gift, RefreshCw, MessageCircle, HeartHandshake,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing — Haven Housesits',
  description: 'Join Haven free for 3 months. Cheaper than TrustedHousesitters. Switch from another app and get 3 months credit.',
}

const plans = [
  {
    id: 'explorer',
    name: 'Explorer',
    tagline: 'Try Haven, no strings attached',
    monthlyPrice: 0,
    annualPrice: 0,
    badge: null,
    highlight: false,
    cta: 'Start free',
    ctaHref: '/signup?plan=explorer',
    features: [
      { label: 'Browse all listings', included: true },
      { label: 'Up to 3 applications per month', included: true },
      { label: 'Basic messaging', included: true },
      { label: 'Create sitter or owner profile', included: true },
      { label: 'Apply to paid sits', included: false },
      { label: 'Save searches & get alerts', included: false },
      { label: 'Unlimited applications', included: false },
      { label: 'Haven Guarantee coverage', included: false },
      { label: 'Priority customer support', included: false },
      { label: 'Premium add-ons access', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Everything you need to sit or list',
    monthlyPrice: 9,
    annualPrice: 79,
    badge: 'Most popular',
    highlight: false,
    cta: 'Start free for 3 months',
    ctaHref: '/signup?plan=standard',
    features: [
      { label: 'Browse all listings', included: true },
      { label: 'Unlimited applications', included: true },
      { label: 'Full messaging & inbox', included: true },
      { label: 'Apply to paid sits', included: true },
      { label: 'Save searches & get alerts', included: true },
      { label: 'Haven Guarantee ($500 coverage)', included: true },
      { label: 'Sitter & owner profile', included: true },
      { label: 'Duo sitter feature', included: true },
      { label: 'Priority customer support', included: false },
      { label: 'Premium add-ons access', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Maximum protection & perks',
    monthlyPrice: 14,
    annualPrice: 129,
    badge: 'Best value',
    highlight: true,
    cta: 'Start free for 3 months',
    ctaHref: '/signup?plan=premium',
    features: [
      { label: 'Everything in Standard', included: true },
      { label: 'Haven Guarantee ($1,000 coverage)', included: true },
      { label: '24/7 priority live support', included: true },
      { label: 'Premium add-ons access', included: true },
      { label: 'Instant Book eligibility', included: true },
      { label: 'Profile boost (appear higher in search)', included: true },
      { label: 'Sit Match Score for every listing', included: true },
      { label: 'Video profile intro', included: true },
      { label: 'Duo sitter verification (both)', included: true },
      { label: 'Early access to new sits', included: true },
    ],
  },
]

const comparisons = [
  { feature: 'Annual price',             haven: '$79 / $129',      th: '$129 / $259',    rover: 'N/A (per booking)' },
  { feature: 'Free trial',               haven: '3 months free',   th: '2 weeks only',   rover: 'No' },
  { feature: 'Exchange (free) sits',     haven: '✓',               th: '✓',              rover: '✗' },
  { feature: 'Paid sits — browse',       haven: '✓',               th: '✗',              rover: '✗ (invite only)' },
  { feature: 'Application limit',        haven: 'No cap',           th: '5 per listing',  rover: 'N/A' },
  { feature: 'Vacant house sits',        haven: '✓',               th: '✓',              rover: '✗' },
  { feature: 'Tip your sitter',          haven: '✓',               th: '✗',              rover: '✗' },
  { feature: 'Premium add-ons',          haven: '✓',               th: '✗',              rover: '✗' },
  { feature: 'Sit Guarantee',           haven: 'Up to $1,000',     th: 'Limited',        rover: 'Up to $25k (own pets)' },
  { feature: '24/7 live support',        haven: '✓',               th: 'Limited',        rover: 'Email only' },
  { feature: 'Co-sitter verification',   haven: '✓',               th: '✓',              rover: '✗' },
  { feature: 'Cats supported',           haven: '✓',               th: '✓',              rover: 'Limited' },
]

const switchBenefits = [
  'Currently on TrustedHousesitters, Rover, Wag or another platform?',
  'Take a screenshot of your active subscription or payment receipt.',
  'Upload it when you sign up for Haven Premium.',
  'We'll credit 3 months of Haven Premium to your account — free.',
]

export default function PricingPage() {
  return (
    <div className="bg-haven-cream">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="py-20 text-center container-haven">
        <Badge variant="teal" className="mb-6">
          <Gift className="h-3 w-3" /> 3 months free for everyone
        </Badge>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-haven-navy mb-4">
          Simple, honest pricing
        </h1>
        <p className="text-haven-gray text-xl max-w-2xl mx-auto mb-4">
          Up to <span className="font-semibold text-haven-teal">50% cheaper</span> than TrustedHousesitters.
          Every plan starts with 3 months completely free — no credit card needed.
        </p>
        <p className="text-sm text-haven-gray-light">
          Already paying for another housesitting app?{' '}
          <a href="#switch" className="text-haven-teal font-semibold underline">
            We'll credit 3 months when you switch →
          </a>
        </p>
      </section>

      {/* ── PLANS ─────────────────────────────────────────────────────────── */}
      <section className="container-haven pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl border-2 p-8 flex flex-col relative overflow-hidden transition-all ${
                plan.highlight
                  ? 'border-haven-teal bg-haven-navy text-white shadow-haven-lg'
                  : 'border-haven-sand/60 bg-white shadow-card'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-haven-teal" />
              )}
              {plan.badge && (
                <div className="mb-4">
                  <Badge variant={plan.highlight ? 'new' : 'teal'}>{plan.badge}</Badge>
                </div>
              )}

              <h2 className={`font-display text-2xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-haven-navy'}`}>
                {plan.name}
              </h2>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/60' : 'text-haven-gray'}`}>
                {plan.tagline}
              </p>

              {/* Price */}
              <div className="mb-6">
                {plan.annualPrice === 0 ? (
                  <div className={`font-display text-5xl font-bold ${plan.highlight ? 'text-white' : 'text-haven-navy'}`}>
                    Free
                  </div>
                ) : (
                  <>
                    <div className="flex items-end gap-1">
                      <span className={`font-display text-5xl font-bold ${plan.highlight ? 'text-white' : 'text-haven-navy'}`}>
                        ${plan.annualPrice}
                      </span>
                      <span className={`text-sm mb-2 ${plan.highlight ? 'text-white/60' : 'text-haven-gray'}`}>/year</span>
                    </div>
                    <p className={`text-xs mt-1 ${plan.highlight ? 'text-white/50' : 'text-haven-gray-light'}`}>
                      or ${plan.monthlyPrice}/month • 3 months free to start
                    </p>
                  </>
                )}
              </div>

              <Link href={plan.ctaHref} className="mb-8">
                <Button
                  variant={plan.highlight ? 'white' : 'primary'}
                  className="w-full"
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {plan.cta}
                </Button>
              </Link>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2.5 text-sm">
                    {f.included ? (
                      <CheckCircle2 className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-haven-teal-light' : 'text-haven-teal'}`} />
                    ) : (
                      <X className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-white/20' : 'text-haven-sand-dark'}`} />
                    )}
                    <span className={f.included ? (plan.highlight ? 'text-white/80' : 'text-haven-navy') : (plan.highlight ? 'text-white/30' : 'text-haven-gray-light')}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Annual savings note */}
        <p className="text-center text-sm text-haven-gray mt-6">
          <span className="font-semibold text-haven-teal">Save up to 38%</span> with annual billing vs monthly.
          All plans renew automatically — cancel anytime.
        </p>
      </section>

      {/* ── PAID SITS NOTE ────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="container-haven max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="paid" className="mb-4">Paid sits</Badge>
              <h2 className="font-display text-3xl font-bold text-haven-navy mb-4">
                Earn on paid sits — we take a small cut
              </h2>
              <p className="text-haven-gray leading-relaxed mb-4">
                When a sitter completes a paid sit, Haven takes an 8% platform fee from the sit price.
                This is how we keep membership fees low for everyone.
              </p>
              <ul className="space-y-2">
                {[
                  'Owners set their own rate — no surprises',
                  'Sitters receive payment within 24 hrs of sit completion',
                  'Add-ons: 15% platform fee, rest goes to the service provider',
                  'Tips go 100% to sitters — we never touch them',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-haven-gray">
                    <CheckCircle2 className="h-4 w-4 text-haven-teal flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-haven-teal-pale rounded-3xl p-8 text-center">
              <div className="text-6xl mb-4">💸</div>
              <p className="font-display text-2xl font-bold text-haven-navy mb-2">
                $500/week sit
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-haven-gray">Sit rate</span>
                  <span className="font-semibold text-haven-navy">$500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-haven-gray">Haven fee (8%)</span>
                  <span className="font-semibold text-haven-error">−$40.00</span>
                </div>
                <div className="flex justify-between border-t border-haven-sand pt-2">
                  <span className="font-semibold text-haven-navy">Sitter receives</span>
                  <span className="font-bold text-haven-teal text-lg">$460.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────────────── */}
      <section className="py-20 container-haven">
        <div className="text-center mb-12">
          <Badge variant="teal" className="mb-4">How we compare</Badge>
          <h2 className="font-display text-3xl font-bold text-haven-navy mb-4">
            Haven vs the competition
          </h2>
          <p className="text-haven-gray">We'll let the features speak for themselves.</p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-haven-sand/40 bg-white shadow-card max-w-4xl mx-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-haven-sand/40">
                <th className="text-left p-5 text-haven-gray font-medium">Feature</th>
                <th className="p-5 text-center">
                  <div className="font-bold text-haven-navy">Haven</div>
                  <div className="text-xs text-haven-teal font-semibold">$79–$129/yr</div>
                </th>
                <th className="p-5 text-center">
                  <div className="font-medium text-haven-gray">TrustedHousesitters</div>
                  <div className="text-xs text-haven-gray-light">$129–$259/yr</div>
                </th>
                <th className="p-5 text-center">
                  <div className="font-medium text-haven-gray">Rover</div>
                  <div className="text-xs text-haven-gray-light">Per booking</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-haven-cream/30' : ''}>
                  <td className="p-5 font-medium text-haven-navy">{row.feature}</td>
                  <td className="p-5 text-center">
                    <span className={row.haven.includes('✓') || row.haven.includes('$') || row.haven.includes('No') || row.haven.includes('3') || row.haven.includes('Up') ? 'text-haven-teal font-semibold' : 'text-haven-gray'}>
                      {row.haven}
                    </span>
                  </td>
                  <td className="p-5 text-center text-haven-gray">{row.th}</td>
                  <td className="p-5 text-center text-haven-gray">{row.rover}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── SWITCH OFFER ──────────────────────────────────────────────────── */}
      <section id="switch" className="py-20 bg-haven-navy text-white">
        <div className="container-haven max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-haven-teal/20 text-haven-teal-light border-0">
              <RefreshCw className="h-3 w-3" /> Switcher offer
            </Badge>
            <h2 className="font-display text-4xl font-bold mb-4">
              Switching from another app?
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              We know changing apps feels like a hassle. So we're making it worth it.
              Show us you're paying elsewhere and we'll give you{' '}
              <span className="text-haven-teal-light font-semibold">3 months of Haven Premium — free.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              {switchBenefits.map((b, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-haven-teal flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-white/80 pt-1">{b}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <h3 className="font-semibold text-lg mb-4">Eligible platforms</h3>
              <ul className="space-y-2 mb-6">
                {['TrustedHousesitters', 'Rover', 'Wag', 'HouseCarers', 'MindMyHouse', 'Nomador'].map((app) => (
                  <li key={app} className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-haven-teal" />
                    {app}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=premium&switcher=true">
                <Button variant="primary" className="w-full" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Claim my 3 months free
                </Button>
              </Link>
              <p className="text-xs text-white/30 text-center mt-3">
                Upload subscription screenshot during signup to verify.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GUARANTEE ─────────────────────────────────────────────────────── */}
      <section className="py-20 container-haven">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Shield className="h-6 w-6" />,
              title: 'Haven Guarantee',
              desc: 'Up to $1,000 coverage for unexpected issues during any sit. For owners and sitters.',
            },
            {
              icon: <MessageCircle className="h-6 w-6" />,
              title: '24/7 Human Support',
              desc: 'Real people, real answers. Premium members get priority access to our support team any time.',
            },
            {
              icon: <HeartHandshake className="h-6 w-6" />,
              title: '30-day money back',
              desc: 'Not happy with Haven in your first 30 days of a paid plan? We'll refund you, no questions asked.',
            },
          ].map((item) => (
            <div key={item.title} className="card p-6 text-center">
              <div className="h-12 w-12 rounded-2xl bg-haven-teal-pale text-haven-teal flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-haven-navy mb-2">{item.title}</h3>
              <p className="text-sm text-haven-gray leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="pb-20 container-haven text-center">
        <div className="bg-haven-teal-pale rounded-3xl p-12 border border-haven-teal/20">
          <Zap className="h-10 w-10 text-haven-teal mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-haven-navy mb-3">
            Start exploring for free
          </h2>
          <p className="text-haven-gray mb-8 max-w-md mx-auto">
            No credit card. No commitment. 3 months free on any paid plan.
            Join thousands already using Haven.
          </p>
          <Link href="/signup">
            <Button size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Create free account
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
