'use client'

import Link from 'next/link'
import {
  User, Camera, FileText, Award, Heart, Shield, Calendar,
  Settings, ChevronRight, Star, CheckCircle2, Clock, Users
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { VerifiedChip } from '@/components/ui/badge'

const SECTIONS = [
  {
    group: 'Your profile',
    items: [
      { href: '/profile/edit/details',      icon: User,         label: 'Profile details',       desc: 'Name, birthday, gender, occupation' },
      { href: '/profile/edit/photos',       icon: Camera,       label: 'Profile photos',        desc: 'Profile photo + gallery' },
      { href: '/profile/edit/introduction', icon: FileText,     label: 'About you',             desc: 'Introduction, headline, why you sit' },
      { href: '/profile/edit/social',       icon: Globe,        label: 'Social profiles',       desc: 'Airbnb, LinkedIn' },
    ],
  },
  {
    group: 'Experience & pets',
    items: [
      { href: '/profile/edit/experience',   icon: Award,        label: 'Experience',            desc: 'Years, story, prior sits' },
      { href: '/profile/edit/pet-types',    icon: Heart,        label: 'Pets I care for',       desc: 'Animal types + care skills' },
      { href: '/profile/edit/my-pets',      icon: PawPrint,     label: 'My own pets',           desc: 'Introduce your animals' },
      { href: '/profile/edit/references',   icon: Star,         label: 'References',            desc: 'Up to 4 personal references' },
    ],
  },
  {
    group: 'Trust & safety',
    items: [
      { href: '/profile/edit/verification', icon: CheckCircle2, label: 'Verification',          desc: 'ID check & background check' },
      { href: '/profile/edit/cositter',     icon: Users,        label: 'Co-sitter setup',       desc: 'Add a duo sitter partner' },
      { href: '/profile/edit/emergency',    icon: Shield,       label: 'Emergency contact',     desc: 'Safety & security info' },
    ],
  },
  {
    group: 'Preferences & availability',
    items: [
      { href: '/profile/edit/preferences',  icon: Settings,     label: 'Sitting preferences',  desc: 'Home types, countries, animals' },
      { href: '/profile/edit/availability', icon: Calendar,     label: 'Availability',          desc: 'Add available date ranges' },
    ],
  },
]

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

function PawPrint(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/>
      <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
    </svg>
  )
}

export default function ProfileEditHubPage() {
  return (
    <div className="bg-haven-cream min-h-screen">
      <div className="container-haven max-w-2xl py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-haven-navy">Edit Profile</h1>
          <Link href="/profile/me" className="text-sm text-haven-teal font-semibold hover:text-haven-teal-dark transition-colors">
            Preview →
          </Link>
        </div>

        {/* Profile completeness */}
        <div className="card p-5 mb-6">
          <div className="flex items-center gap-4">
            <Avatar
              src="https://randomuser.me/api/portraits/women/68.jpg"
              fallback="JR"
              size="lg"
            />
            <div className="flex-1">
              <p className="font-semibold text-haven-navy">Jordan Rivera</p>
              <div className="flex items-center gap-2 mt-1">
                <VerifiedChip>ID Verified</VerifiedChip>
                <VerifiedChip>Background ✓</VerifiedChip>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-haven-gray mb-1">
                  <span>Profile completeness</span>
                  <span className="font-semibold text-haven-teal">82%</span>
                </div>
                <div className="h-2 bg-haven-sand/50 rounded-full overflow-hidden">
                  <div className="h-full bg-haven-teal rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <div key={section.group} className="mb-6">
            <h2 className="text-xs font-bold text-haven-gray uppercase tracking-wider mb-2 px-1">
              {section.group}
            </h2>
            <div className="card overflow-hidden divide-y divide-haven-sand/30">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <div className="flex items-center gap-4 p-4 hover:bg-haven-gray-pale/50 transition-colors">
                      <div className="h-9 w-9 rounded-xl bg-haven-teal-pale flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4.5 w-4.5 text-haven-teal" style={{ width: 18, height: 18 }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-haven-navy text-sm">{item.label}</p>
                        <p className="text-xs text-haven-gray truncate">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-haven-gray-light flex-shrink-0" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}
