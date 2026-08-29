import Link from 'next/link'
import { Shield, CheckCircle2, AlertCircle, Phone, Lock, Eye, CreditCard, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

const INSURANCE_OPTIONS = [
  {
    name: 'Haven Guarantee',
    tagline: 'Built-in for every sit',
    icon: '🛡️',
    cost: 'Included free',
    covers: [
      'Up to $1,000 for accidental property damage by sitter',
      'Lost keys / locksmith callout',
      'Emergency vet visits for insured pets (up to $500)',
      '24/7 Haven emergency helpline',
    ],
    notCovered: [
      'Pre-existing damage',
      'Intentional damage',
      'Theft by third parties',
    ],
    provider: 'Haven internal guarantee fund',
    color: 'border-haven-teal',
    badge: 'Every sit',
  },
  {
    name: 'HomeOwner Plus',
    tagline: 'Extended home protection',
    icon: '🏠',
    cost: '$12/sit or included with Premium plan',
    covers: [
      'Up to $25,000 property damage',
      'Theft by sitter (after police report)',
      'Accidental damage to furniture & appliances',
      'Public liability if sitter injures themselves',
      'Professional cleaning if home left dirty',
    ],
    notCovered: [
      'Structural damage',
      'Flood / earthquake (act of god)',
      'Pre-existing conditions',
    ],
    provider: 'Markel Insurance (rated A+ by A.M. Best)',
    color: 'border-amber-400',
    badge: 'Popular',
  },
  {
    name: 'SitterSafe',
    tagline: 'Protection for sitters',
    icon: '🌿',
    cost: '$8/sit or included with Premium plan',
    covers: [
      'Personal liability if pet injures a third party',
      'Medical expenses if sitter bitten by pet',
      'Emergency travel home if family emergency',
      'Lost / stolen belongings while sitting (up to $500)',
    ],
    notCovered: [
      'Pre-existing medical conditions',
      'Dangerous breeds (breed-specific)',
    ],
    provider: 'Next Insurance (A-rated, AXA reinsured)',
    color: 'border-emerald-400',
    badge: 'Sitters love this',
  },
  {
    name: 'PetGuard',
    tagline: 'Veterinary cost coverage',
    icon: '🐾',
    cost: '$6/sit',
    covers: [
      'Emergency vet costs up to $3,000 per sit',
      'Medications prescribed during sit',
      'Pet taxi / emergency transport',
      '24/7 vet advice hotline',
    ],
    notCovered: [
      'Routine / preventive care',
      'Pre-existing pet conditions',
    ],
    provider: 'Trupanion (partnered)',
    color: 'border-purple-400',
    badge: 'Pet owners love this',
  },
]

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: 'PCI DSS Compliant Payments',
    desc: 'Your card number never touches Haven\'s servers. All payment data is processed inside Stripe\'s secure iframe. We store only a token.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Encryption',
    desc: 'All data in transit uses TLS 1.3. Database encrypted at rest with AES-256. Regular penetration testing by third-party security firms.',
  },
  {
    icon: Eye,
    title: 'Identity Verification',
    desc: 'Government-issued ID verified by Stripe Identity. Background checks via Evident. Both checks required for our Verified Duo badge.',
  },
  {
    icon: CreditCard,
    title: 'Escrow Protection',
    desc: 'For paid sits, funds are held in Stripe escrow until the sit is confirmed complete. Neither party can dispute this in bad faith.',
  },
  {
    icon: FileText,
    title: 'Blind Review System',
    desc: 'Reviews are hidden until both parties submit them, or 14 days pass. Eliminates retaliation reviews that plague other platforms.',
  },
  {
    icon: Phone,
    title: '24/7 Human Support',
    desc: 'Real humans — not bots — available via phone, chat, or email. Average response time under 4 minutes. Safety issues get escalated immediately.',
  },
]

