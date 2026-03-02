'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, MessageSquare } from 'lucide-react'
import { formatRelative } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'

const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    participant: {
      id: 'u1',
      firstName: 'Sandra',
      lastName: 'D',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    listing: {
      title: 'Redondo Beach bungalow',
      photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=70',
    },
    lastMessage: 'Thanks so much! The cats really loved you 😊',
    lastMessageAt: '2026-02-23T18:42:00Z',
    unread: 0,
    applicationStatus: 'COMPLETED',
  },
  {
    id: 'c2',
    participant: {
      id: 'u2',
      firstName: 'Michael',
      lastName: 'K',
      avatar: null,
    },
    listing: {
      title: 'Two golden retrievers in Lexington',
      photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=70',
    },
    lastMessage: "Hi! I've reviewed your application and would love to chat.",
    lastMessageAt: '2026-03-01T09:15:00Z',
    unread: 1,
    applicationStatus: 'PENDING',
  },
  {
    id: 'c3',
    participant: {
      id: 'u3',
      firstName: 'Ali',
      lastName: 'B',
      avatar: null,
    },
    listing: {
      title: 'SF apartment with two cats',
      photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=70',
    },
    lastMessage: 'Can you do a video call this week?',
    lastMessageAt: '2026-02-28T14:30:00Z',
    unread: 2,
    applicationStatus: 'PENDING',
  },
  {
    id: 'c4',
    participant: {
      id: 'u4',
      firstName: 'Jake',
      lastName: 'M',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    listing: {
      title: 'San Francisco New Year sit',
      photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=70',
    },
    lastMessage: 'Have a safe trip home! Left a 5-star review ⭐',
    lastMessageAt: '2026-01-05T11:00:00Z',
    unread: 0,
    applicationStatus: 'COMPLETED',
  },
]

const STATUS_PILLS: Record<string, string> = {
  PENDING:   'bg-haven-sand/60 text-haven-gray',
  ACCEPTED:  'bg-emerald-100 text-emerald-700',
  DECLINED:  'bg-red-50 text-red-600',
  COMPLETED: 'bg-haven-teal-pale text-haven-teal-dark',
}
const STATUS_LABELS: Record<string, string> = {
  PENDING:   'Pending',
  ACCEPTED:  'Confirmed',
  DECLINED:  'Declined',
  COMPLETED: 'Completed',
}

export default function InboxPage() {
  const [query, setQuery] = useState('')

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.participant.firstName.toLowerCase().includes(query.toLowerCase()) ||
    c.listing.title.toLowerCase().includes(query.toLowerCase())
  )

  const totalUnread = MOCK_CONVERSATIONS.reduce((n, c) => n + c.unread, 0)

  return (
    <div className="bg-haven-cream min-h-screen">
      <div className="container-haven py-8 max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-haven-navy">Inbox</h1>
            {totalUnread > 0 && (
              <p className="text-sm text-haven-teal font-medium mt-0.5">
                {totalUnread} unread message{totalUnread !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <MessageSquare className="h-6 w-6 text-haven-navy opacity-40" />
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-haven-gray-light" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Conversation list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <MessageSquare className="h-10 w-10 text-haven-sand mx-auto mb-3" />
              <p className="text-haven-gray">No conversations yet.</p>
            </div>
          )}

          {filtered.map((convo) => (
            <Link key={convo.id} href={`/inbox/${convo.id}`} className="block">
              <div className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-card p-4 flex items-center gap-4 ${
                convo.unread > 0 ? 'border-haven-teal/30' : 'border-haven-sand/30'
              }`}>

                {/* Avatar + listing thumb */}
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={convo.participant.avatar}
                    fallback={`${convo.participant.firstName.charAt(0)}${convo.participant.lastName.charAt(0)}`}
                    size="md"
                  />
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg overflow-hidden border-2 border-white">
                    <Image src={convo.listing.photo} alt="" fill className="object-cover" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-semibold text-haven-navy ${convo.unread > 0 ? 'text-haven-navy' : ''}`}>
                      {convo.participant.firstName} {convo.participant.lastName}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_PILLS[convo.applicationStatus]}`}>
                      {STATUS_LABELS[convo.applicationStatus]}
                    </span>
                  </div>
                  <p className="text-xs text-haven-gray truncate mb-0.5">{convo.listing.title}</p>
                  <p className={`text-sm truncate ${convo.unread > 0 ? 'font-medium text-haven-navy' : 'text-haven-gray'}`}>
                    {convo.lastMessage}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-xs text-haven-gray-light">
                    {formatRelative(convo.lastMessageAt)}
                  </span>
                  {convo.unread > 0 && (
                    <span className="h-5 w-5 rounded-full bg-haven-teal text-white text-xs font-bold flex items-center justify-center">
                      {convo.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
