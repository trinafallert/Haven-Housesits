import { useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView, RefreshControl, Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'
import { MOCK_LISTINGS, PET_ICONS, SIT_TYPE_COLORS, SIT_TYPE_LABELS } from '@/constants/mock-data'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width - 32

const SIT_TYPE_FILTERS = [
  { key: 'ALL',      label: 'All sits',      icon: '🌍' },
  { key: 'FREE',     label: 'Free',          icon: '🏡' },
  { key: 'PAID',     label: 'Paid',          icon: '💰' },
  { key: 'VACANT',   label: 'Vacant',        icon: '🔑' },
  { key: 'LONG_TERM',label: 'Long-term',     icon: '📅' },
]

function ListingCard({ item }: { item: typeof MOCK_LISTINGS[0] }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const isLow = item.applicationCount < 3 && item.applicationCount > 0

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/listing/${item.id}`)}
      activeOpacity={0.92}
    >
      {/* Photo */}
      <View style={styles.photoWrap}>
        <Image
          source={{ uri: item.photos[0] }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
        />

        {/* Overlay badges */}
        <View style={styles.overlayLeft}>
          <View style={[styles.typeBadge, { backgroundColor: SIT_TYPE_COLORS[item.sitType] }]}>
            <Text style={styles.typeBadgeText}>{SIT_TYPE_LABELS[item.sitType]}</Text>
          </View>
          {isLow && (
            <View style={styles.lowBadge}>
              <Text style={styles.lowBadgeText}>🔥 Low applicants</Text>
            </View>
          )}
          {item.isBoosted && (
            <View style={styles.boostBadge}>
              <Text style={styles.boostBadgeText}>⭐ Featured</Text>
            </View>
          )}
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.heartBtn} onPress={() => setSaved(!saved)}>
          <Text style={{ fontSize: 20 }}>{saved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {/* Match Score */}
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{item.matchScore}% match</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardLocation}>📍 {item.city}, {item.state}</Text>

        <View style={styles.cardMeta}>
          <Text style={styles.cardDates}>
            {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
            {new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
          <View style={styles.petsRow}>
            {item.pets.slice(0, 4).map((p, i) => (
              <Text key={i} style={{ fontSize: 16 }}>{PET_ICONS[p.type] || '🐾'}</Text>
            ))}
            {item.pets.length === 0 && <Text style={styles.noPets}>No pets</Text>}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.ownerRow}>
            <View style={styles.ownerAvatar}>
              <Text style={{ fontSize: 14 }}>👤</Text>
            </View>
            <Text style={styles.ownerName}>{item.owner.firstName}</Text>
            {item.owner.averageRating > 0 && (
              <Text style={styles.ownerRating}>⭐ {item.owner.averageRating}</Text>
            )}
          </View>

          <View>
            {item.sitType === 'PAID' && item.dailyRate ? (
              <Text style={styles.price}>${item.dailyRate}<Text style={styles.priceUnit}>/day</Text></Text>
            ) : (
              <Text style={styles.free}>Free</Text>
            )}
          </View>
        </View>

        {/* Applications bar */}
        <View style={styles.appBar}>
          <View style={[styles.appFill, { width: `${(item.applicationCount / item.maxApplications) * 100}%` as any }]} />
        </View>
        <Text style={styles.appCount}>
          {item.applicationCount} of {item.maxApplications} spots filled
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default function SearchScreen() {
  const [query, setQuery]       = useState('')
  const [filter, setFilter]     = useState('ALL')
  const [refreshing, setRefresh] = useState(false)

  const filtered = MOCK_LISTINGS.filter((l) => {
    const matchesType  = filter === 'ALL' || l.sitType === filter
    const matchesQuery = !query || l.title.toLowerCase().includes(query.toLowerCase()) ||
                         l.city.toLowerCase().includes(query.toLowerCase())
    return matchesType && matchesQuery
  })

  const onRefresh = useCallback(() => {
    setRefresh(true)
    setTimeout(() => setRefresh(false), 1000)
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoEmoji}>🏡</Text>
          <Text style={styles.logoText}>Haven</Text>
        </View>
        <TouchableOpacity style={styles.filterIconBtn}>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by location, pet type…"
          placeholderTextColor={Colors.grayLight}
          returnKeyType="search"
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Type filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsScroll}
      >
        {SIT_TYPE_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, filter === f.key && styles.chipActive]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.chipIcon}>{f.icon}</Text>
            <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.teal} />}
        ListHeaderComponent={
          <Text style={styles.resultsCount}>
            {filtered.length} sit{filtered.length !== 1 ? 's' : ''} found
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No sits found</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoEmoji: { fontSize: 22 },
  logoText: { fontSize: 22, fontWeight: '800', color: Colors.navy, letterSpacing: -0.5 },
  filterIconBtn: { padding: 8 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: Colors.white,
    borderRadius: 16, borderWidth: 1.5, borderColor: Colors.sand,
    paddingHorizontal: 14, height: 50,
    ...Shadows.card,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.navy },
  clearBtn: { fontSize: 14, color: Colors.grayLight, padding: 4 },
  chipsScroll: { maxHeight: 52 },
  chips: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 50, borderWidth: 1.5, borderColor: Colors.sand,
    backgroundColor: Colors.white,
  },
  chipActive: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  chipIcon: { fontSize: 14 },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.gray },
  chipTextActive: { color: Colors.tealDark },
  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 16 },
  resultsCount: { fontSize: 13, color: Colors.gray, marginBottom: 8, fontWeight: '500' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.card,
  },
  photoWrap: { height: 220, position: 'relative' },
  photo: { width: '100%', height: '100%' },
  overlayLeft: { position: 'absolute', top: 12, left: 12, gap: 6 },
  typeBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  typeBadgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  lowBadge: { backgroundColor: 'rgba(239,68,68,0.9)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  lowBadgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  boostBadge: { backgroundColor: 'rgba(245,158,11,0.9)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  boostBadgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  heartBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  matchBadge: { position: 'absolute', bottom: 10, right: 10, backgroundColor: Colors.navy, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  matchText: { color: Colors.tealLight, fontSize: 11, fontWeight: '700' },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.navy, marginBottom: 4 },
  cardLocation: { fontSize: 13, color: Colors.gray, marginBottom: 8 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardDates: { fontSize: 13, color: Colors.gray, fontWeight: '500' },
  petsRow: { flexDirection: 'row', gap: 2 },
  noPets: { fontSize: 12, color: Colors.grayLight },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ownerAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  ownerName: { fontSize: 13, fontWeight: '600', color: Colors.navy },
  ownerRating: { fontSize: 12, color: Colors.gray },
  price: { fontSize: 18, fontWeight: '800', color: Colors.navy },
  priceUnit: { fontSize: 12, fontWeight: '500', color: Colors.gray },
  free: { fontSize: 15, fontWeight: '700', color: Colors.emerald },
  appBar: { height: 4, backgroundColor: Colors.sand, borderRadius: 4, marginBottom: 4, overflow: 'hidden' },
  appFill: { height: '100%', backgroundColor: Colors.teal, borderRadius: 4 },
  appCount: { fontSize: 11, color: Colors.grayLight },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: Colors.gray },
})
