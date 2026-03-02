import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin, Calendar, Star, Shield, CheckCircle2,
  Users, Wifi, Car, Heart, ArrowLeft, MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge, VerifiedChip, MatchScore } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { MOCK_LISTINGS } from '@/lib/mock-data'
import { formatDateRange, sitDuration, PET_ICONS, PET_LABELS } from '@/lib/utils'
import { ApplicationPanel } from '@/components/listings/application-panel'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = MOCK_LISTINGS.find((l) => l.id === params.id)
  if (!listing) return {}
  return {
    title: `${listing.title} — Haven Housesits`,
    description: `House sit in ${listing.city}, ${listing.country}. ${formatDateRange(listing.startDate, listing.endDate)}.`,
  }
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = MOCK_LISTINGS.find((l) => l.id === params.id)
  if (!listing) notFound()

  const duration = sitDuration(listing.startDate, listing.endDate)

  const amenities = [
    { icon: <Wifi className="h-4 w-4" />,    label: 'High-speed WiFi',     active: true },
    { icon: <Car  className="h-4 w-4" />,    label: 'Car included',         active: false },
    { icon: <Users className="h-4 w-4" />,   label: 'Family friendly',      active: true },
    { icon: <Shield className="h-4 w-4" />,  label: 'Accessible',           active: false },
  ]

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
              src={listing.photos[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80'}
              alt={listing.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70',
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70',
              'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=70',
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=70',
            ].map((src, i) => (
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
                {listing.isNew && <Badge variant="new">New</Badge>}
                {listing.isPaid ? (
                  <Badge variant="paid">💸 Paid sit — ${listing.price}/night</Badge>
                ) : (
                  <Badge variant="free">🌿 Free exchange</Badge>
                )}
                {listing.matchScore && <MatchScore score={listing.matchScore} />}
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
                  {formatDateRange(listing.startDate, listing.endDate)} ({duration})
                </span>
              </div>
            </div>

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
                <Avatar
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  firstName={listing.owner.firstName}
                  lastName={listing.owner.lastName}
                  size="xl"
                />
                <div>
                  <p className="font-display font-bold text-xl text-haven-navy">
                    {listing.owner.firstName} {listing.owner.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {listing.owner.averageRating && (
                      <div className="flex items-center gap-1 text-sm">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className={`h-4 w-4 ${i <= Math.round(listing.owner.averageRating!) ? 'fill-amber-400 text-amber-400' : 'text-haven-sand'}`} />
                        ))}
                        <span className="text-haven-gray ml-1">{listing.owner.averageRating} · {listing.owner.totalSits} sits</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <VerifiedChip label="ID Verified" />
                    <VerifiedChip label="Background checked" />
                  </div>
                </div>
              </div>
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
                <div className="flex items-center gap-2.5 p-3 rounded-xl text-sm bg-haven-teal-pale text-haven-teal-dark">
                  <span>🚽</span>
                  Auto litter box
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <h2 className="font-display text-xl font-bold text-haven-navy mb-4">Sitter responsibilities</h2>
              <div className="card-flat rounded-2xl p-5 border border-haven-sand/40 space-y-3">
                {[
                  '🐾  Walk dogs 2x daily (morning and evening)',
                  '🍽️  Feed pets twice a day',
                  '🪴  Water indoor plants weekly',
                  '📬  Collect mail and packages',
                  '🧹  Leave home clean and tidy',
                ].map((item) => (
                  <p key={item} className="text-sm text-haven-navy">{item}</p>
                ))}
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
            <div>
              <h2 className="font-display text-xl font-bold text-haven-navy mb-4">
                Reviews for {listing.owner.firstName}
              </h2>
              {[
                { name: 'Emma S.', rating: 5, text: 'Wonderful host! Clear instructions, beautiful home.', date: '2 months ago' },
                { name: 'Marco R.', rating: 5, text: 'Dogs were so sweet. The home is even nicer than the photos.', date: '4 months ago' },
              ].map((review) => (
                <div key={review.name} className="card-flat rounded-2xl border border-haven-sand/40 p-5 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className={`h-4 w-4 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-haven-sand'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-haven-navy mb-2">"{review.text}"</p>
                  <div className="flex items-center justify-between text-xs text-haven-gray">
                    <span>{review.name}</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: apply panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ApplicationPanel listing={listing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
