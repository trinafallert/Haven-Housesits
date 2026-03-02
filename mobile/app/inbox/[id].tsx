import { useState, useRef, useEffect } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors } from '@/constants/colors'

const THREAD = {
  id: 'c2',
  participant: { firstName: 'Michael', lastName: 'K', avatar: null, idVerified: true, rating: 4.9 },
  listing: { id: '2', title: 'Two golden retrievers in Lexington', photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=60', city: 'Lexington', state: 'KY' },
  status: 'PENDING',
  messages: [
    { id: 'm1', type: 'SYSTEM', text: '🐕 Application sent — 10 Mar – 12 Apr', createdAt: '2026-02-28T10:00:00Z' },
    { id: 'm2', type: 'RECEIVED', text: 'Hi! Thanks so much for applying. You seem like a great fit for Buddy!', createdAt: '2026-03-01T09:15:00Z' },
    { id: 'm3', type: 'SENT',     text: 'Thank you Michael! Buddy looks adorable. I have 3 years of experience with goldens.', createdAt: '2026-03-01T09:22:00Z' },
    { id: 'm4', type: 'RECEIVED', text: 'Would you be available for a quick video call to meet Buddy?', createdAt: '2026-03-01T09:30:00Z' },
    { id: 'm5', type: 'SYSTEM',   text: '📞 Video call scheduled — Thu Mar 5, 7pm EST', createdAt: '2026-03-01T10:00:00Z' },
  ],
}

function timeStr(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function MessageThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router  = useRouter()
  const [messages, setMessages] = useState(THREAD.messages)
  const [input, setInput]       = useState('')
  const listRef                 = useRef<FlatList>(null)

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100)
  }, [messages])

  function send() {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: `m${Date.now()}`, type: 'SENT', text, createdAt: new Date().toISOString() },
    ])
    setInput('')
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={{ fontSize: 18 }}>👤</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.headerName}>{THREAD.participant.firstName} {THREAD.participant.lastName}</Text>
            {THREAD.participant.idVerified && <Text style={styles.idChip}>ID ✓</Text>}
          </View>
          <Text style={styles.headerStatus}>
            {THREAD.status === 'PENDING' ? '⏳ Pending' : '✅ Confirmed'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}><Text style={{ fontSize: 18 }}>📞</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Text style={{ fontSize: 18 }}>📹</Text></TouchableOpacity>
        </View>
      </View>

      {/* Listing banner */}
      <TouchableOpacity style={styles.listingBanner} onPress={() => router.push(`/listing/${THREAD.listing.id}`)}>
        <Image source={{ uri: THREAD.listing.photo }} style={styles.listingThumb} contentFit="cover" />
        <View style={{ flex: 1 }}>
          <Text style={styles.listingTitle} numberOfLines={1}>{THREAD.listing.title}</Text>
          <Text style={styles.listingMeta}>{THREAD.listing.city}, {THREAD.listing.state} · Tap to view →</Text>
        </View>
      </TouchableOpacity>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item: msg }) => {
            if (msg.type === 'SYSTEM') {
              return (
                <View style={styles.systemRow}>
                  <View style={styles.systemPill}>
                    <Text style={styles.systemText}>{msg.text}</Text>
                  </View>
                </View>
              )
            }
            const isSent = msg.type === 'SENT'
            return (
              <View style={[styles.msgRow, isSent && styles.msgRowRight]}>
                {!isSent && (
                  <View style={styles.msgAvatar}>
                    <Text style={{ fontSize: 14 }}>👤</Text>
                  </View>
                )}
                <View style={{ maxWidth: '75%' }}>
                  <View style={[styles.bubble, isSent ? styles.bubbleSent : styles.bubbleReceived]}>
                    <Text style={[styles.bubbleText, isSent && styles.bubbleTextSent]}>{msg.text}</Text>
                  </View>
                  <Text style={[styles.msgTime, isSent && styles.msgTimeRight]}>
                    {timeStr(msg.createdAt)}
                  </Text>
                </View>
              </View>
            )
          }}
        />

        {/* Composer */}
        <View style={styles.composer}>
          <TouchableOpacity style={styles.attachBtn}><Text style={{ fontSize: 18 }}>📎</Text></TouchableOpacity>
          <TextInput
            style={styles.composerInput}
            value={input}
            onChangeText={setInput}
            placeholder={`Message ${THREAD.participant.firstName}…`}
            placeholderTextColor={Colors.grayLight}
            multiline
            maxLength={2000}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={send}
            disabled={!input.trim()}
          >
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: Colors.navy },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerName: { fontSize: 15, fontWeight: '700', color: Colors.navy },
  idChip: { fontSize: 10, fontWeight: '700', color: Colors.tealDark, backgroundColor: Colors.tealPale, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  headerStatus: { fontSize: 12, color: Colors.gray, marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.grayPale, alignItems: 'center', justifyContent: 'center' },
  listingBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  listingThumb: { width: 44, height: 44, borderRadius: 10 },
  listingTitle: { fontSize: 13, fontWeight: '600', color: Colors.navy },
  listingMeta: { fontSize: 11, color: Colors.gray, marginTop: 1 },
  messageList: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 12 },
  systemRow: { alignItems: 'center' },
  systemPill: { backgroundColor: Colors.grayPale, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  systemText: { fontSize: 12, color: Colors.gray, fontWeight: '500' },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowRight: { justifyContent: 'flex-end' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleSent: { backgroundColor: Colors.teal, borderBottomRightRadius: 4 },
  bubbleReceived: { backgroundColor: Colors.white, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.sand },
  bubbleText: { fontSize: 15, color: Colors.navy, lineHeight: 21 },
  bubbleTextSent: { color: Colors.white },
  msgTime: { fontSize: 10, color: Colors.grayLight, marginTop: 3, paddingHorizontal: 4 },
  msgTimeRight: { textAlign: 'right' },
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10, paddingBottom: 28,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.sand,
  },
  attachBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  composerInput: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: Colors.navy,
    maxHeight: 120, backgroundColor: Colors.white,
  },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.35 },
  sendBtnText: { color: Colors.white, fontSize: 18, fontWeight: '800' },
})
