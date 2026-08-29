import { Redirect } from 'expo-router'
import { useAuthStore } from '../src/store/auth'

export default function Index() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  if (isLoggedIn) return <Redirect href="/(tabs)/search" />
  return <Redirect href="/(auth)/welcome" />
}
