import { useEffect, useState } from 'react'
import { Stack, Redirect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Platform, View, ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore, initAuth } from '../src/store/auth'
import { Colors } from '../constants/colors'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 2 },
  },
})

function AppProviders({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return (
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SafeAreaProvider>
    )
  }
  const { GestureHandlerRootView } = require('react-native-gesture-handler')
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

function RootNavigator() {
  const [ready, setReady] = useState(false)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  useEffect(() => {
    initAuth().finally(() => setReady(true))
    if (Platform.OS !== 'web') {
      const { default: SplashScreen } = require('expo-splash-screen')
      SplashScreen.hideAsync().catch(() => {})
    }
  }, [])

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cream }}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.cream} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="listing/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="inbox/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="owner/applicants" options={{ presentation: 'card' }} />
        <Stack.Screen name="settings" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/edit-profile" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/edit-availability" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/edit-preferences" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/edit-references" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/edit-verification" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/edit-experience" options={{ presentation: 'card' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  )
}
