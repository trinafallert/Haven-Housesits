/**
 * Haven Housesits — Mobile API Client
 * Base URL: https://havensits.com/api (override with EXPO_PUBLIC_API_URL)
 * Auth: JWT stored in expo-secure-store, sent as Authorization: Bearer <token>
 */

import * as SecureStore from 'expo-secure-store'

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://havensits.com/api'
const TOKEN_KEY = 'haven_auth_token'
const USER_KEY  = 'haven_auth_user'

// ─── Token management ─────────────────────────────────────────────────────────

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
  await SecureStore.deleteItemAsync(USER_KEY)
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await SecureStore.getItemAsync(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export async function setStoredUser(user: User): Promise<void> {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user))
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'SITTER' | 'OWNER' | 'BOTH'
  plan: string
  isStudent: boolean
  avatar?: string | null
  tagline?: string | null
  averageRating?: number | null
  totalSits?: number
  totalReviews?: number
}

export interface Listing {
  id: string
  title: string
  description?: string
  sitType: string
  homeType?: string
  city: string
  state: string
  country?: string
  startDate: string
  endDate: string
  dailyRate?: number
  bedrooms?: number
  bathrooms?: number
  hasWifi?: boolean
  hasPool?: boolean
  hasParking?: boolean
  isBoosted?: boolean
  isFamilyFriendly?: boolean
  latitude?: number
  longitude?: number
  photos?: string[]
  owner: {
    id: string
    firstName: string
    lastName: string
    avatar?: string | null
    averageRating?: number | null
    totalSits?: number
    totalReviews?: number
    headline?: string | null
    idVerified?: boolean
    backgroundCheck?: boolean
  }
  pets?: Array<{ type: string; name: string; breed?: string; age?: string }>
  _count?: { applications: number }
  maxApplications?: number
  status?: string
}

export interface Application {
  id: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED'
  message: string
  createdAt: string
  listing: {
    id: string
    title: string
    city: string
    state: string
    startDate: string
    endDate: string
    photos?: string[]
    pets?: Array<{ type: string; name: string }>
    ownerId?: string
  }
  sitter: {
    id: string
    firstName: string
    lastName: string
    avatar?: string | null
    averageRating?: number | null
  }
  conversationId?: string
}

export interface Conversation {
  id: string
  otherUser: {
    id: string
    firstName: string
    lastName: string
    avatar?: string | null
  } | null
  lastMessage: {
    id: string
    text: string
    createdAt: string
    sender: { id: string; firstName: string }
  } | null
  unreadCount: number
  listingTitle: string
  listingId: string
  applicationId: string
  updatedAt: string
}

export interface Message {
  id: string
  text: string
  imageUrl?: string | null
  createdAt: string
  senderId: string
  sender: {
    id: string
    firstName: string
    avatar?: string | null
  }
}

export interface Profile {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string | null
  tagline?: string | null
  bio?: string | null
  role: string
  membershipPlan: string
  idVerified?: boolean
  backgroundCheckStatus?: string
  averageRating?: number | null
  totalSits?: number
  totalReviews?: number
  city?: string | null
  state?: string | null
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    let errorData: any = {}
    try { errorData = await res.json() } catch {}
    throw new ApiError(
      res.status,
      errorData?.error ?? `Request failed with status ${res.status}`,
      errorData
    )
  }

  return res.json() as Promise<T>
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const auth = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const data = await request<{ token: string; user: User }>('/auth/mobile-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    await setToken(data.token)
    await setStoredUser(data.user)
    return data
  },

  async register(params: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: 'SITTER' | 'OWNER' | 'BOTH'
  }): Promise<{ success: boolean; user: any }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  async logout(): Promise<void> {
    await removeToken()
  },
}

// ─── Listings ─────────────────────────────────────────────────────────────────

