import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Colors, Shadows } from '@/constants/colors'

type DateRange = { id: string; from: string; to: string }

const MOCK_DATES: DateRange[] = [
  { id: '1', from: '2026-04-01', to: '2026-04-30' },
  { id: '2', from: '2026-06-15', to: '2026-07-15' },
]

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS_IN_MONTH = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
const FIRST_DAY = (y: number, m: number) => new Date(y, m, 1).getDay()

function MiniCalendar({ year, month, onSelect }: { year: number; month: number; onSelect: (d: number) => void }) {
  const days = DAYS_IN_MONTH(year, month)
  const firstDay = FIRST_DAY(year, month)
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: days }, (_, i) => i + 1))

  return (
    <View style={styles.calendar}>
      <View style={styles.calWeekRow}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <Text key={i} style={styles.calWeekDay}>{d}</Text>
        ))}
      </View>
      <View style={styles.calGrid}>
        {cells.map((day, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.calCell, day && styles.calCellActive]}
            onPress={() => day && onSelect(day)}
            disabled={!day}
          >
            <Text style={[styles.calDayText, !day && { opacity: 0 }]}>{day ?? '·'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default function EditAvailabilityScreen() {
  const router = useRouter()
  const [dates, setDates] = useState<DateRange[]>(MOCK_DATES)
  const [showCalendar, setShowCalendar] = useState(false)
  const today = new Date()

  const fmt = (s: string) => {
    const d = new Date(s)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Availability</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>
          Let home owners know when you're available for invites. You'll only appear in searches during these dates.
        </Text>

        {dates.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛋️</Text>
            <Text style={styles.emptyTitle}>No dates added yet</Text>
            <Text style={styles.emptySubtitle}>Add your available dates to start receiving sit invitations</Text>
          </View>
        ) : (
          dates.map(d => (
            <View key={d.id} style={styles.dateCard}>
              <View style={styles.dateIconWrap}>
                <Text style={{ fontSize: 22 }}>📅</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dateFrom}>{fmt(d.from)}</Text>
                <Text style={styles.dateTo}>to {fmt(d.to)}</Text>
              </View>
              <TouchableOpacity onPress={() => setDates(prev => prev.filter(x => x.id !== d.id))}>
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {showCalendar && (
          <View style={styles.calendarCard}>
            <Text style={styles.calHeader}>
              {MONTHS[today.getMonth()]} {today.getFullYear()}
            </Text>
            <MiniCalendar
              year={today.getFullYear()}
              month={today.getMonth()}
              onSelect={(day) => {
                const from = new Date(today.getFullYear(), today.getMonth(), day)
                const to   = new Date(today.getFullYear(), today.getMonth() + 1, day)
                setDates(prev => [...prev, {
                  id: String(Date.now()),
                  from: from.toISOString().split('T')[0],
                  to:   to.toISOString().split('T')[0],
                }])
                setShowCalendar(false)
              }}
            />
          </View>
        )}

        <TouchableOpacity style={styles.addBtn} onPress={() => setShowCalendar(!showCalendar)}>
          <Text style={styles.addBtnText}>+ Add new dates</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 You can add multiple date ranges. Owners can only invite you during these windows.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.cream },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  backBtn:        { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:       { fontSize: 22, color: Colors.navy },
  headerTitle:    { fontSize: 18, fontWeight: '700', color: Colors.navy },
  scroll:         { padding: 20, gap: 12 },
  subtitle:       { fontSize: 14, color: Colors.gray, lineHeight: 20 },
  emptyState:     { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyEmoji:     { fontSize: 56 },
  emptyTitle:     { fontSize: 18, fontWeight: '700', color: Colors.navy },
  emptySubtitle:  { fontSize: 14, color: Colors.gray, textAlign: 'center', maxWidth: 240 },
  dateCard:       { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.white, borderRadius: 14, padding: 14, ...Shadows.card },
  dateIconWrap:   { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  dateFrom:       { fontSize: 15, fontWeight: '700', color: Colors.navy },
  dateTo:         { fontSize: 13, color: Colors.gray, marginTop: 2 },
  deleteBtn:      { fontSize: 20, padding: 4 },
  addBtn:         { backgroundColor: Colors.teal, borderRadius: 14, paddingVertical: 14, alignItems: 'center', ...Shadows.card },
  addBtnText:     { color: Colors.white, fontSize: 15, fontWeight: '700' },
  calendarCard:   { backgroundColor: Colors.white, borderRadius: 16, padding: 16, ...Shadows.card },
  calHeader:      { fontSize: 16, fontWeight: '700', color: Colors.navy, textAlign: 'center', marginBottom: 12 },
  calendar:       { gap: 4 },
  calWeekRow:     { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
  calWeekDay:     { fontSize: 12, fontWeight: '600', color: Colors.gray, width: 36, textAlign: 'center' },
  calGrid:        { flexDirection: 'row', flexWrap: 'wrap' },
  calCell:        { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  calCellActive:  {},
  calDayText:     { fontSize: 14, color: Colors.navy },
  infoBox:        { backgroundColor: Colors.tealPale, borderRadius: 14, padding: 14 },
  infoText:       { fontSize: 13, color: Colors.tealDark, lineHeight: 18 },
})
