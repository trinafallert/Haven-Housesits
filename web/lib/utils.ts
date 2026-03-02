import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isAfter, isBefore, differenceInDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date helpers ───────────────────────────────────────────────────────────

export function formatDateRange(start: Date | string, end: Date | string): string {
  const s = new Date(start)
  const e = new Date(end)
  if (s.getFullYear() === e.getFullYear()) {
    return `${format(s, 'd MMM')} – ${format(e, 'd MMM yyyy')}`
  }
  return `${format(s, 'd MMM yyyy')} – ${format(e, 'd MMM yyyy')}`
}

export function formatShortDate(date: Date | string): string {
  return format(new Date(date), 'd MMM yy')
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function sitDuration(start: Date | string, end: Date | string): string {
  const days = differenceInDays(new Date(end), new Date(start))
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''}`
  const weeks = Math.floor(days / 7)
  const rem = days % 7
  if (rem === 0) return `${weeks} week${weeks !== 1 ? 's' : ''}`
  return `${weeks}w ${rem}d`
}

export function isUpcoming(date: Date | string): boolean {
  return isAfter(new Date(date), new Date())
}

export function isPast(date: Date | string): boolean {
  return isBefore(new Date(date), new Date())
}

// ─── Currency helpers ────────────────────────────────────────────────────────

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ─── String helpers ──────────────────────────────────────────────────────────

export function initials(firstName: string, lastName?: string): string {
  const last = lastName || ''
  return `${firstName.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return `${str.slice(0, length)}...`
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural ?? singular + 's'}`
}

// ─── Sit Match Score (Haven exclusive) ──────────────────────────────────────
// Calculates a compatibility % between a sitter and a listing

interface SitterProfile {
  petTypes: string[]
  preferredCountries: string[]
  hasCoSitter: boolean
  idVerified: boolean
  backgroundCheckStatus: string
  totalSits: number
  averageRating: number | null
}

interface ListingBasic {
  pets: { type: string }[]
  country: string
  isFamilyFriendly: boolean
}

export function calcSitMatchScore(sitter: SitterProfile, listing: ListingBasic): number {
  let score = 40 // base

  // Pet compatibility
  const listingPetTypes = listing.pets.map((p) => p.type)
  const matchedPets = listingPetTypes.filter((pt) => sitter.petTypes.includes(pt))
  if (listingPetTypes.length === 0) score += 20
  else score += Math.round((matchedPets.length / listingPetTypes.length) * 20)

  // Location preference
  if (sitter.preferredCountries.includes(listing.country)) score += 10

  // Trust signals
  if (sitter.idVerified) score += 10
  if (sitter.backgroundCheckStatus === 'VERIFIED') score += 10

  // Experience
  if (sitter.totalSits >= 5) score += 5
  if (sitter.totalSits >= 10) score += 3
  if ((sitter.averageRating ?? 0) >= 4.5) score += 5

  // Co-sitter bonus for family-friendly
  if (listing.isFamilyFriendly && sitter.hasCoSitter) score += 5

  return Math.min(score, 100)
}

// ─── Slug helpers ────────────────────────────────────────────────────────────

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ─── Array helpers ───────────────────────────────────────────────────────────

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = String(item[key])
      if (!acc[k]) acc[k] = []
      acc[k].push(item)
      return acc
    },
    {} as Record<string, T[]>
  )
}

// ─── URL helpers ─────────────────────────────────────────────────────────────

export function buildSearchUrl(params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '' && v !== false) {
      sp.set(k, String(v))
    }
  }
  return `/search?${sp.toString()}`
}

// ─── Pet type display ────────────────────────────────────────────────────────

export const PET_LABELS: Record<string, string> = {
  DOG: 'Dogs',
  PUPPY: 'Puppies',
  SENIOR_DOG: 'Senior dogs',
  CAT: 'Cats',
  KITTEN: 'Kittens',
  SENIOR_CAT: 'Senior cats',
  BIRD: 'Birds',
  FISH: 'Fish',
  REPTILE: 'Reptiles',
  SMALL_PET: 'Small pets',
  RABBIT: 'Rabbits',
  POULTRY: 'Poultry',
  LIVESTOCK: 'Livestock',
  OTHER: 'Other pets',
}

export const PET_ICONS: Record<string, string> = {
  DOG: '🐕',
  PUPPY: '🐶',
  SENIOR_DOG: '🐕',
  CAT: '🐈',
  KITTEN: '🐱',
  SENIOR_CAT: '🐈',
  BIRD: '🦜',
  FISH: '🐠',
  REPTILE: '🦎',
  SMALL_PET: '🐹',
  RABBIT: '🐰',
  POULTRY: '🐓',
  LIVESTOCK: '🐑',
  OTHER: '🐾',
}

export const SIT_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  FREE:      { label: 'Exchange Sit',  color: 'badge-free' },
  PAID:      { label: 'Paid Sit',      color: 'badge-paid' },
  VACANT:    { label: 'Vacant Sit',    color: 'badge-teal' },
  LONG_TERM: { label: 'Long-term',     color: 'badge-new' },
  PET_ONLY:  { label: 'Pet-only Sit',  color: 'badge-teal' },
}
