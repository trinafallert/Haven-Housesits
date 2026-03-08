import { useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useFocusEffect } from 'expo-router'
import { Colors, Shadows } from '@/constants/colors'
import { useNotifications, useMarkNotificationRead } from '../src/hooks'

const NOTIF_ICONS: Record<string, string> = {
  APPLICATION:  '📩',
  ACCEPTED:     '✅',
  DECLINED:     '❌',
  MESSAGE:      '💬',
  REVIEW:       '⭐',
  SYSTEM:       '🔔',
}

export default function NotificationsScreen() {
  const router = useRouter()
  const { data, isLoading, refetch } = useNotifications()
  const markRead = useMarkNotificationRead()

  useFocusEffect(useCallback(() => { refetch() }, []))

  const notifs = data?.notifications ?? []
  const unread = notifs.filter((n: any) => !n.isRead).length

  const handlePress = (notif: any) => {
    if (!notif.isRead) markRead.mutate(notif.id)
    if (notif.link) router.push(notif.link)
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins < 60)  return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Notifications {unread > 0 ? `(${unread})` : ''}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {notifs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔔</Text>
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySubtitle}>We'll notify you when something needs your attention</Text>
        </View>
      ) : (
        <FlatList
          data={notifs}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              style={[styles.item, !item.isRead && styles.itemUnread]}
              activeOpacity={0.85}
              onPress={() => handlePress(item)}
            >
              <View style={styles.iconWrap}>
                <Text style={{ fontSize: 24 }}>{NOTIF_ICONS[item.type] ?? '🔔'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemBody} numberOfLines={2}>{item.body}</Text>
                <Text style={styles.itemTime}>{timeAgo(item.createdAt)}</Text>
              </View>
              {!item.isRead && <View style={styles.dot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.cream },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  backBtn:     { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.navy },
  empty:       { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  emptyEmoji:  { fontSize: 56 },
  emptyTitle:  { fontSize: 20, fontWeight: '800', color: Colors.navy },
  emptySubtitle: { fontSize: 15, color: Colors.gray, textAlign: 'center', lineHeight: 22 },
  list:        { padding: 12, gap: 2 },
  item:        { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 14, borderRadius: 14, backgroundColor: Colors.white, ...Shadows.card, marginBottom: 6 },
  itemUnread:  { backgroundColor: '#EFF8F8', borderLeftWidth: 3, borderLeftColor: Colors.teal },
  iconWrap:    { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  itemTitle:   { fontSize: 15, fontWeight: '700', color: Colors.navy, marginBottom: 2 },
  itemBody:    { fontSize: 13, color: Colors.gray, lineHeight: 18 },
  itemTime:    { fontSize: 11, color: Colors.grayLight, marginTop: 4 },
  dot:         { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.teal, marginTop: 6 },
})