export default function SafetyPage() {
  return (
    <div className="bg-haven-cream min-h-screen">

      {/* Hero */}
      <section className="bg-haven-navy text-white py-20">
        <div className="container-haven max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-haven-teal/20 text-haven-teal-light px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield className="h-4 w-4" />
            Trust & Safety at Haven
          </div>
          <h1 className="font-display text-5xl font-bold mb-4">
            Your safety is our{' '}
            <span className="text-haven-teal-light">top priority</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Haven is built with security-first architecture, optional insurance upgrades,
            rigorous verification, and a real human support team on call 24/7.
          </p>
        </div>
      </section>

      {/* Security features */}
      <section className="py-16">
        <div className="container-haven max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-haven-navy text-center mb-2">
            Built-in security — always on
          </h2>
          <p className="text-center text-haven-gray mb-10">
            Every Haven account, every sit, every payment — protected by design.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {SECURITY_FEATURES.map((feat) => (
              <div key={feat.title} className="card p-5">
                <div className="h-11 w-11 rounded-2xl bg-haven-teal-pale flex items-center justify-center mb-3">
                  <feat.icon className="h-5 w-5 text-haven-teal" />
                </div>
                <h3 className="font-bold text-haven-navy mb-2">{feat.title}</h3>
                <p className="text-sm text-haven-gray leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance options */}
      <section className="py-16 bg-haven-cream-dark">
        <div className="container-haven max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-haven-navy text-center mb-2">
            Insurance options
          </h2>
          <p className="text-center text-haven-gray mb-10">
            Every sit includes our Haven Guarantee for free. Add more protection with our insurance partners.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {INSURANCE_OPTIONS.map((plan) => (
              <div key={plan.name} className={`card p-6 border-2 ${plan.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-3xl mb-1">{plan.icon}</div>
                    <h3 className="font-display font-bold text-xl text-haven-navy">{plan.name}</h3>
                    <p className="text-haven-gray text-sm">{plan.tagline}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-haven-navy text-white flex-shrink-0">
                    {plan.badge}
                  </span>
                </div>

                <p className="text-sm font-semibold text-haven-teal-dark mb-3">{plan.cost}</p>

                <div className="mb-3">
                  <p className="text-xs font-bold text-haven-navy uppercase tracking-wider mb-2">Covered</p>
                  <ul className="space-y-1.5">
                    {plan.covers.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-haven-gray">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-bold text-haven-navy uppercase tracking-wider mb-2">Not covered</p>
                  <ul className="space-y-1">
                    {plan.notCovered.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-haven-gray-light">
                        <AlertCircle className="h-3.5 w-3.5 text-haven-sand flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[10px] text-haven-gray-light border-t border-haven-sand/30 pt-3">
                  Underwritten by: {plan.provider}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-haven-gray text-center mt-6">
            * Insurance products are underwritten by third-party insurers. Haven acts as a licensed insurance agent.
            Coverage subject to policy terms and conditions. Not available in all jurisdictions.
          </p>
        </div>
      </section>

      {/* Trust verification flow */}
      <section className="py-16">
        <div className="container-haven max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-haven-navy text-center mb-10">
            How we verify sitters
          </h2>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Email & phone verification', desc: 'Required for all users on sign-up. Disposable emails are blocked.' },
              { step: 2, title: 'ID verification', desc: 'Optional but strongly encouraged. Passport or driver\'s license verified in real-time by Stripe Identity.' },
              { step: 3, title: 'Background check', desc: 'Optional criminal record + identity check via Evident. US-wide coverage. Adds the "Background Check ✓" badge.' },
              { step: 4, title: 'Profile review', desc: 'Haven moderators review new profiles for red flags before their first application is sent.' },
              { step: 5, title: 'Verified references', desc: 'Up to 4 personal references — Haven emails them directly and confirms the relationship.' },
              { step: 6, title: 'Sit history & reviews', desc: 'Blind review system ensures honest feedback. Sitters with < 4.0 rating are automatically flagged for review.' },
            ].map((item) => (
              <div key={item.step} className="card p-4 flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-haven-teal text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-haven-navy">{item.title}</p>
                  <p className="text-sm text-haven-gray">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-haven-teal-pale">
        <div className="container-haven text-center max-w-xl">
          <h2 className="font-display text-3xl font-bold text-haven-navy mb-3">
            Questions about safety?
          </h2>
          <p className="text-haven-gray mb-6">
            Our Trust & Safety team is available 24/7.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button>Chat with support</Button>
            <Link href="/faq">
              <Button variant="secondary">Read the FAQ</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
