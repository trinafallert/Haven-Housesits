import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield, Star, MessageCircle, Sparkles, Search,
  ArrowRight, CheckCircle2, Home, Heart, DollarSign,
  Zap, Users, Globe, Clock, Gift, ChevronRight,
} from 'lucide-react'

// ─── Static data for the landing page ────────────────────────────────────────

const stats = [
  { value: '50,000+', label: 'Verified sitters' },
  { value: '120+',    label: 'Countries' },
  { value: '4.9★',    label: 'Average rating' },
  { value: '$0',      label: 'Starting price' },
]

const sitTypes = [
  {
    icon: '🌿',
    title: 'Exchange Sits',
    desc: 'Free sits — sitters care for your home in exchange for a place to stay.',
    badge: 'Most popular',
    badgeVariant: 'free' as const,
  },
  {
    icon: '💸',
    title: 'Paid Sits',
    desc: 'Browse and apply to paid housesits. Travel and earn — unlike Rover or Wag.',
    badge: 'Haven exclusive',
    badgeVariant: 'paid' as const,
  },
  {
    icon: '🏠',
    title: 'Vacant Sits',
    desc: 'No pets? No problem. Find someone to watch your home while you travel.',
    badge: null,
    badgeVariant: 'teal' as const,
  },
  {
    icon: '📅',
    title: 'Long-term Sits',
    desc: '30+ day sits with flexible terms — ideal for extended travel.',
    badge: null,
    badgeVariant: 'teal' as const,
  },
]

const whyHaven = [
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'More affordable than the rest',
    desc: 'Memberships start lower than competitors — same trust, better value. No surprise fees.',
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Browse paid sits by location',
    desc: "Unlike Rover or Wag, you can browse paid sits anywhere in the world — not just your city.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Smart application pool',
    desc: 'Owners can receive more applications, reducing last-minute cancellation stress.',
  },
  {
    icon: <Gift className="h-6 w-6" />,
    title: 'Premium add-ons',
    desc: 'Deep clean before you return, grocery stocking, welcome baskets and more.',
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Tip your sitter',
    desc: 'Had an amazing sit? Owners can tip their sitter directly through the app.',
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: '24/7 live support',
    desc: 'Real humans, not bots. Our support team is always available when you need us.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Haven Guarantee',
    desc: 'Up to $1,000 coverage for both owners and sitters. Peace of mind, included.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Duo sitter verification',
    desc: 'Co-sitters can both get background-checked — a unique Haven feature.',
  },
]

const addons = [
  { icon: '🧹', title: 'Deep Clean', desc: 'Come home to a spotless house — sitter arranges a professional clean before you return.' },
  { icon: '🛒', title: 'Grocery Stock', desc: 'Arrive to a stocked fridge. The sitter picks up your essentials before you land.' },
  { icon: '📸', title: 'Pet Photos Package', desc: 'Receive a gallery of adorable photos of your pets during the sit.' },
  { icon: '💐', title: 'Plant Care', desc: 'Keep your green friends happy with dedicated plant watering and care.' },
]

const testimonials = [
  {
    name: 'Sarah & Tom',
    location: 'Sydney, Australia',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Home owners',
    rating: 5,
    text: "We've used TrustedHousesitters for years but switched to Haven and never looked back. Cheaper, better support, and the add-on deep clean is a game changer.",
  },
  {
    name: 'Marco Rivera',
    location: 'Barcelona, Spain',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Sitter',
    rating: 5,
    text: 'Being able to actually browse paid sits by destination is huge. I travel full-time and Haven lets me fund it while caring for amazing homes.',
  },
  {
    name: 'Priya Nair',
    location: 'London, UK',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    role: 'Sitter & owner',
    rating: 5,
    text: "The Sit Match Score is so clever — I can see exactly why a sit is a great fit for me. The daily pet journal feature makes my cat parents feel at ease too.",
  },
]

