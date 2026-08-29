import { useState, useCallback, useMemo } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView, RefreshControl, Dimensions,
  Modal, Switch, Platform, ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import MapView, { Marker } from 'react-native-maps'
import { Colors, Shadows } from '@/constants/colors'
import { useListings, useNotifications } from '@/src/hooks'
import type { Listing } from '@/src/api/client'

const { width } = Dimensions.get('window')

// ─── Constants ────────────────────────────────────────────────────────────────

const TOP_TABS = [
  { key: 'ALL',       label: 'All' },
  { key: 'FREE',      label: 'Free Sits' },
  { key: 'PAID',      label: 'Paid 💰' },
  { key: 'VACANT',    label: 'Vacant Homes' },
  { key: 'LONG_TERM', label: 'Long-term' },
]

const DURATION_OPTIONS = [
  { key: '1',   label: '1+ days',    days: 1 },
  { key: '3',   label: '3+ days',    days: 3 },
  { key: '7',   label: '1 week+',    days: 7 },
  { key: '14',  label: '2 weeks+',   days: 14 },
  { key: '21',  label: '3 weeks+',   days: 21 },
  { key: '30',  label: '1 month+',   days: 30 },
  { key: '60',  label: '2+ months',  days: 60 },
  { key: '90',  label: '3+ months',  days: 90 },
  { key: '180', label: '6 months+',  days: 180 },
]

const PET_FILTERS = [
  { key: 'DOG',       label: 'Dogs',       icon: '🐕' },
  { key: 'CAT',       label: 'Cats',       icon: '🐈' },
  { key: 'REPTILE',   label: 'Reptiles',   icon: '🦎' },
  { key: 'HORSE',     label: 'Horses',     icon: '🐴' },
  { key: 'BIRD',      label: 'Birds',      icon: '🦜' },
  { key: 'SMALL_PET', label: 'Small pets', icon: '🐹' },
  { key: 'FISH',      label: 'Fish',       icon: '🐠' },
  { key: 'POULTRY',   label: 'Poultry',    icon: '🐔' },
]

const ATTRACTION_FILTERS = [
  { key: 'BEACH',       label: 'Beach',       icon: '🏖️' },
  { key: 'CITY',        label: 'City',        icon: '🏙️' },
  { key: 'COUNTRYSIDE', label: 'Countryside', icon: '🌿' },
  { key: 'MOUNTAINS',   label: 'Mountains',   icon: '⛰️' },
]

const HOME_TYPES = [
  { key: 'HOUSE',     label: 'House',     icon: '🏠' },
  { key: 'APARTMENT', label: 'Apartment', icon: '🏢' },
  { key: 'FARM',      label: 'Farm',      icon: '🚜' },
  { key: 'UNIQUE',    label: 'Unique',    icon: '🏡' },
]

const PET_ICONS: Record<string, string> = {
  DOG: '🐕', CAT: '🐈', BIRD: '🦜', FISH: '🐠',
  REPTILE: '🦎', HORSE: '🐴', SMALL_PET: '🐹', POULTRY: '🐔',
}

interface FilterState {
  sortBy: string
  selectedPets: string[]
  selectedAttractions: string[]
  selectedHomeTypes: string[]
  wifi: boolean
  carIncluded: boolean
  familyFriendly: boolean
  minDuration: string | null
  arriveAfter: string
  leaveBefore: string
}

const DEFAULT_FILTERS: FilterState = {
  sortBy: 'RECOMMENDED',
  selectedPets: [],
  selectedAttractions: [],
  selectedHomeTypes: [],
  wifi: false,
  carIncluded: false,
  familyFriendly: false,
  minDuration: null,
  arriveAfter: '',
  leaveBefore: '',
}

