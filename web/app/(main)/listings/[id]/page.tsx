import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin, Calendar, Star, Shield, CheckCircle2,
  Users, Wifi, Car, Heart, ArrowLeft, MessageCircle,
  Droplets, Trees, ParkingSquare, Wind, Waves, Dumbbell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge, VerifiedChip, MatchScore } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { prisma } from '@/lib/prisma'
import { formatDateRange, sitDuration, PET_ICONS, PET_LABELS } from '@/lib/utils'
import { ApplicationPanel } from '@/components/listings/application-panel'

async function getListing(id: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            tagline: true,
            bio: true,
            averageRating: true,
            totalSits: true,
            totalReviews: true,
            idVerified: true,
            backgroundCheckStatus: true,
            membershipPlan: true,
            city: true,
            state: true,
            country: true,
            occupation: true,
            createdAt: true,
          },
        },
        pets: true,
        _count: {
          select: { applications: true },
        },
        reviews: {
          where: { isPublished: true },
          include: {
            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                averageRating: true,
              },
            },
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return listing
  } catch (error) {
    console.error('Error fetching listing:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await getListing(params.id)
  if (!listing) return {}
  return {
    title: `${listing.title} — Haven Housesits`,
    description: `House sit in ${listing.city}, ${listing.country}. ${formatDateRange(listing.startDate.toISOString(), listing.endDate.toISOString())}.`,
  }
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id)
  if (!listing) notFound()

  const startDate = listing.startDate.toISOString().split('T')[0]
  const endDate = listing.endDate.toISOString().split('T')[0]
  const duration = sitDuration(startDate, endDate)

  // Build listing data shape expected by ApplicationPanel
  const listingForPanel = {
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
      firstName: listing.owner.firstName,
      lastName: listing.owner.lastName,
      avatar: listing.owner.avatar ?? undefined,
      averageRating: listing.owner.averageRating ?? undefined,
      totalSits: listing.owner.totalSits,
    },
    isNew: (new Date().getTime() - listing.startDate.getTime()) < 7 * 24 * 60 * 60 * 1000,
    currentApplicants: listing._count.applications,
    maxApplications: listing.maxApplications,
  }

  const amenities = [
    { icon: <Wifi className="h-4 w-4" />,          label: 'High-speed WiFi',     active: listing.hasWifi || listing.hasFastWifi },
    { icon: <Car className="h-4 w-4" />,            label: 'Car included',         active: listing.carIncluded },
    { icon: <Users className="h-4 w-4" />,          label: 'Family friendly',      active: listing.isFamilyFriendly },
    { icon: <Shield className="h-4 w-4" />,         label: 'Accessible',           active: listing.isAccessible },
    { icon: <Droplets className="h-4 w-4" />,       label: 'Pool',                 active: listing.hasPool },
    { icon: <Trees className="h-4 w-4" />,          label: 'Garden',               active: listing.hasGarden },
    { icon: <ParkingSquare className="h-4 w-4" />,  label: 'Parking',              active: listing.hasParking },
    { icon: <Wind className="h-4 w-4" />,           label: 'Air conditioning',     active: listing.hasAircon },
    { icon: <Dumbbell className="h-4 w-4" />,       label: 'Workspace',            active: listing.hasWorkspace },
    { icon: <Waves className="h-4 w-4" />,          label: 'Near beach',           active: listing.nearBeach },
  ].filter((a) => a.active || ['High-speed WiFi', 'Car included', 'Family friendly', 'Accessible'].includes(a.label))

  const mainPhoto = listing.photos[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80'
  const extraPhotos = listing.photos.slice(1, 5)
  const fallbackPhotos = [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=70',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=70',
  ]
  const galleryPhotos = [
    ...extraPhotos,
    ...fallbackPhotos.slice(extraPhotos.length),
  ].slice(0, 4)

  return (
    <div className="bg-haven-cream min-h-screen pb-32">
      {/* Back */}
      <div className="container-haven pt-6 mb-4">
        <Link href="/search" className="inline-flex items-center gap-2 text-sm font-medium text-haven-gray hover:text-haven-teal transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>
      </div>

      {/* Photo gallery */}
      <div className="container-haven mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-3xl overflow-hidden">
          <div className="relative aspect-[4/3] md:aspect-auto">
            <Image
              src={mainPhoto}
              alt={listing.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {galleryPhotos.map((src, i) => (
              <div key={i} className="relative aspect-square">
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-haven">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: listing info */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title + badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {listingForPanel.isNew && <Badge variant="new">New</Badge>}
                {listing.isPaid ? (
                  <Badge variant="paid">💸 Paid sit{listing.price ? ` — $${listing.price}/night` : ''}</Badge>
                ) : (
                  <Badge variant="free">🌿 Free exchange</Badge>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-haven-navy mb-3">
                {listing.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-haven-gray text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-haven-teal" />
                  {listing.city}{listing.state ? `, ${listing.state}` : ''}, {listing.country}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-haven-teal" />
                  {formatDateRange(startDate, endDate)} ({duration})
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-haven-teal" />
                  {listing._count.applications} applicant{listing._count.applications !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div>
                <h2 className="font-display text-xl font-bold text-haven-navy mb-3">About this sit</h2>
                <p className="text-haven-gray leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Paid sit escrow notice */}
            {listing.isPaid && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
                <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 mb-1">Secure payment — held in escrow</p>
                  <p className="text-sm text-amber-700">
                    The owner's payment is held securely by Haven until your sit is complete.
                    Funds are released to you within 24 hours of sit completion.
                    Tips can be added by the owner at any time after the sit.
                  </p>
                </div>
              </div>
            )}

            {/* Owner info */}
            <div className="card p-6">
              <h2 className="font-semibold text-haven-navy mb-4">About the home owner</h2>
              <div className="flex items-center gap-4 mb-4">
                <Link href={`/profile/${listing.owner.id}`}>
                  <Avatar
                    src={listing.owner.avatar ?? undefined}
                    firstName={listing.owner.firstName}
                    lastName={listing.owner.lastName}
                    size="xl"
                  />
                </Link>
                <div>
                  <Link href={`/profile/${listing.owner.id}`}>
                    <p className="font-display font-bold text-xl text-haven-navy hover:text-haven-teal transition-colors">
                      {listing.owner.firstName} {listing.owner.lastName}
                    </p>
                  </Link>
                  {listing.owner.tagline && (
                    <p className="text-sm text-haven-gray mt-0.5">{listing.owner.tagline}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {listing.owner.averageRating && (
                      <div className="flex items-center gap-1 text-sm">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className={`h-4 w-4 ${i <= Math.round(listing.owner.averageRating!) ? 'fill-amber-400 text-amber-400' : 'text-haven-sand'}`} />
                        ))}
                        <span className="text-haven-gray ml-1">{listing.owner.averageRating.toFixed(1)} · {listing.owner.totalSits} sits</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {listing.owner.idVerified && <VerifiedChip label="ID Verified" />}
                    {listing.owner.backgroundCheckStatus === 'VERIFIED' && <VerifiedChip label="Background checked" />}
                  </div>
                </div>
              </div>
              {listing.owner.bio && (
                <p className="text-sm text-haven-gray mb-4 leading-relaxed">{listing.owner.bio}</p>
              )}
              <Button variant="secondary" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />}>
                Message {listing.owner.firstName}
              </Button>
            </div>

            {/* Pets */}
            {listing.pets.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-haven-navy mb-4">Meet the pets</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {listing.pets.map((pet, i) => (
                    <div key={i} className="card p-4 text-center">
                      <div className="text-4xl mb-2">{PET_ICONS[pet.type] || '🐾'}</div>
                      <p className="font-semibold text-haven-navy">{pet.name}</p>
                      <p className="text-xs text-haven-gray">{PET_LABELS[pet.type] || 'Pet'}</p>
                      {pet.breed && <p className="text-xs text-haven-gray-light mt-0.5">{pet.breed}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div>
              <h2 className="font-display text-xl font-bold text-haven-navy mb-4">Home amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((a) => (
                  <div
                    key={a.label}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-sm ${
                      a.active ? 'bg-haven-teal-pale text-haven-teal-dark' : 'bg-haven-gray-pale text-haven-gray-light line-through'
                    }`}
                  >
                    {a.icon}
                    {a.label}
                  </div>
                ))}
                {listing.hasAutoLitterBox && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl text-sm bg-haven-teal-pale text-haven-teal-dark">
                    <span>🚽</span>
                    Auto litter box
                  </div>
                )}
                {listing.remoteWorkFriendly && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl text-sm bg-haven-teal-pale text-haven-teal-dark">
                    <span>💻</span>
                    Remote work friendly
                  </div>
                )}
              </div>
            </div>

            {/* Leave a tip section */}
            <div className="bg-haven-teal-pale rounded-2xl p-6 border border-haven-teal/20">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-haven-teal" />
                <h3 className="font-semibold text-haven-teal-dark">Tip your sitter</h3>
              </div>
              <p className="text-sm text-haven-gray">
                After the sit, you can send your sitter a tip directly through Haven as a token of appreciation
                — whether it was a free exchange sit or a paid one.
              </p>
            </div>

            {/* Reviews */}
            {listing.reviews.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-haven-navy mb-4">
                  Reviews for {listing.owner.firstName}
                </h2>
                {listing.reviews.map((review) => (
                  <div key={review.id} className="card-flat rounded-2xl border border-haven-sand/40 p-5 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar
                        src={review.reviewer.avatar ?? undefined}
                        firstName={review.reviewer.firstName}
                        lastName={review.reviewer.lastName}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-semibold text-haven-navy">
                          {review.reviewer.firstName} {review.reviewer.lastName}
                        </p>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-haven-sand'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-haven-gray">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-haven-navy">"{review.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: apply panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ApplicationPanel listing={listingForPanel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
