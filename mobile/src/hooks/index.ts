/**
 * Haven Housesits — React Query hooks for all API calls
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  auth, listings, applications, messages, profile, tips, reviews,
  saved, notifications,
  setStoredUser,
} from '../api/client'
import { useAuthStore } from '../store/auth'

// ─── Auth hooks ───────────────────────────────────────────────────────────────

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser)
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      auth.login(email, password),
    onSuccess: async (data) => {
      setUser(data.user)
      await setStoredUser(data.user)
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (params: {
      firstName: string
      lastName: string
      email: string
      password: string
      role: 'SITTER' | 'OWNER' | 'BOTH'
    }) => auth.register(params),
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => auth.logout(),
    onSuccess: () => {
      qc.clear()
      logout()
    },
  })
}

// ─── Listing hooks ────────────────────────────────────────────────────────────

export function useListings(params?: {
  sitType?: string
  petType?: string
  country?: string
  startDate?: string
  endDate?: string
  page?: number
}) {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: () => listings.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => listings.get(id),
    enabled: !!id,
  })
}

export function useCreateListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: listings.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listings'] }),
  })
}

// ─── Application hooks ────────────────────────────────────────────────────────

export function useApplications(role: 'sitter' | 'owner' = 'sitter', status?: string) {
  return useQuery({
    queryKey: ['applications', role, status],
    queryFn: () => applications.list(role, status),
  })
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applications.get(id),
    enabled: !!id,
  })
}

export function useApply() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ listingId, message }: { listingId: string; message: string }) =>
      applications.apply(listingId, message),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACCEPTED' | 'DECLINED' }) =>
      applications.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

// ─── Message hooks ────────────────────────────────────────────────────────────

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messages.getConversations(),
    refetchInterval: 15_000, // poll every 15s
  })
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messages.getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 5_000, // poll every 5s for new messages
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ conversationId, text }: { conversationId: string; text: string }) =>
      messages.send(conversationId, text),
    onSuccess: (_, { conversationId }) => {
      qc.invalidateQueries({ queryKey: ['messages', conversationId] })
      qc.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

// ─── Profile hooks ────────────────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profile.get(),
  })
}

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profile.getPublic(userId),
    enabled: !!userId,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  return useMutation({
    mutationFn: profile.update,
    onSuccess: async (data) => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      // Update auth store with new name/avatar
      const u = useAuthStore.getState().user
      if (u && data.profile) {
        const updated = {
          ...u,
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          avatar: data.profile.avatar,
          tagline: data.profile.tagline,
        }
        setUser(updated)
        await setStoredUser(updated)
      }
    },
  })
}

// ─── Tips hooks ───────────────────────────────────────────────────────────────

export function useSendTip() {
  return useMutation({
    mutationFn: tips.send,
  })
}

// ─── Review hooks ─────────────────────────────────────────────────────────────

export function useReviews(userId?: string) {
  return useQuery({
    queryKey: ['reviews', userId],
    queryFn: () => reviews.list(userId),
    enabled: !!userId,
  })
}

export function useCreateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: reviews.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  })
}

// ─── Saved hooks ──────────────────────────────────────────────────────────────

export function useSavedListings() {
  return useQuery({
    queryKey: ['saved'],
    queryFn: () => saved.list(),
  })
}

export function useToggleSave() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (listingId: string) => saved.toggle(listingId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved'] }),
  })
}

export function useIsSaved(listingId: string) {
  return useQuery({
    queryKey: ['saved', listingId],
    queryFn: () => saved.check(listingId),
    enabled: !!listingId,
  })
}

// ─── Notification hooks ───────────────────────────────────────────────────────

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notifications.list(),
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notifications.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => notifications.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
