'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Send, Image as ImageIcon, Phone, Video, MoreVertical, CheckCircle2, Clock, XCircle, Star } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { formatRelative } from '@/lib/utils'

/* ─── Mock data ─── */
const MOCK_THREAD = {
  id: 'c2',
  participant: {
    id: 'u2',
    firstName: 'Michael',
    lastName: 'K',
    avatar: null,
    rating: 4.9,
    totalReviews: 12,
    idVerified: true,
  },
  listing: {
    id: '1',
    title: 'Two golden retrievers in Lexington',
    photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=70',
    city: 'Lexington',
    state: 'KY',
    startDate: '2026-03-10',
    endDate: '2026-04-12',
  },
  applicationStatus: 'PENDING',
  messages: [
    {
      id: 'm1',
      type: 'SYSTEM',
      text: '🐕 Application sent — 10 Mar – 12 Apr',
      createdAt: '2026-02-28T10:00:00Z',
    },
    {
      id: 'm2',
      type: 'RECEIVED',
      text: 'Hi! Thanks so much for applying. I loved reading your profile — you seem like a wonderful fit for Buddy!',
      createdAt: '2026-03-01T09:15:00Z',
    },
    {
      id: 'm3',
      type: 'SENT',
      text: 'Thank you Michael! Buddy looks absolutely adorable. I have 3 years of experience with golden retrievers and would love to care for him.',
      createdAt: '2026-03-01T09:22:00Z',
    },
    {
      id: 'm4',
      type: 'RECEIVED',
      text: "That's great to hear! Would you be available for a quick video call this week to meet Buddy virtually?",
      createdAt: '2026-03-01T09:30:00Z',
    },
    {
      id: 'm5',
      type: 'SYSTEM',
      text: '📞 Video call scheduled — Thu Mar 5, 7pm EST',
      createdAt: '2026-03-01T10:00:00Z',
    },
  ],
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PENDING:   { label: 'Application pending',  icon: <Clock className="h-3.5 w-3.5" />,        color: 'text-haven-gray' },
  ACCEPTED:  { label: 'Sit confirmed!',        icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'text-emerald-600' },
  DECLINED:  { label: 'Application declined',  icon: <XCircle className="h-3.5 w-3.5" />,       color: 'text-red-500' },
  COMPLETED: { label: 'Sit completed',         icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'text-haven-teal' },
}

export default function MessageThreadPage() {
  const params = useParams()
  const thread = MOCK_THREAD // In real app: fetch by params.id
  const sc     = STATUS_CONFIG[thread.applicationStatus]

  const [messages, setMessages] = useState(thread.messages)
  const [input, setInput]       = useState('')
  const bottomRef               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        type: 'SENT',
        text,
        createdAt: new Date().toISOString(),
      },
    ])
    setInput('')
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-haven-cream">

      {/* ─── Top bar ─── */}
      <header className="bg-white border-b border-haven-sand/30 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <Link href="/inbox" className="p-1.5 -ml-1.5 rounded-full hover:bg-haven-gray-pale transition-colors">
          <ArrowLeft className="h-5 w-5 text-haven-navy" />
        </Link>

        {/* Avatar */}
        <Avatar
          src={thread.participant.avatar}
          fallback={`${thread.participant.firstName.charAt(0)}${thread.participant.lastName.charAt(0)}`}
          size="sm"
        />

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-haven-navy text-sm">
              {thread.participant.firstName} {thread.participant.lastName}
            </span>
            {thread.participant.idVerified && (
              <span className="text-[10px] bg-haven-teal-pale text-haven-teal-dark px-1.5 py-0.5 rounded-full font-semibold">ID ✓</span>
            )}
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${sc.color}`}>
            {sc.icon}
            <span>{sc.label}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-haven-gray-pale transition-colors">
            <Phone className="h-4 w-4 text-haven-navy" />
          </button>
          <button className="p-2 rounded-full hover:bg-haven-gray-pale transition-colors">
            <Video className="h-4 w-4 text-haven-navy" />
          </button>
          <button className="p-2 rounded-full hover:bg-haven-gray-pale transition-colors">
            <MoreVertical className="h-4 w-4 text-haven-navy" />
          </button>
        </div>
      </header>

      {/* ─── Listing card banner ─── */}
      <Link href={`/listings/${thread.listing.id}`}>
        <div className="bg-white border-b border-haven-sand/30 px-4 py-2.5 flex items-center gap-3 hover:bg-haven-gray-pale/30 transition-colors">
          <div className="relative h-10 w-14 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={thread.listing.photo} alt="" fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-haven-navy truncate">{thread.listing.title}</p>
            <p className="text-xs text-haven-gray">
              {thread.listing.city}, {thread.listing.state} · View listing →
            </p>
          </div>
        </div>
      </Link>

      {/* ─── Message list ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          if (msg.type === 'SYSTEM') {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="msg-system-pill">{msg.text}</span>
              </div>
            )
          }

          const isSent = msg.type === 'SENT'
          return (
            <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {!isSent && (
                <Avatar
                  src={thread.participant.avatar}
                  fallback={thread.participant.firstName.charAt(0)}
                  size="xs"
                  className="flex-shrink-0 mb-0.5"
                />
              )}
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div className={isSent ? 'msg-bubble-sent' : 'msg-bubble-received'}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <p className={`text-[10px] text-haven-gray-light ${isSent ? 'text-right' : 'text-left'} px-1`}>
                  {formatRelative(msg.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* ─── Composer ─── */}
      <div className="bg-white border-t border-haven-sand/30 px-4 py-3 flex items-end gap-3 flex-shrink-0">
        <button className="p-2 rounded-full hover:bg-haven-gray-pale transition-colors flex-shrink-0">
          <ImageIcon className="h-5 w-5 text-haven-gray" />
        </button>

        <div className="flex-1 relative">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message ${thread.participant.firstName}…`}
            className="input resize-none text-sm py-2.5 max-h-32 overflow-y-auto"
            style={{ lineHeight: '1.4' }}
          />
        </div>

        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="h-10 w-10 rounded-full bg-haven-teal flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-haven-teal-dark transition-colors"
        >
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  )
}
