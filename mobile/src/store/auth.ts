import { create } from 'zustand'
import { User, getStoredUser, removeToken } from '../api/client'

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (user) => set({ user, isLoggedIn: !!user }),

  logout: async () => {
    await removeToken()
    set({ user: null, isLoggedIn: false })
  },
}))

// Initialize from secure store on app load
export async function initAuth() {
  const user = await getStoredUser()
  if (user) {
    useAuthStore.getState().setUser(user)
  }
}
