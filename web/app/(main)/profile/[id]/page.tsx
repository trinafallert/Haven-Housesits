'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, Star, CheckCircle2, MapPin, Calendar, Users,
  Briefcase, Heart, Globe, MessageSquare, Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge, VerifiedChip, MatchScore } from '@/components/ui/badge'
import { PET_ICONS, PET_LABELS, formatDateRange } from '@/lib/utils'

/* ─── Mock profile ─── */
const MOCK_PROFILE = {
  id: 'u1',
  firstName: 'Jordan',
  lastName: 'Rivera',
  avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=70',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&q=70',
  ],
  headline: 'Experienced pet lover & remote worker 🌿',
  introduction:
    "Hi! I'm Jordan — a travel-loving remote worker who adores animals. I've been house sitting for 4 years across 3 countries, caring for everything from cats and dogs to rabbits and chickens. I treat every home like my own and love sending daily photo updates.",
  whyHouseSit:
    "House sitting lets me explore new places while doing something I genuinely love — caring for animals. It's a win-win that lets me travel sustainably and build meaningful connections.",
  location: 'Austin, TX',
  occupation: 'UX Designer (Remote)',
  memberSince: '2022-05-10',
  idVerified: true,
  backgroundCheck: 'VERIFIED',
  rating: 4.97,
  totalReviews: 34,
  totalSits: 34,
  responseRate: 98,
  responseTime: '< 1 hour',
  hasCoSitter: true,
  coSitter: { firstName: 'Alex', lastName: 'R', avatar: null },
  petTypes: ['DOG', 'CAT', 'RABBIT', 'BIRD'],
  petSkills: ['Daily walks', 'Medication admin', 'Puppy care', 'Senior pets', 'Multiple pets'],
  experienceYears: 4,
  aboutExperience: 'Previously cared for 3 rescue dogs and 2 cats for a family in San Diego for 2 weeks. Regular dog walking for 5 neighbours.',
  petsOwned: [
    { type: 'DOG', name: 'Mochi (goldendoodle)', photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=70' },
  ],
  preferences: {
    placeTypes: ['HOUSE', 'APARTMENT', 'COTTAGE'],
    countries: ['US', 'UK', 'AU', 'CA'],
    remoteWorkFriendly: true,
    videoCallComfortable: true,
    inPersonMeeting: false,
  },
  availability: [
    { start: '2026-03-15', end: '2026-04-10' },
    { start: '2026-06-01', end: '2026-06-28' },
  ],
  socialProfiles: {
    airbnb: 'jordan_rivera',
    linkedin: 'jordan-rivera-design',
  },
  references: [
    { name: 'Sandra D.', text: 'Jordan was incredible — Cleo was so well looked after. Daily photo updates, spotless home. 10/10!', status: 'CONFIRMED' },
    { name: 'Jake M.', text: 'Super reliable and communicative. Would absolutely have Jordan again.', status: 'CONFIRMED' },
  ],
  reviews: [
    {
      id: 'r1',
      owner: { firstName: 'Sandra', lastName: 'D', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      listing: { city: 'Redondo Beach', state: 'CA' },
      rating: 5,
      text: 'Jordan was a fantastic sitter. Cleo was so well cared for — daily photos and updates. The home was left spotless.',
      createdAt: '2026-02-23T00:00:00Z',
    },
    {
      id: 'r2',
      owner: { firstName: 'Jake', lastName: 'M', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      listing: { city: 'San Francisco', state: 'CA' },
      rating: 5,
      text: 'Incredibly reliable and communicative. Luna was in great hands. Would book again in a heartbeat.',
      createdAt: '2026-01-05T00:00:00Z',
    },
  ],
}

export default function ProfilePage() {
  const profile = MOCK_PROFILE

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
              <Avatar src={profile.avatar} fallback={`${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`} size="xl" />
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
                <MatchScore score={97} />
              </div>
              <p className="text-haven-gray text-sm mt-0.5">{profile.headline}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <MapPin className="h-3.5 w-3.5 text-haven-gray-light" />
                <span className="text-xs text-haven-gray">{profile.location}</span>
                <span className="text-haven-sand mx-1">·</span>
                <Briefcase className="h-3.5 w-3.5 text-haven-gray-light" />
                <span className="text-xs text-haven-gray">{profile.occupation}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button className="p-2 rounded-full hover:bg-haven-gray-pale transition-colors">
                <Share2 className="h-4 w-4 text-haven-gray" />
              </button>
            </div>
          </div>

          {/* Rating row */}
          <div className="flex items-center gap-4 py-3 border-y border-haven-sand/30 mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-haven-navy">{profile.rating}</span>
              <span className="text-xs text-haven-gray">({profile.totalReviews} reviews)</span>
            </div>
            <div className="w-px h-4 bg-haven-sand" />
            <div className="text-sm">
              <span className="font-bold text-haven-navy">{profile.totalSits}</span>
              <span className="text-haven-gray text-xs"> sits completed</span>
            </div>
            <div className="w-px h-4 bg-haven-sand" />
            <div className="text-sm">
              <span className="font-bold text-haven-navy">{profile.responseRate}%</span>
              <span className="text-haven-gray text-xs"> response</span>
            </div>
          </div>

          {/* Verified chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.idVerified && <VerifiedChip>ID Verified</VerifiedChip>}
            {profile.backgroundCheck === 'VERIFIED' && <VerifiedChip>Background Check</VerifiedChip>}
            {profile.hasCoSitter && (
              <VerifiedChip>
                <Users className="h-3 w-3" /> Duo sitter
              </VerifiedChip>
            )}
            {profile.socialProfiles.airbnb && <VerifiedChip>Airbnb ✓</VerifiedChip>}
            {profile.socialProfiles.linkedin && <VerifiedChip>LinkedIn ✓</VerifiedChip>}
          </div>

          {/* CTA */}
          <Button className="w-full" leftIcon={<MessageSquare className="h-4 w-4" />}>
            Message {profile.firstName}
          </Button>
        </div>

        {/* Photos */}
        {profile.photos.length > 0 && (
          <div className="card p-5 mb-5">
            <h2 className="font-display text-lg font-bold text-haven-navy mb-3">Photos</h2>
            <div className="grid grid-cols-3 gap-2">
              {profile.photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-haven-sand/20">
                  <Image src={photo} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About */}
        <div className="card p-5 mb-5">
          <h2 className="font-display text-lg font-bold text-haven-navy mb-3">About {profile.firstName}</h2>
          <p className="text-haven-gray text-sm leading-relaxed mb-4">{profile.introduction}</p>
          <h3 className="font-semibold text-haven-navy text-sm mb-1.5">Why I love house sitting</h3>
          <p className="text-haven-gray text-sm leading-relaxed">{profile.whyHouseSit}</p>
        </div>

        {/* Experience */}
        <div className="card p-5 mb-5">
          <h2 className="font-display text-lg font-bold text-haven-navy mb-3">Experience</h2>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-haven-teal">{profile.experienceYears}</span>
            <span className="text-haven-gray text-sm">years of pet care experience</span>
          </div>
          <p className="text-haven-gray text-sm leading-relaxed mb-4">{profile.aboutExperience}</p>

          <h3 className="font-semibold text-haven-navy text-sm mb-2">Pets I'm comfortable with</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.petTypes.map((type) => (
              <span key={type} className="badge-teal">
                {PET_ICONS[type]} {PET_LABELS[type]}
              </span>
            ))}
          </div>

          <h3 className="font-semibold text-haven-navy text-sm mb-2">Pet care skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.petSkills.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full border border-haven-sand text-xs text-haven-gray font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* My pets */}
        {profile.petsOwned.length > 0 && (
          <div className="card p-5 mb-5">
            <h2 className="font-display text-lg font-bold text-haven-navy mb-3">My own pets</h2>
            {profile.petsOwned.map((pet, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-haven-sand/20 flex-shrink-0">
                  {pet.photo ? (
                    <Image src={pet.photo} alt={pet.name} fill className="object-cover" />
                  ) : (
                    <span className="text-2xl flex items-center justify-center h-full">{PET_ICONS[pet.type]}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-haven-navy text-sm">{pet.name}</p>
                  <p className="text-xs text-haven-gray">{PET_LABELS[pet.type]}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Co-sitter */}
        {profile.hasCoSitter && profile.coSitter && (
          <div className="card p-5 mb-5">
            <h2 className="font-display text-lg font-bold text-haven-navy mb-3">
              <span className="flex items-center gap-2"><Users className="h-5 w-5 text-haven-teal" /> Duo sitting team</span>
            </h2>
            <div className="flex items-center gap-3">
              <Avatar
                src={profile.coSitter.avatar}
                fallback={`${profile.coSitter.firstName.charAt(0)}${profile.coSitter.lastName.charAt(0)}`}
                size="md"
              />
              <div>
                <p className="font-semibold text-haven-navy">
                  {profile.coSitter.firstName} {profile.coSitter.lastName}
                </p>
                <VerifiedChip className="mt-1">Background Check ✓</VerifiedChip>
              </div>
            </div>
          </div>
        )}

        {/* Availability */}
        {profile.availability.length > 0 && (
          <div className="card p-5 mb-5">
            <h2 className="font-display text-lg font-bold text-haven-navy mb-3">
              <span className="flex items-center gap-2"><Calendar className="h-5 w-5 text-haven-teal" /> Availability</span>
            </h2>
            <div className="space-y-2">
              {profile.availability.map((range, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-haven-teal flex-shrink-0" />
                  <span className="text-haven-navy font-medium">{formatDateRange(range.start, range.end)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {profile.references.length > 0 && (
          <div className="card p-5 mb-5">
            <h2 className="font-display text-lg font-bold text-haven-navy mb-3">References</h2>
            <div className="space-y-4">
              {profile.references.map((ref, i) => (
                <div key={i} className="bg-haven-cream-dark rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-haven-navy">{ref.name}</span>
                    <span className="text-xs text-emerald-600 font-medium">{ref.status}</span>
                  </div>
                  <p className="text-sm text-haven-gray italic">"{ref.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {profile.reviews.length > 0 && (
          <div className="card p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-haven-navy">Reviews</h2>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-haven-navy">{profile.rating}</span>
                <span className="text-xs text-haven-gray">({profile.totalReviews})</span>
              </div>
            </div>
            <div className="space-y-4">
              {profile.reviews.map((review) => (
                <div key={review.id} className="border-b border-haven-sand/30 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar
                      src={review.owner.avatar}
                      fallback={`${review.owner.firstName.charAt(0)}${review.owner.lastName.charAt(0)}`}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-semibold text-haven-navy">
                        {review.owner.firstName} {review.owner.lastName}
                      </p>
                      <p className="text-xs text-haven-gray">{review.listing.city}, {review.listing.state}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-haven-sand'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-haven-gray leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
