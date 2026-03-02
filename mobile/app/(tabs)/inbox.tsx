import { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'

const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    participant: { firstName: 'Sandra', lastName: 'D', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    listing: { title: 'Redondo Beach bungalow', photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&q=60' },
    lastMessage: 'The cats really loved you! Thank you so much 😊',
    lastMessageAt: '2026-02-23T18:42:00Z',
    unread: 0,
    status: 'COMPLETED',
  },
  {
    id: 'c2',
    participant: { firstName: 'Michael', lastName: 'K', avatar: null },
    listing: { title: 'Two golden retrievers in Lexington', photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&q=60' },
    lastMessage: "Hi! I reviewed your application and would love to chat.",
    lastMessageAt: '2026-03-01T09:15:00Z',
    unread: 1,
    status: 'PENDING',
  },
  {
    id: 'c3',
    participant: { firstName: 'Ali', lastName: 'B', avatar: null },
    listing: { title: 'SF apartment with two cats', photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&q=60' },
    lastMessage: 'Can you do a video call this week?',
    lastMessageAt: '2026-02-28T14:30:00Z',
    unread: 2,
    status: 'PENDING',
  },
]

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING:   { bg: Colors.grayPale,  text: Colors.gray      },
  ACCEPTED:  { bg: '#D1FAE5',        text: '#065F46'         },
  COMPLETED: { bg: Colors.tealPale,  text: Colors.tealDark   },
}
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending', ACCEPTED: 'Confirmed', COMPLETED: 'Completed',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export default function InboxScreen() {
  const router  = useRouter()
  const [query, setQuery] = useState('')

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    !query ||
    c.participant.firstName.toLowerCase().includes(query.toLowerCase()) ||
    c.listing.title.toLowerCase().includes(query.toLowerCase())
  )

  const totalUnread = MOCK_CONVERSATIONS.reduce((n, c) => n + c.unread, 0)

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inbox</Text>
          {totalUnread > 0 && (
            <Text style={styles.unreadCount}>{totalUnread} unread</Text>
          )}
        </View>
        <Text style={{ fontSize: 22 }}>💬</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search conversations…"
          placeholderTextColor={Colors.grayLight}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const sc = STATUS_COLORS[item.status] ?? STATUS_COLORS.PENDING
          return (
            <TouchableOpacity
              style={[styles.row, item.unread > 0 && styles.rowUnread]}
              onPress={() => router.push(`/inbox/${item.id}`)}
              activeOpacity={0.8}
            >
              {/* Avatar + listing thumb */}
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={{ fontSize: 20 }}>👤</Text>
                </View>
                <Image source={{ uri: item.listing.photo }} style={styles.listingThumb} contentFit="cover" />
              </View>

              {/* Content */}
              <View style={styles.content}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, item.unread > 0 && styles.nameBold]}>
                    {item.participant.firstName} {item.participant.lastName}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.statusText, { color: sc.text }]}>
                      {STATUS_LABELS[item.status]}
                    </Text>
                  </View>
                </View>
                <Text style={styles.listingName} numberOfLines={1}>{item.listing.title}</Text>
                <Text style={[styles.lastMsg, item.unread > 0 && styles.lastMsgBold]} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>

              {/* Time + unread */}
              <View style={styles.meta}>
                <Text style={styles.time}>{timeAgo(item.lastMessageAt)}</Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyText}>No conversations yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.navy, letterSpacing: -0.5 },
  unreadCount: { fontSize: 13, color: Colors.teal, fontWeight: '600', marginTop: 2 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: Colors.white, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.sand,
    paddingHorizontal: 12, height: 46,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.navy },
  list: { paddingHorizontal: 20, gap: 2, paddingBottom: 20 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: Colors.sand + '50',
  },
  rowUnread: { borderColor: Colors.teal + '50', backgroundColor: Colors.white },
  avatarWrap: { position: 'relative', width: 50, height: 50 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  listingThumb: { position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.white },
  content: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  name: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  nameBold: { fontWeight: '800' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: '700' },
  listingName: { fontSize: 11, color: Colors.gray, marginBottom: 2 },
  lastMsg: { fontSize: 13, color: Colors.gray, lineHeight: 17 },
  lastMsgBold: { fontWeight: '700', color: Colors.navy },
  meta: { alignItems: 'flex-end', gap: 6 },
  time: { fontSize: 11, color: Colors.grayLight },
  unreadBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  unreadBadgeText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: Colors.gray },
})