function getDurationDays(listing: Listing): number {
  return Math.round(
    (new Date(listing.endDate).getTime() - new Date(listing.startDate).getTime())
    / (1000 * 60 * 60 * 24)
  )
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

function ListingCard({ item }: { item: Listing }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const isPaid = item.sitType === 'PAID'
  const appCount = item._count?.applications ?? 0
  const isLowApps = appCount > 0 && appCount < 3
  const daysUntilStart = Math.round(
    (new Date(item.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  const isLastMin = daysUntilStart >= 0 && daysUntilStart <= 7

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/listing/${item.id}`)}
      activeOpacity={0.93}
    >
      {/* Photo */}
      <View style={styles.photoWrap}>
        <Image
          source={{ uri: item.photos?.[0] ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600' }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.badgesLeft}>
          {isLastMin && (
            <View style={[styles.badge, { backgroundColor: '#F59E0B' }]}>
              <Text style={styles.badgeText}>LAST MIN</Text>
            </View>
          )}
          {isLowApps && (
            <View style={[styles.badge, { backgroundColor: Colors.purple }]}>
              <Text style={styles.badgeText}>LOW APPLICATIONS</Text>
            </View>
          )}
          {isPaid && (
            <View style={[styles.badge, { backgroundColor: '#10B981' }]}>
              <Text style={styles.badgeText}>💰 PAID</Text>
            </View>
          )}
          {item.isBoosted && (
            <View style={[styles.badge, { backgroundColor: Colors.navy }]}>
              <Text style={styles.badgeText}>⚡ BOOSTED</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.heartBtn} onPress={() => setSaved(!saved)}>
          <Text style={{ fontSize: 22 }}>{saved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardLocation}>📍 {item.city}, {item.country ?? item.state}</Text>
        <Text style={styles.cardDates}>
          {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' – '}
          {new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {'  ·  '}
          <Text style={styles.cardDuration}>{getDurationDays(item)} days</Text>
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.petsRow}>
            {(item.pets ?? []).slice(0, 4).map((p, i) => (
              <Text key={i} style={styles.petIcon}>{PET_ICONS[p.type] ?? '🐾'}</Text>
            ))}
            {(item.pets ?? []).length === 0 && (
              <Text style={styles.noPets}>🏠 Vacant sit</Text>
            )}
          </View>
          <View style={styles.cardRight}>
            {item.owner.idVerified && (
              <Text style={styles.verifiedBadge}>✓ ID</Text>
            )}
            {isPaid && item.dailyRate && (
              <View style={styles.ratePill}>
                <Text style={styles.rateText}>${item.dailyRate}/day</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ─── Map View ─────────────────────────────────────────────────────────────────

function MapListingView({ listings }: { listings: Listing[] }) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const mappable = listings.filter(l => l.latitude && l.longitude)
  const selected = mappable.find(l => l.id === selectedId)

  const initialRegion = mappable.length > 0
    ? {
        latitude:  mappable.reduce((s, l) => s + l.latitude!, 0) / mappable.length,
        longitude: mappable.reduce((s, l) => s + l.longitude!, 0) / mappable.length,
        latitudeDelta: 15,
        longitudeDelta: 20,
      }
    : { latitude: 37.0902, longitude: -95.7129, latitudeDelta: 50, longitudeDelta: 60 }

  if (mappable.length === 0) {
    return (
      <View style={styles.mapEmpty}>
        <Text style={styles.mapEmptyEmoji}>🗺️</Text>
        <Text style={styles.mapEmptyTitle}>Map view</Text>
        <Text style={styles.mapEmptyText}>
          Location pins will appear here once listings have geocoded coordinates.
          {'\n\n'}Switch to list view to browse {listings.length} available sits.
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={initialRegion} showsUserLocation>
        {mappable.map(l => {
          const isPaid = l.sitType === 'PAID'
          const isSelected = l.id === selectedId
          return (
            <Marker
              key={l.id}
              coordinate={{ latitude: l.latitude!, longitude: l.longitude! }}
              onPress={() => setSelectedId(isSelected ? null : l.id)}
            >
              <View style={[
                styles.mapPin,
                isPaid && styles.mapPinPaid,
                isSelected && styles.mapPinSelected,
              ]}>
                <Text style={[styles.mapPinText, isSelected && styles.mapPinTextSelected]}>
                  {isPaid ? `$${l.dailyRate ?? '?'}` : '🏡'}
                </Text>
              </View>
            </Marker>
          )
        })}
      </MapView>

      {/* Selected listing card */}
      {selected && (
        <TouchableOpacity
          style={styles.mapCallout}
          onPress={() => router.push(`/listing/${selected.id}`)}
          activeOpacity={0.92}
        >
          <Image
            source={{ uri: selected.photos?.[0] ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400' }}
            style={styles.mapCalloutPhoto}
            contentFit="cover"
          />
          <View style={styles.mapCalloutBody}>
            <Text style={styles.mapCalloutTitle} numberOfLines={1}>{selected.title}</Text>
            <Text style={styles.mapCalloutMeta}>
              📍 {selected.city} · {new Date(selected.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(selected.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
            <View style={styles.mapCalloutPets}>
              {(selected.pets ?? []).slice(0, 3).map((p, i) => (
                <Text key={i} style={{ fontSize: 14 }}>{PET_ICONS[p.type] ?? '🐾'}</Text>
              ))}
              {selected.sitType === 'PAID' && selected.dailyRate && (
                <View style={[styles.ratePill, { marginLeft: 6 }]}>
                  <Text style={styles.rateText}>${selected.dailyRate}/day</Text>
                </View>
              )}
            </View>
            <Text style={styles.mapCalloutCta}>Tap to view →</Text>
          </View>
          <TouchableOpacity
            style={styles.mapCalloutClose}
            onPress={() => setSelectedId(null)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={{ color: Colors.gray, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  )
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

function FilterPanel({
  visible, onClose, filters, onApply,
}: {
  visible: boolean
  onClose: () => void
  filters: FilterState
  onApply: (f: FilterState) => void
}) {
  const [local, setLocal] = useState<FilterState>(filters)

  const toggle = (
    field: 'selectedPets' | 'selectedAttractions' | 'selectedHomeTypes',
    key: string
  ) => {
    setLocal(prev => {
      const arr = prev[field]
      return { ...prev, [field]: arr.includes(key) ? arr.filter(k => k !== key) : [...arr, key] }
    })
  }

  const reset = () => setLocal({ ...DEFAULT_FILTERS, arriveAfter: '', leaveBefore: '' })

  // Sync local state when filters prop changes
  const handleOpen = () => setLocal(filters)

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      onShow={handleOpen}
    >
      <SafeAreaView style={styles.filterContainer}>
        {/* Header */}
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.filterClose}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity onPress={reset}>
            <Text style={styles.filterClear}>Clear all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterScroll} showsVerticalScrollIndicator={false}>

          {/* Travel dates */}
          <Text style={styles.filterSection}>Travel dates</Text>
          <View style={styles.dateFilterRow}>
            <View style={styles.dateFilterField}>
              <Text style={styles.dateFilterLabel}>Arrive after</Text>
              <TextInput
                style={styles.dateFilterInput}
                value={local.arriveAfter}
                onChangeText={v => setLocal(prev => ({ ...prev, arriveAfter: v }))}
                placeholder="Mar 15 2026"
                placeholderTextColor={Colors.grayLight}
              />
            </View>
            <View style={styles.dateFilterField}>
              <Text style={styles.dateFilterLabel}>Leave before</Text>
              <TextInput
                style={styles.dateFilterInput}
                value={local.leaveBefore}
                onChangeText={v => setLocal(prev => ({ ...prev, leaveBefore: v }))}
                placeholder="Jun 30 2026"
                placeholderTextColor={Colors.grayLight}
              />
            </View>
          </View>

          {/* Duration */}
          <Text style={styles.filterSection}>Sit duration</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.durationRow}
          >
            {DURATION_OPTIONS.map(d => (
              <TouchableOpacity
                key={d.key}
                style={[
                  styles.durationChip,
                  local.minDuration === d.key && styles.durationChipActive,
                ]}
                onPress={() => setLocal(prev => ({
                  ...prev,
                  minDuration: prev.minDuration === d.key ? null : d.key,
                }))}
              >
                <Text style={[
                  styles.durationChipText,
                  local.minDuration === d.key && styles.durationChipTextActive,
                ]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sort */}
          <Text style={styles.filterSection}>Sort by</Text>
          <View style={styles.sortRow}>
            {['Recommended', 'Newest', 'Start date', 'Duration'].map(s => {
              const key = s.toUpperCase().replace(' ', '_')
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.sortChip, local.sortBy === key && styles.sortChipActive]}
                  onPress={() => setLocal(prev => ({ ...prev, sortBy: key }))}
                >
                  <Text style={[styles.sortChipText, local.sortBy === key && styles.sortChipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Pets */}
          <Text style={styles.filterSection}>Pets</Text>
          <View style={styles.iconGrid}>
            {PET_FILTERS.map(p => (
              <TouchableOpacity
                key={p.key}
                style={[styles.iconGridItem, local.selectedPets.includes(p.key) && styles.iconGridItemActive]}
                onPress={() => toggle('selectedPets', p.key)}
              >
                <Text style={styles.iconGridEmoji}>{p.icon}</Text>
                <Text style={[styles.iconGridLabel, local.selectedPets.includes(p.key) && styles.iconGridLabelActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Local attractions */}
          <Text style={styles.filterSection}>Local attractions</Text>
          <View style={styles.iconGrid}>
            {ATTRACTION_FILTERS.map(a => (
              <TouchableOpacity
                key={a.key}
                style={[styles.iconGridItem, local.selectedAttractions.includes(a.key) && styles.iconGridItemActive]}
                onPress={() => toggle('selectedAttractions', a.key)}
              >
                <Text style={styles.iconGridEmoji}>{a.icon}</Text>
                <Text style={[styles.iconGridLabel, local.selectedAttractions.includes(a.key) && styles.iconGridLabelActive]}>
                  {a.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Home type */}
          <Text style={styles.filterSection}>Home type</Text>
          <View style={styles.iconGrid}>
            {HOME_TYPES.map(h => (
              <TouchableOpacity
                key={h.key}
                style={[styles.iconGridItem, local.selectedHomeTypes.includes(h.key) && styles.iconGridItemActive]}
                onPress={() => toggle('selectedHomeTypes', h.key)}
              >
                <Text style={styles.iconGridEmoji}>{h.icon}</Text>
                <Text style={[styles.iconGridLabel, local.selectedHomeTypes.includes(h.key) && styles.iconGridLabelActive]}>
                  {h.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amenities */}
          <Text style={styles.filterSection}>Amenities</Text>
          {[
            { label: '📶 High-speed wifi',   field: 'wifi' as const },
            { label: '🚗 Car included',       field: 'carIncluded' as const },
            { label: '👨‍👩‍👧 Family friendly', field: 'familyFriendly' as const },
          ].map(({ label, field }) => (
            <View key={label} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{label}</Text>
              <Switch
                value={local[field]}
                onValueChange={v => setLocal(prev => ({ ...prev, [field]: v }))}
                trackColor={{ false: Colors.sand, true: Colors.teal }}
                thumbColor={Colors.white}
              />
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Apply */}
        <View style={styles.filterFooter}>
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => { onApply(local); onClose() }}
          >
            <Text style={styles.applyBtnText}>Show results</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVisible, setFilterVisible] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const { data: notifData } = useNotifications()
  const unreadCount = (notifData?.notifications ?? []).filter((n: any) => !n.isRead).length

  // Only pass sitType=PAID to API; handle other tab filters client-side
  const sitTypeParam =
    activeTab === 'PAID' ? 'PAID' : undefined

  const petTypeParam = filters.selectedPets.length === 1 ? filters.selectedPets[0] : undefined

  // Parse date filter inputs
  const startDateParam = filters.arriveAfter ? new Date(filters.arriveAfter).toISOString() : undefined
  const endDateParam   = filters.leaveBefore ? new Date(filters.leaveBefore).toISOString()  : undefined

  const { data, isLoading, refetch, isRefetching } = useListings({
    sitType:   sitTypeParam,
    petType:   petTypeParam,
    startDate: startDateParam,
    endDate:   endDateParam,
  })

  const allListings = data?.listings ?? []

  const filtered = useMemo(() => {
    let result = [...allListings]

    // Tab filters handled client-side
    if (activeTab === 'FREE')      result = result.filter(l => l.sitType !== 'PAID')
    if (activeTab === 'VACANT')    result = result.filter(l => (l.pets ?? []).length === 0 && l.sitType !== 'PAID')
    // Match the host-chosen category, not the computed span — "sits longer than
    // N days" is what the minDuration filter below is for.
    if (activeTab === 'LONG_TERM') result = result.filter(l => l.sitType === 'LONG_TERM')

    // Multiple pet type filters (when more than 1 selected)
    if (filters.selectedPets.length > 1) {
      result = result.filter(l =>
        (l.pets ?? []).some(p => filters.selectedPets.includes(p.type))
      )
    }

    // Home type filter
    if (filters.selectedHomeTypes.length > 0) {
      result = result.filter(l =>
        l.homeType && filters.selectedHomeTypes.includes(l.homeType)
      )
    }

    // Amenities
    if (filters.wifi) result = result.filter(l => l.hasWifi)
    if (filters.familyFriendly) result = result.filter(l => l.isFamilyFriendly)

    // Duration filter — the main new feature
    if (filters.minDuration) {
      const minDays = DURATION_OPTIONS.find(d => d.key === filters.minDuration)?.days ?? 0
      result = result.filter(l => getDurationDays(l) >= minDays)
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        (l.state ?? '').toLowerCase().includes(q) ||
        (l.country ?? '').toLowerCase().includes(q)
      )
    }

    // Sort
    if (filters.sortBy === 'NEWEST') {
      // already newest first from API typically
    } else if (filters.sortBy === 'START_DATE') {
      result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    } else if (filters.sortBy === 'DURATION') {
      result.sort((a, b) => getDurationDays(b) - getDurationDays(a))
    }

    return result
  }, [allListings, activeTab, searchQuery, filters])

  const activeFilterCount = [
    filters.selectedPets.length > 0,
    filters.selectedAttractions.length > 0,
    filters.selectedHomeTypes.length > 0,
    filters.wifi,
    filters.carIncluded,
    filters.familyFriendly,
    filters.minDuration !== null,
    filters.sortBy !== 'RECOMMENDED',
    filters.arriveAfter !== '',
    filters.leaveBefore !== '',
  ].filter(Boolean).length

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── Search bar ── */}
      <View style={styles.searchBarWrap}>
        <TouchableOpacity style={styles.bellBtn} onPress={() => router.push('/notifications')}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Where would you like to go?"
            placeholderTextColor={Colors.grayLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: Colors.gray, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.filterBtnIcon}>⚙️</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bellBtn}
          onPress={() => router.push('/notifications')}
        >
          <Text style={{ fontSize: 20 }}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Tabs + map toggle ── */}
      <View style={styles.tabsMapRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {TOP_TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={[styles.mapToggle, viewMode === 'map' && styles.mapToggleActive]}
          onPress={() => setViewMode(v => v === 'list' ? 'map' : 'list')}
        >
          <Text style={styles.mapToggleText}>{viewMode === 'list' ? '🗺️' : '☰'}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Active filters bar ── */}
      {!isLoading && (filters.minDuration || activeFilterCount > 0) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeFiltersBar}
        >
          {filters.minDuration && (
            <TouchableOpacity
              style={styles.activeFilterChip}
              onPress={() => setFilters(prev => ({ ...prev, minDuration: null }))}
            >
              <Text style={styles.activeFilterText}>
                ⏱ {DURATION_OPTIONS.find(d => d.key === filters.minDuration)?.label}  ✕
              </Text>
            </TouchableOpacity>
          )}
          {filters.selectedPets.map(key => (
            <TouchableOpacity
              key={key}
              style={styles.activeFilterChip}
              onPress={() => setFilters(prev => ({ ...prev, selectedPets: prev.selectedPets.filter(k => k !== key) }))}
            >
              <Text style={styles.activeFilterText}>
                {PET_FILTERS.find(p => p.key === key)?.icon} {PET_FILTERS.find(p => p.key === key)?.label}  ✕
              </Text>
            </TouchableOpacity>
          ))}
          {filters.wifi && (
            <TouchableOpacity
              style={styles.activeFilterChip}
              onPress={() => setFilters(prev => ({ ...prev, wifi: false }))}
            >
              <Text style={styles.activeFilterText}>📶 Wifi  ✕</Text>
            </TouchableOpacity>
          )}
          {filters.familyFriendly && (
            <TouchableOpacity
              style={styles.activeFilterChip}
              onPress={() => setFilters(prev => ({ ...prev, familyFriendly: false }))}
            >
              <Text style={styles.activeFilterText}>👨‍👩‍👧 Family  ✕</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* ── Results count ── */}
      {!isLoading && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {filtered.length} {filtered.length === 1 ? 'sit' : 'sits'} found
          </Text>
        </View>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.teal} />
          <Text style={styles.loadingText}>Finding sits for you...</Text>
        </View>
      ) : viewMode === 'map' ? (
        <MapListingView listings={filtered} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={({ item }) => <ListingCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.teal}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌍</Text>
              <Text style={styles.emptyTitle}>No sits found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filters or search in a different location
              </Text>
            </View>
          }
        />
      )}

      {/* ── Filter modal ── */}
      <FilterPanel
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        onApply={setFilters}
      />
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.cream },

  // Search bar
  searchBarWrap:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  bellBtn:        { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.sand, ...Shadows.card },
  searchBar:      { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: 1, borderColor: Colors.sand, ...Shadows.card },
  searchIcon:     { fontSize: 16 },
  searchInput:    { flex: 1, fontSize: 15, color: Colors.navy },
  filterBtn:      { backgroundColor: Colors.teal, borderRadius: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  filterBtnActive: { backgroundColor: Colors.navy },
  filterBtnIcon:  { fontSize: 20 },
  filterBadge:    { position: 'absolute', top: -4, right: -4, backgroundColor: Colors.amber, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  filterBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
  bellBtn:        { backgroundColor: Colors.white, borderRadius: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.sand, position: 'relative' },
  bellBadge:      { position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  bellBadgeText:  { color: Colors.white, fontSize: 10, fontWeight: '800' },

  // Tabs row
  tabsMapRow:     { flexDirection: 'row', alignItems: 'center', paddingRight: 16 },
  tabsScroll:     { maxHeight: 48, flexGrow: 0 },
  tabsContent:    { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  tab:            { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.sand },
  tabActive:      { backgroundColor: Colors.teal, borderColor: Colors.teal },
  tabText:        { fontSize: 14, fontWeight: '500', color: Colors.gray },
  tabTextActive:  { color: Colors.white, fontWeight: '700' },

  // Map toggle
  mapToggle:      { width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.sand, marginLeft: 4 },
  mapToggleActive: { backgroundColor: Colors.tealPale, borderColor: Colors.teal },
  mapToggleText:  { fontSize: 18 },

  // Active filters bar
  activeFiltersBar: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  activeFilterChip: { backgroundColor: Colors.tealPale, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.teal },
  activeFilterText: { fontSize: 12, fontWeight: '600', color: Colors.tealDark },

  // Results bar
  resultsBar:     { paddingHorizontal: 20, paddingBottom: 6 },
  resultsText:    { fontSize: 13, color: Colors.gray, fontWeight: '500' },

  // Loading
  loadingWrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:    { fontSize: 15, color: Colors.gray },

  // List
  listContent:    { padding: 16, gap: 16, paddingBottom: 32 },

  // Card
  card:           { backgroundColor: Colors.white, borderRadius: 18, overflow: 'hidden', ...Shadows.card },
  photoWrap:      { position: 'relative', height: 200 },
  photo:          { width: '100%', height: '100%' },
  badgesLeft:     { position: 'absolute', top: 10, left: 10, gap: 6 },
  badge:          { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeText:      { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  heartBtn:       { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },

  cardBody:       { padding: 14, gap: 4 },
  cardTitle:      { fontSize: 16, fontWeight: '700', color: Colors.navy },
  cardLocation:   { fontSize: 13, color: Colors.gray },
  cardDates:      { fontSize: 13, color: Colors.gray, marginTop: 2 },
  cardDuration:   { color: Colors.tealDark, fontWeight: '600' },
  cardFooter:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  cardRight:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  petsRow:        { flexDirection: 'row', gap: 4, flex: 1 },
  petIcon:        { fontSize: 20 },
  noPets:         { fontSize: 13, color: Colors.gray },
  verifiedBadge:  { fontSize: 11, fontWeight: '700', color: Colors.teal },
  ratePill:       { backgroundColor: '#ECFDF5', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  rateText:       { fontSize: 13, fontWeight: '700', color: '#059669' },

  // Empty state
  emptyState:     { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyEmoji:     { fontSize: 48 },
  emptyTitle:     { fontSize: 20, fontWeight: '700', color: Colors.navy },
  emptySubtitle:  { fontSize: 14, color: Colors.gray, textAlign: 'center', maxWidth: 260 },

  // Map
  mapEmpty:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  mapEmptyEmoji:  { fontSize: 56 },
  mapEmptyTitle:  { fontSize: 20, fontWeight: '700', color: Colors.navy },
  mapEmptyText:   { fontSize: 14, color: Colors.gray, textAlign: 'center', lineHeight: 22 },

  mapPin:         { backgroundColor: Colors.white, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 2, borderColor: Colors.teal, ...Shadows.card },
  mapPinPaid:     { backgroundColor: '#ECFDF5', borderColor: '#059669' },
  mapPinSelected: { backgroundColor: Colors.teal, borderColor: Colors.tealDark },
  mapPinText:     { fontSize: 12, fontWeight: '700', color: Colors.teal },
  mapPinTextSelected: { color: Colors.white },

  mapCallout:     { position: 'absolute', bottom: 20, left: 16, right: 16, backgroundColor: Colors.white, borderRadius: 18, flexDirection: 'row', overflow: 'hidden', ...Shadows.strong },
  mapCalloutPhoto: { width: 90, height: 90 },
  mapCalloutBody: { flex: 1, padding: 12, gap: 3 },
  mapCalloutTitle: { fontSize: 14, fontWeight: '700', color: Colors.navy },
  mapCalloutMeta: { fontSize: 12, color: Colors.gray },
  mapCalloutPets: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mapCalloutCta:  { fontSize: 12, fontWeight: '600', color: Colors.teal, marginTop: 2 },
  mapCalloutClose: { padding: 12, justifyContent: 'flex-start' },

  // Filter panel
  filterContainer:  { flex: 1, backgroundColor: Colors.white },
  filterHeader:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  filterClose:      { fontSize: 18, color: Colors.gray, padding: 4 },
  filterTitle:      { fontSize: 18, fontWeight: '700', color: Colors.navy },
  filterClear:      { fontSize: 15, color: Colors.teal, fontWeight: '600' },
  filterScroll:     { flex: 1 },
  filterSection:    { fontSize: 16, fontWeight: '700', color: Colors.navy, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },

  // Date filter
  dateFilterRow:   { flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  dateFilterField: { flex: 1, gap: 6 },
  dateFilterLabel: { fontSize: 12, fontWeight: '600', color: Colors.gray, marginBottom: 2 },
  dateFilterInput: { backgroundColor: Colors.white, borderRadius: 12, padding: 12, fontSize: 14, color: Colors.navy, borderWidth: 1.5, borderColor: Colors.sand },

  // Duration chips (horizontal scroll)
  durationRow:      { paddingHorizontal: 20, gap: 8 },
  durationChip:     { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white },
  durationChipActive: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  durationChipText: { fontSize: 14, color: Colors.gray, fontWeight: '500' },
  durationChipTextActive: { color: Colors.tealDark, fontWeight: '700' },

  sortRow:          { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8 },
  sortChip:         { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white },
  sortChipActive:   { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  sortChipText:     { fontSize: 14, color: Colors.gray, fontWeight: '500' },
  sortChipTextActive: { color: Colors.tealDark, fontWeight: '700' },

  iconGrid:         { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  iconGridItem:     { alignItems: 'center', width: (width - 64) / 4, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white, gap: 4 },
  iconGridItemActive: { borderColor: Colors.teal, backgroundColor: Colors.tealPale },
  iconGridEmoji:    { fontSize: 26 },
  iconGridLabel:    { fontSize: 11, color: Colors.gray, textAlign: 'center', fontWeight: '500' },
  iconGridLabelActive: { color: Colors.tealDark, fontWeight: '700' },

  toggleRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.grayPale },
  toggleLabel:      { fontSize: 15, color: Colors.navy, fontWeight: '500' },

  filterFooter:     { padding: 20, borderTopWidth: 1, borderTopColor: Colors.sand },
  applyBtn:         { backgroundColor: Colors.teal, borderRadius: 16, paddingVertical: 16, alignItems: 'center', ...Shadows.card },
  applyBtnText:     { color: Colors.white, fontSize: 16, fontWeight: '700' },
})