const faqs = [
  {
    q: 'How is Haven different from TrustedHousesitters?',
    a: 'Haven offers paid sits alongside free exchange sits, has a smart rolling application pool (up to 7 active applicants — declining one opens a new slot), charges lower membership fees, includes premium add-ons like deep cleaning, lets owners tip sitters, and provides 24/7 live human support.',
  },
  {
    q: 'Can I browse paid sits by location?',
    a: 'Yes! Unlike Rover and Wag, Haven lets you search paid sits anywhere in the world. Travel to your dream destination and earn while you care for a home.',
  },
  {
    q: 'What is the Haven Guarantee?',
    a: 'Haven provides up to $1,000 coverage for unexpected issues during a sit — covering both home owners and sitters. Full details in our safety page.',
  },
  {
    q: 'Can I use one account for both sitting and listing my home?',
    a: 'Absolutely. One account, one login across web and mobile — switch between your owner and sitter roles anytime.',
  },
  {
    q: 'What are add-ons?',
    a: 'Add-ons are optional premium services owners can purchase for a sit — like a professional deep clean before they return, grocery stocking, or a pet photo package.',
  },
  {
    q: 'How does the Sit Match Score work?',
    a: "Haven's Sit Match Score calculates a compatibility percentage between a sitter's profile and a listing — considering pet experience, location preferences, verifications, and past sit history.",
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="bg-haven-cream">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-70" />
        <div className="container-haven relative py-24 md:py-32">
          <div className="max-w-3xl">
            <Badge variant="teal" className="mb-6">
              <Sparkles className="h-3 w-3" />
              Free & paid sits in one place
            </Badge>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-haven-navy leading-tight mb-6">
              Your home.{' '}
              <span className="text-haven-teal">Their adventure.</span>{' '}
              Everyone wins.
            </h1>

            <p className="text-lg md:text-xl text-haven-gray leading-relaxed mb-10 max-w-2xl">
              Haven connects verified home owners with trusted sitters worldwide —
              free exchange sits, paid sits you can actually browse, and premium add-ons
              that make every sit exceptional.
            </p>

            {/* Search bar */}
            <div className="bg-white rounded-2xl shadow-haven-lg border border-haven-sand/40 p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mb-8">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="h-5 w-5 text-haven-gray flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Where do you want to sit?"
                  className="flex-1 bg-transparent text-haven-navy placeholder:text-haven-gray-light outline-none text-sm font-medium py-2"
                />
              </div>
              <Link href="/search">
                <Button variant="primary" size="md" className="w-full sm:w-auto whitespace-nowrap">
                  Find sits
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display font-bold text-2xl text-haven-navy">{s.value}</div>
                  <div className="text-sm text-haven-gray">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero image panel */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-[42%]">
          <div className="relative h-full">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80"
              alt="Beautiful home available for a house sit"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-haven-cream via-transparent to-transparent" />
            {/* Floating card */}
            <div className="absolute bottom-12 left-6 bg-white rounded-2xl shadow-card-hover p-4 max-w-xs animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sitter" width={40} height={40} className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-haven-navy text-sm">Emma & Jake</p>
                  <p className="text-xs text-haven-gray">Verified · Background checked</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-haven-gray ml-1">5.0 · 24 sits</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="h-3 w-3" /> 98% Match
                </Badge>
                <Badge variant="teal" size="sm">Available now</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIT TYPES ─────────────────────────────────────────────────────── */}
      <section className="py-20 container-haven">
        <div className="text-center mb-12">
          <Badge variant="teal" className="mb-4">All types, one platform</Badge>
          <h2 className="section-title mb-4">Every kind of sit, covered</h2>
          <p className="text-haven-gray max-w-xl mx-auto">
            Whether you want a free exchange or need a paid sitter fast — Haven has you covered.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sitTypes.map((type) => (
            <div key={type.title} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl mb-4">{type.icon}</div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-display font-semibold text-lg text-haven-navy">{type.title}</h3>
                {type.badge && <Badge variant={type.badgeVariant} size="sm">{type.badge}</Badge>}
              </div>
              <p className="text-sm text-haven-gray leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY HAVEN ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-haven">
          <div className="text-center mb-12">
            <Badge variant="teal" className="mb-4">Why Haven</Badge>
            <h2 className="section-title mb-4">Built to be better — for everyone</h2>
            <p className="text-haven-gray max-w-xl mx-auto">
              We took everything people love about housesitting apps and fixed what was frustrating.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyHaven.map((item) => (
              <div key={item.title} className="card-flat p-6 rounded-2xl border border-haven-sand/40">
                <div className="h-11 w-11 rounded-xl bg-haven-teal-pale text-haven-teal flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-haven-navy mb-2">{item.title}</h3>
                <p className="text-sm text-haven-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADD-ONS ───────────────────────────────────────────────────────── */}
      <section className="py-20 container-haven">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="paid" className="mb-4">Premium add-ons</Badge>
            <h2 className="section-title mb-4">Come home to something extra</h2>
            <p className="text-haven-gray mb-8 leading-relaxed">
              Haven add-ons let you customise your sit experience. Whether you want a
              spotless home waiting for you or your fridge stocked on arrival — it's handled.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addons.map((addon) => (
                <div key={addon.title} className="card-flat rounded-2xl p-4 border border-haven-sand/40 flex gap-3">
                  <span className="text-2xl">{addon.icon}</span>
                  <div>
                    <p className="font-semibold text-haven-navy text-sm">{addon.title}</p>
                    <p className="text-xs text-haven-gray mt-0.5 leading-relaxed">{addon.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-haven-teal-pale rounded-2xl border border-haven-teal/20">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-haven-teal" />
                <span className="font-semibold text-haven-teal-dark text-sm">Tip your sitter</span>
              </div>
              <p className="text-sm text-haven-gray">
                Had an exceptional sit? Send your sitter a tip directly through the app. A little gratitude goes a long way.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-haven-lg">
            <Image
              src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80"
              alt="Beautiful clean home"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-haven-navy text-white">
        <div className="container-haven">
          <div className="text-center mb-12">
            <Badge variant="teal" className="mb-4">Simple process</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How Haven works</h2>
            <p className="text-white/60 max-w-xl mx-auto">Get started in minutes. No complicated setup.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Users className="h-6 w-6" />,
                title: 'Create your profile',
                desc: 'Sign up free, complete your profile, add verifications. Takes under 10 minutes.',
              },
              {
                step: '02',
                icon: <Globe className="h-6 w-6" />,
                title: 'Find your perfect match',
                desc: 'Browse sits by location, dates, pet type, and sit type. Filter for free or paid sits.',
              },
              {
                step: '03',
                icon: <Heart className="h-6 w-6" />,
                title: 'Connect & confirm',
                desc: 'Message directly, get confirmed, and enjoy the sit. Review each other after.',
              },
            ].map((step) => (
              <div key={step.step} className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-2xl bg-haven-teal flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div>
                  <div className="text-haven-teal-light text-sm font-semibold mb-1">{step.step}</div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-20 container-haven">
        <div className="text-center mb-12">
          <Badge variant="teal" className="mb-4">What people say</Badge>
          <h2 className="section-title mb-4">Loved by sitters and owners alike</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-haven-gray text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={t.avatar} alt={t.name} width={40} height={40} className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-haven-navy text-sm">{t.name}</p>
                  <p className="text-xs text-haven-gray">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-haven">
          <div className="bg-gradient-to-br from-haven-teal via-haven-teal-dark to-haven-navy rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white -translate-x-12 translate-y-12" />
            </div>
            <div className="relative">
              <Badge className="mb-6 bg-white/20 text-white border-0">
                <Clock className="h-3 w-3" /> Limited time offer
              </Badge>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Start your adventure today
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join for free and get 2 months of Premium membership included.
                No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button variant="white" size="xl">
                    Get started free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="xl" className="bg-white/10 text-white hover:bg-white/20 border-0">
                    View pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 container-haven">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="teal" className="mb-4">FAQ</Badge>
            <h2 className="section-title mb-4">Common questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="card p-6 group cursor-pointer">
                <summary className="flex items-center justify-between gap-4 font-semibold text-haven-navy list-none">
                  {faq.q}
                  <ChevronRight className="h-5 w-5 text-haven-gray flex-shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-sm text-haven-gray leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/faq">
              <Button variant="secondary">
                View all FAQs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── APP DOWNLOAD ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-haven-navy overflow-hidden">
        <div className="container-haven">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-haven-teal/20 text-haven-teal-light border-0">
              <Globe className="h-3 w-3" /> Available on iOS &amp; Android
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Take Haven everywhere
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-lg">
              Same login, same sits — browse, apply, message, and manage
              your sits from your phone.
            </p>
          </div>

          {/* App screenshots */}
          <div className="flex justify-center gap-4 md:gap-6 mb-12 overflow-x-auto pb-4">
            {[
              { src: '/screenshots/screen-search.png', label: 'Browse sits' },
              { src: '/screenshots/screen-listing.png', label: 'Listing detail' },
              { src: '/screenshots/screen-inbox.png', label: 'Messaging' },
              { src: '/screenshots/screen-profile.png', label: 'Your profile' },
            ].map((screen, i) => (
              <div
                key={screen.src}
                className="flex-shrink-0 flex flex-col items-center gap-3"
                style={{ transform: i % 2 === 1 ? 'translateY(24px)' : 'translateY(0)' }}
              >
                {/* Phone frame */}
                <div className="relative w-[140px] md:w-[160px]">
                  <div className="rounded-[28px] border-[3px] border-white/20 bg-black shadow-2xl overflow-hidden">
                    <div className="bg-black h-5 flex items-center justify-center">
                      <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/haven${screen.src}`}
                      alt={screen.label}
                      className="w-full block"
                    />
                    <div className="bg-black h-4" />
                  </div>
                </div>
                <span className="text-white/50 text-xs font-medium">{screen.label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/download/ios" className="inline-flex items-center gap-3 bg-white text-haven-navy px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-haven-cream transition-colors shadow-lg">
              <span className="text-2xl">🍎</span>
              <div className="text-left">
                <div className="text-xs text-haven-gray font-normal">Download on the</div>
                <div>App Store</div>
              </div>
            </Link>
            <Link href="/download/android" className="inline-flex items-center gap-3 bg-white text-haven-navy px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-haven-cream transition-colors shadow-lg">
              <span className="text-2xl">🤖</span>
              <div className="text-left">
                <div className="text-xs text-haven-gray font-normal">Get it on</div>
                <div>Google Play</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
