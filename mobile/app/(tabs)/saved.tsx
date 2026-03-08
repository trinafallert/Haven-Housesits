import { useState, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useFocusEffect } from 'expo-router'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'
import { useSavedListings, useToggleSave } from '../../src/hooks'

export default function SavedScreen() {
  const router = useRouter()
  const { data, isLoading, refetch } = useSavedListings()
  const toggleSave = useToggleSave()

  useFocusEffect(useCallback(() => { refetch() }, []))

  const listings = data?.listings ?? []

  const formatDates = (s: string, e: string) => {
    const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${fmt(s)} – ${fmt(e)}`
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.teal} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved sits</Text>
        <Text style={styles.headerCount}>{listings.length} saved</Text>
      </View>

      {listings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>❤️</Text>
          <Text style={styles.emptyTitle}>No saved sits yet</Text>
          <Text style={styles.emptySubtitle}>Tap the heart on any listing to save it here</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)/search')}>
            <Text style={styles.browseBtnText}>Browse sits</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.92}
              onPress={() => router.push(`/listing/${item.id}`)}
            >
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: item.photos?.[0] ?? `https://source.unsplash.com/400x260/?${item.city ?? 'house'},pet` }}
                  style={styles.image}
                  contentFit="cover"
                />
                {/* Save button */}
                <TouchableOpacity
                  style={styles.heartBtn}
                  onPress={() => toggleSave.mutate(item.id, { onSuccess: () => refetch() })}
                >
                  <Text style={{ fontSize: 18 }}>❤️</Text>
                </TouchableOpacity>
                {item.sitType === 'PAID' && (
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidText}>💰 Paid sit</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.location}>📍 {[item.city, item.country].filter(Boolean).join(', ')}</Text>
                <Text style={styles.dates}>📅 {formatDates(item.startDate, item.endDate)}</Text>
                <View style={styles.petRow}>
                  {(item.pets ?? []).slice(0, 3).map((p: any, i: number) => (
                    <View key={i} style={styles.petChip}>
                      <Text style={styles.petText}>{p.name || p.type}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.cream },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.navy },
  headerCount: { fontSize: 14, color: Colors.gray, fontWeight: '600' },
  empty:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyEmoji:  { fontSize: 56 },
  emptyTitle:  { fontSize: 20, fontWeight: '800', color: Colors.navy },
  emptySubtitle: { fontSize: 15, color: Colors.gray, textAlign: 'center', lineHeight: 22 },
  browseBtn:   { backgroundColor: Colors.teal, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14, marginTop: 8, ...Shadows.card },
  browseBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  list:        { padding: 16, gap: 16, paddingBottom: 32 },
  card:        { backgroundColor: Colors.white, borderRadius: 18, overflow: 'hidden', ...Shadows.card },
  imageWrap:   { position: 'relative' },
  image:       { width: '100%', height: 180 },
  heartBtn:    { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  paidBadge:   { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(26,46,53,0.8)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  paidText:    { color: Colors.white, fontSize: 12, fontWeight: '700' },
  cardBody:    { padding: 14, gap: 5 },
  title:       { fontSize: 16, fontWeight: '800', color: Colors.navy },
  location:    { fontSize: 13, color: Colors.gray },
  dates:       { fontSize: 13, color: Colors.gray },
  petRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  petChip:     { backgroundColor: Colors.tealPale, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  petText:     { fontSize: 12, color: Colors.tealDark, fontWeight: '600' },
})
