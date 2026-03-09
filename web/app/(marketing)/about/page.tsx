import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Heart, Globe, Shield, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Haven Housesits — Our Story',
  description: 'Haven Housesits was built to be better than TrustedHousesitters — more affordable, more flexible, with paid sits and premium add-ons.',
}

const VALUES = [
  { icon: <Heart className="h-6 w-6" />, title: 'Trust first', desc: 'Every sitter is identity-verified. Background checks, references, and blind reviews — because your home and pets deserve it.' },
  { icon: <Globe className="h-6 w-6" />, title: 'Global flexibility', desc: 'Housesitting should be possible anywhere. We built a platform that works for digital nomads, retirees, and everyone in between.' },
  { icon: <Shield className="h-6 w-6" />, title: 'Fair for everyone', desc: "Owners get more applicants. Sitters get fair pay for paid sits. No artificial caps, no hidden fees, no favouritism." },
  { icon: <Zap className="h-6 w-6" />, title: 'Built to improve', desc: 'We ship updates constantly. Every feature — the add-ons, paid sits, match scores — came from real user feedback.' },
]

const TEAM = [
  { name: 'Trina Fallert', role: 'Founder & CEO', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', bio: 'Serial entrepreneur and cat lover. Built Haven after getting frustrated with the limitations of existing platforms.' },
]

export default function AboutPage() {
  return (
    <div className="bg-haven-cream">
      {/* Hero */}
      <section className="py-24 container-haven">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1 rounded-full font-semibold bg-haven-teal-pale text-haven-teal-dark px-3 py-1 text-xs mb-6">Our story</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-haven-navy leading-tight mb-6">
            We built Haven<br />
            <span className="text-haven-teal">because we needed it.</span>
          </h1>
          <p className="text-xl text-haven-gray leading-relaxed mb-6">
            Haven started with a simple frustration: housesitting platforms hadn't evolved in years. Five-applicant caps. No paid sits you could actually browse by destination. No way to tip a great sitter. No add-ons.
          </p>
          <p className="text-lg text-haven-gray leading-relaxed">
            So we built the platform we always wanted — one that works for modern travellers, remote workers, pet owners, and professional sitters.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-haven-navy text-white">
        <div className="container-haven">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 'Global', label: 'Sits worldwide & growing' },
              { value: '4.9★',   label: 'Average member rating' },
              { value: '3 mo',   label: 'Free to start' },
              { value: '24/7',   label: 'Real human support' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-haven-teal-light">{s.value}</div>
                <div className="text-sm text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container-haven max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full font-semibold bg-haven-teal-pale text-haven-teal-dark px-3 py-1 text-xs mb-4">Our mission</span>
              <h2 className="section-title mb-4">A safe haven for every stay</h2>
              <p className="text-haven-gray leading-relaxed mb-4">
                We believe housesitting should be accessible, trustworthy, and — when it makes sense — fairly paid. The status quo treated sitters as free labour and owners as lucky to find anyone.
              </p>
              <p className="text-haven-gray leading-relaxed mb-4">
                Haven changes that. Paid sits sit alongside free exchange sits. Owners can tip exceptional sitters. Add-ons let both parties customise the experience. And our application cap is gone — more choice for everyone.
              </p>
              <p className="text-haven-gray leading-relaxed">
                We're building the platform that the housesitting community deserves.
              </p>
            </div>
            <div className="bg-haven-cream rounded-3xl p-8 border border-haven-sand/40">
              <div className="text-5xl mb-4">🏡</div>
              <blockquote className="text-haven-navy font-display text-xl font-semibold leading-snug mb-4">
                "Every stay should feel like a safe haven — for the home, the pets, and the sitter."
              </blockquote>
              <p className="text-sm text-haven-gray">— Trina Fallert, Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 container-haven">
        <div className="text-center mb-14">
          <h2 className="section-title mb-4">What we stand for</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-6">
              <div className="h-11 w-11 rounded-xl bg-haven-teal-pale text-haven-teal flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h3 className="font-semibold text-haven-navy mb-2">{v.title}</h3>
              <p className="text-sm text-haven-gray leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container-haven max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">The team</h2>
            <p className="text-haven-gray">Small, focused, and obsessed with making housesitting better.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {TEAM.map((t) => (
              <div key={t.name} className="card p-8 text-center max-w-xs">
                <img src={t.avatar} alt={t.name} className="h-20 w-20 rounded-full object-cover mx-auto mb-4" />
                <h3 className="font-semibold text-haven-navy text-lg">{t.name}</h3>
                <p className="text-sm text-haven-teal font-medium mb-3">{t.role}</p>
                <p className="text-sm text-haven-gray leading-relaxed">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 container-haven text-center">
        <h2 className="section-title mb-4">Join the Haven community</h2>
        <p className="text-haven-gray mb-8 max-w-xl mx-auto">Free to join. Start browsing sits today.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/haven/signup"
            className="inline-flex items-center gap-2 bg-haven-teal hover:bg-haven-teal-dark text-white font-bold px-8 py-4 rounded-2xl text-base transition-colors"
          >
            Get started free <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/haven/search"
            className="inline-flex items-center gap-2 border-2 border-haven-teal text-haven-teal-dark hover:bg-haven-teal-pale font-semibold px-8 py-4 rounded-2xl text-base transition-colors"
          >
            Browse sits
          </Link>
        </div>
      </section>
    </div>
  )
}
