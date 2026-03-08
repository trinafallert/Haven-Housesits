import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Star, CheckCircle2, MapPin, Shield, Users, ArrowRight, Search,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { VerifiedChip } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { PET_ICONS, PET_LABELS } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Browse Sitters — Haven Housesits',
  description: 'Find verified, background-checked house sitters from around the world. Browse sitter profiles, ratings, and reviews on Haven Housesits.',
}

async function getSitters() {
  try {
    const sitters = await prisma.user.findMany({
      where: {
        role: { in: ['SITTER', 'BOTH'] },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        tagline: true,
        bio: true,
        city: true,
        state: true,
        country: true,
        membershipPlan: true,
        idVerified: true,
        backgroundCheckStatus: true,
        averageRating: true,
        totalSits: true,
        totalReviews: true,
        yearsExperience: true,
        petTypes: true,
      },
      orderBy: [
        { averageRating: 'desc' },
        { totalSits: 'desc' },
      ],
      take: 24,
    })
    return sitters
  } catch (error) {
    console.error('Error fetching sitters:', error)
    return []
  }
}

export default async function SittersPage() {
  const sitters = await getSitters()

  return (
    <div className="bg-haven-cream min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-b from-haven-navy to-haven-teal-dark text-white py-20 px-4">
        <div className="container-haven text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            {sitters.length > 0 ? `${sitters.length}+ verified sitters` : 'Verified sitters worldwide'}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect<br />House Sitter
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Browse verified, background-checked sitters who'll care for your home
            and pets like their own — whether it's a free exchange or a paid sit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 bg-haven-teal text-white py-3 px-8 rounded-xl font-semibold text-base hover:bg-haven-teal-dark transition-colors"
            >
              <Search className="h-5 w-5" />
              Post a listing
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 py-3 px-8 rounded-xl font-semibold text-base hover:bg-white/20 transition-colors"
            >
              Become a sitter
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-haven-sand/40 bg-white py-6">
        <div className="container-haven">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-haven-gray">
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-haven-teal" /> Background checks available</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-haven-teal" /> ID verification</span>
            <span className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> Verified reviews</span>
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-haven-teal" /> $1,000 Haven Guarantee</span>
          </div>
        </div>
      </section>

      {/* Sitters grid */}
      <section className="py-12">
        <div className="container-haven">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold text-haven-navy">
              {sitters.length > 0 ? `${sitters.length} Sitters` : 'Our Sitters'}
            </h2>
          </div>

          {sitters.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🐾</div>
              <h3 className="font-display text-xl font-bold text-haven-navy mb-2">Sitters coming soon</h3>
              <p className="text-haven-gray mb-6">Be the first to join Haven Housesits as a sitter.</p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-haven-teal text-white py-3 px-6 rounded-xl font-semibold hover:bg-haven-teal-dark transition-colors"
              >
                Join as a sitter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sitters.map((sitter) => {
                const location = [sitter.city, sitter.state, sitter.country].filter(Boolean).join(', ')
                return (
                  <Link
                    key={sitter.id}
                    href={`/profile/${sitter.id}`}
                    className="card p-5 hover:shadow-md transition-shadow group"
                  >
                    {/* Avatar + verification */}
                    <div className="relative mb-4">
                      <div className="flex justify-center">
                        <div className="relative">
                          <Avatar
                            src={sitter.avatar ?? undefined}
                            firstName={sitter.firstName}
                            lastName={sitter.lastName}
                            size="xl"
                          />
                          {sitter.idVerified && (
                            <span className="absolute -bottom-1 -right-1 h-6 w-6 bg-haven-teal rounded-full flex items-center justify-center border-2 border-white">
                              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Name + location */}
                    <div className="text-center mb-3">
                      <h3 className="font-display font-bold text-haven-navy group-hover:text-haven-teal transition-colors">
                        {sitter.firstName} {sitter.lastName}
                      </h3>
                      {location && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-haven-gray-light" />
                          <span className="text-xs text-haven-gray">{location}</span>
                        </div>
                      )}
                    </div>

                    {/* Tagline */}
                    {sitter.tagline && (
                      <p className="text-xs text-haven-gray text-center mb-3 line-clamp-2">{sitter.tagline}</p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-3 mb-3">
                      {sitter.averageRating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-haven-navy">{sitter.averageRating.toFixed(1)}</span>
                          <span className="text-xs text-haven-gray">({sitter.totalReviews})</span>
                        </div>
                      )}
                      {sitter.totalSits > 0 && (
                        <>
                          {sitter.averageRating && <span className="text-haven-sand">·</span>}
                          <span className="text-xs text-haven-gray">{sitter.totalSits} sits</span>
                        </>
                      )}
                    </div>

                    {/* Verification chips */}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                      {sitter.idVerified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> ID
                        </span>
                      )}
                      {sitter.backgroundCheckStatus === 'VERIFIED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-haven-teal-pale text-haven-teal-dark text-xs font-medium border border-haven-teal/20">
                          <Shield className="h-3 w-3" /> BG Check
                        </span>
                      )}
                      {sitter.membershipPlan === 'PREMIUM' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                          ⭐ Premium
                        </span>
                      )}
                    </div>

                    {/* Pet types */}
                    {sitter.petTypes && sitter.petTypes.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1">
                        {sitter.petTypes.slice(0, 4).map((type) => (
                          <span key={type} className="text-sm" title={PET_LABELS[type]}>
                            {PET_ICONS[type] || '🐾'}
                          </span>
                        ))}
                        {sitter.petTypes.length > 4 && (
                          <span className="text-xs text-haven-gray">+{sitter.petTypes.length - 4}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-haven-sand/30 text-center">
                      <span className="text-xs font-semibold text-haven-teal group-hover:underline">
                        View profile →
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-haven-navy text-white">
        <div className="container-haven text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to find your sitter?</h2>
          <p className="text-white/70 mb-8">
            Post your listing today and connect with trusted sitters from around the world.
            Free exchange sits or paid — Haven makes it easy.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-haven-teal text-white py-3 px-8 rounded-xl font-semibold hover:bg-haven-teal-dark transition-colors"
          >
            Get started free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

    </div>
  )
}