export const listings = {
  async list(params?: {
    page?: number
    limit?: number
    sitType?: string
    petType?: string
    country?: string
    startDate?: string
    endDate?: string
    search?: string
    minDays?: number
  }): Promise<{ listings: Listing[]; pagination: any }> {
    const qs = new URLSearchParams()
    if (params?.page)      qs.set('page', String(params.page))
    if (params?.limit)     qs.set('limit', String(params.limit))
    if (params?.sitType && params.sitType !== 'ALL') qs.set('sitType', params.sitType)
    if (params?.petType)   qs.set('petType', params.petType)
    if (params?.country)   qs.set('country', params.country)
    if (params?.startDate) qs.set('startDate', params.startDate)
    if (params?.endDate)   qs.set('endDate', params.endDate)
    if (params?.search)    qs.set('search', params.search)
    if (params?.minDays)   qs.set('minDays', String(params.minDays))
    const query = qs.toString() ? `?${qs.toString()}` : ''
    return request(`/listings${query}`)
  },

  async get(id: string): Promise<{ listing: Listing }> {
    return request(`/listings/${id}`)
  },

  async create(data: {
    title: string
    description: string
    sitType: string
    homeType: string
    city: string
    state: string
    country: string
    startDate: string
    endDate: string
    dailyRate?: number
    bedrooms: number
    bathrooms: number
    hasWifi?: boolean
    hasPool?: boolean
    hasParking?: boolean
    hasBackyard?: boolean
    isFamilyFriendly?: boolean
    remoteWorkFriendly?: boolean
    pets?: Array<{ type: string; name: string; breed?: string; age?: string }>
  }): Promise<{ listing: Listing }> {
    return request('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// ─── Applications ─────────────────────────────────────────────────────────────

export const applications = {
  async apply(listingId: string, message: string): Promise<{ application: Application; conversationId: string }> {
    return request('/applications', {
      method: 'POST',
      body: JSON.stringify({ listingId, message }),
    })
  },

  async list(role: 'sitter' | 'owner' = 'sitter', status?: string): Promise<{ applications: Application[] }> {
    const qs = new URLSearchParams({ role })
    if (status) qs.set('status', status)
    return request(`/applications?${qs.toString()}`)
  },

  async get(id: string): Promise<{ application: Application }> {
    return request(`/applications/${id}`)
  },

  async updateStatus(id: string, status: 'ACCEPTED' | 'DECLINED'): Promise<{ application: Application }> {
    return request(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messages = {
  async getConversations(): Promise<{ conversations: Conversation[] }> {
    return request('/conversations')
  },

  async getMessages(conversationId: string): Promise<{ messages: Message[] }> {
    return request(`/messages?conversationId=${conversationId}`)
  },

  async send(conversationId: string, text: string): Promise<{ message: Message }> {
    return request('/messages', {
      method: 'POST',
      body: JSON.stringify({ conversationId, text }),
    })
  },
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profile = {
  async get(): Promise<{ profile: Profile }> {
    return request('/profile')
  },

  async getPublic(userId: string): Promise<{ profile: Profile }> {
    return request(`/profile?userId=${userId}`)
  },

  async update(data: {
    firstName?: string
    lastName?: string
    tagline?: string
    bio?: string
    city?: string
    state?: string
    avatar?: string
  }): Promise<{ profile: Profile }> {
    return request('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
}

// ─── Tips ────────────────────────────────────────────────────────────────────

export const tips = {
  async send(params: {
    applicationId: string
    amount: number
    paymentMethodId: string
    message?: string
  }): Promise<{ success: boolean; amount: number }> {
    return request('/tips', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviews = {
  async list(userId?: string): Promise<{ reviews: any[] }> {
    const qs = userId ? `?userId=${userId}` : ''
    return request(`/reviews${qs}`)
  },

  async create(data: {
    applicationId: string
    rating: number
    communication: number
    accuracy: number
    welcome: number
    pets: number
    comment?: string
  }): Promise<{ review: any }> {
    return request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// ─── Saved listings ───────────────────────────────────────────────────────────
export const saved = {
  async list(): Promise<{ listings: any[] }> {
    return request('/saved')
  },
  async toggle(listingId: string): Promise<{ saved: boolean }> {
    return request('/saved', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    })
  },
  async check(listingId: string): Promise<{ saved: boolean }> {
    return request(`/saved?listingId=${listingId}`)
  },
}

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = {
  async list(): Promise<{ notifications: any[] }> {
    return request('/notifications')
  },
  async markRead(id: string): Promise<{ success: boolean }> {
    return request(`/notifications/${id}/read`, { method: 'POST' })
  },
  async markAllRead(): Promise<{ success: boolean }> {
    return request('/notifications/read-all', { method: 'POST' })
  },
}
