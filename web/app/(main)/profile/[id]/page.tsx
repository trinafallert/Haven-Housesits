import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Star, CheckCircle2, MapPin, Calendar, Users,
  Briefcase, MessageSquare, Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge, VerifiedChip, MatchScore } from '@/components/ui/badge'
import { ListingCard } from '@/components/listings/listing-card'
import { PET_ICONS, PET_LABELS, formatDateRange } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import ReviewList from '@/components/ReviewList'

async function getProfile(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        tagline: true,
        bio: true,
        role: true,
        occupation: true,
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
        whyHouseSit: true,
        petTypes: true,
        hasCoSitter: true,
        createdAt: true,
        listings: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            title: true,
            city: true,
            state: true,
            country: true,
            startDate: true,
            endDate: true,
            photos: true,
            type: true,
            isPaid: true,
            price: true,
            currency: true,
            currentApplicants: true,
            maxApplications: true,
            pets: {
              select: { type: true, name: true },
            },
          },
          orderBy: { startDate: 'asc' },
          take: 6,
        },
        reviewsReceived: {
          where: { isPublished: true },
          include: {
            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            listing: {
              select: {
                city: true,
                state: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
    return user
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const profile = await getProfile(params.id)
  if (!profile) return {}
  return {
    title: `${profile.firstName} ${profile.lastName} — Haven Housesits`,
    description: profile.tagline || profile.bio || `View ${profile.firstName}'s sitter profile on Haven Housesits.`,
  }
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const profile = await getProfile(params.id)
  if (!profile) notFound()

  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ')
  const memberSince = new Date(profile.createdAt).getFullYear()

  return (
    <div className="bg-haven-cream min-h-screen pb-16">
      <div className="container-haven max-w-2xl py-6">

        {/* Back */}
        <Link href="/search" className="inline-flex items-center gap-1.5 text-sm text-haven-gray hover:text-haven-navy transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>

        {/* Profile hero */}
        <div className="card p-6 mb-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <Avatar
                src={profile.avatar ?? undefined}
                firstName={profile.firstName}
                lastName={profile.lastName}
                size="xl"
              />
              {profile.idVerified && (
                <span className="absolute -bottom-1 -right-1 h-6 w-6 bg-haven-teal rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl font-bold text-haven-navy">
                  {profile.firstName} {profile.lastName}
                </h1>
              </div>
              {profile.tagline && (
                <p className="text-haven-gray text-sm mt-0.5">{profile.tagline}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                {location && (
                  <>
                    <MapPin className="h-3.5 w-3.5 text-haven-gray-light" />
                    <span className="text-xs text-haven-gray">{location}</span>
                  </>
                )}
                {profile.occupation && (
                  <>
                    <span className="text-haven-sand">·</span>
                    <Briefcase className="h-3.5 w-3.5 text-haven-gray-light" />
                    <span className="text-xs text-haven-gray">{profile.occupation}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-haven-gray-light mt-1">Member since {memberSince}</p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button className="p-2 rounded-full hover:bg-haven-gray-pale transition-colors">
                <Share2 className="h-4 w-4 text-haven-gray" />
              </button>
            </div>
          </div>

          {/* Rating row */}
          {(profile.averageRating || profile.totalSits > 0) && (
            <div className="flex flex-wrap items-center gap-4 py-3 border-y border-haven-sand/30 mb-4">
              {profile.averageRating && (
                <>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-haven-navy">{profile.averageRating.toFixed(2)}</span>
                    <span className="text-xs text-haven-gray">({profile.totalReviews} reviews)</span>
                  </div>
                  <div className="w-px h-4 bg-haven-sand" />
                </>
              )}
              {profile.totalSits > 0 && (
                <div className="text-sm">
                  <span className="font-bold text-haven-navy">{profile.totalSits}</span>
                  <span className="text-haven-gray text-xs"> sits completed</span>
                </div>
              )}
            </div>
          )}

          {/* Verified chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.idVerified && <VerifiedChip>ID Verified</VerifiedChip>}
            {profile.backgroundCheckStatus === 'VERIFIED' && <VerifiedChip>Background Check</VerifiedChip>}
            {profile.hasCoSitter && (
              <VerifiedChip>
                <Users className="h-3 w-3" /> Duo sitter
              </VerifiedChip>
            )}
            {profile.membershipPlan === 'PREMIUM' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                ⭐ Premium member
              </span>
            )}
          </div>

          {/* CTA */}
          <Button className="w-full" leftIcon={<MessageSquare className="h-4 w-4" />}>
            Message {profile.firstName}
          </Button>
        </div>

        {/* About */}
        {(profile.bio || profile.whyHouseSit) && (
          <div className="card p-5 mb-5">
            <h2 className="font-display text-lg font-bold text-haven-navy mb-3">About {profile.firstName}</h2>
            {profile.bio && (
              <p className="text-haven-gray text-sm leading-relaxed mb-4">{profile.bio}</p>
            )}
            {profile.whyHouseSit && (
              <>
                <h3 className="font-semibold text-haven-navy text-sm mb-1.5">Why I love house sitting</h3>
                <p className="text-haven-gray text-sm leading-relaxed">{profile.whyHouseSit}</p>
              </>
            )}
          </div>
        )}

        {/* Experience */}
        {(profile.yearsExperience || (profile.petTypes && profile.petTypes.length > 0)) && (
          <div className="card p-5 mb-5">
            <h2 className="font-display text-lg font-bold text-haven-navy mb-3">Experience</h2>
            {profile.yearsExperience && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-bold text-haven-teal">{profile.yearsExperience}</span>
                <span className="text-haven-gray text-sm">years of pet care experience</span>
              </div>
            )}
            {profile.petTypes && profile.petTypes.length > 0 && (
              <>
                <h3 className="font-semibold text-haven-navy text-sm mb-2">Pets I'm comfortable with</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.petTypes.map((type) => (
                    <span key={type} className="badge-teal">
                      {PET_ICONS[type]} {PET_LABELS[type]}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Active listings */}
        {profile.listings && profile.listings.length > 0 && (
          <div className="mb-5">
            <h2 className="font-display text-lg font-bold text-haven-navy mb-3">
              Active listings from {profile.firstName}
            </h2>
            <div className="space-y-4">
              {profile.listings.map((listing) => {
                const startDate = listing.startDate.toISOString().split('T')[0]
                const endDate = listing.endDate.toISOString().split('T')[0]
                return (
                  <ListingCard
                    key={listing.id}
                    listing={{
                      id: listing.id,
                      title: listing.title,
                      city: listing.city,
                      state: listing.state ?? undefined,
                      country: listing.country,
                      startDate,
                      endDate,
                      photos: listing.photos,
                      type: listing.type,
                      isPaid: listing.isPaid,
                      price: listing.price ?? undefined,
                      currency: listing.currency,
                      pets: listing.pets.map((p) => ({ type: p.type, name: p.name })),
                      owner: {
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        avatar: profile.avatar ?? undefined,
                        averageRating: profile.averageRating ?? undefined,
                        totalSits: profile.totalSits,
                      },
                      currentApplicants: listing.currentApplicants,
                      maxApplications: listing.maxApplications,
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Reviews */}
        {profile.reviewsReceived && profile.reviewsReceived.length > 0 && (
          <ReviewList
            reviews={profile.reviewsReceived.map((r) => ({
              ...r,
              createdAt: r.createdAt.toISOString(),
            }))}
            averageRating={profile.averageRating}
            totalReviews={profile.totalReviews}
          />
        )}

      </div>
    </div>
  )
}
