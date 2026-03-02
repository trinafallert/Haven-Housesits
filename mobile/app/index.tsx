import { Redirect } from 'expo-router'

// Redirect to welcome screen by default
// In production: check auth state and redirect to (tabs) if logged in
export default function Index() {
  return <Redirect href="/(auth)/welcome" />
}
