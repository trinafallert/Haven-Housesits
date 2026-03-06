import { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'

const CONVOS = [
  {
    id: '1', name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    listing: 'Beachside bungalow w/ two cats', time: '2m ago',
    last: 'That sounds perfect! I can definitely handle that 😊', unread: 2, online: true,
    messages: [
      { id: 'm1', from: 'them', text: 'Hi! I just applied for your listing. I have tons of cat experience!', time: '10:02 AM' },
      { id: 'm2', from: 'me',   text: 'Hi Sarah! Thanks so much for applying. Can you tell me a bit more about your experience?', time: '10:15 AM' },
      { id: 'm3', from: 'them', text: 'Of course! I have two cats of my own and have sat for many others over the years.', time: '10:22 AM' },
      { id: 'm4', from: 'them', text: 'That sounds perfect! I can definitely handle that 😊', time: '10:23 AM' },
    ],
  },
  {
    id: '2', name: 'Marcus Lee', avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
    listing: 'SF apartment with two cats', time: '1h ago',
    last: 'What time is check-in on the 15th?', unread: 0, online: false,
    messages: [
      { id: 'm1', from: 'me',   text: 'Hey Marcus! You are confirmed for the sit 🎉', time: '9:00 AM' },
      { id: 'm2', from: 'them', text: 'Amazing!! So excited! I will take great care of everything.', time: '9:05 AM' },
      { id: 'm3', from: 'them', text: 'What time is check-in on the 15th?', time: '9:32 AM' },
    ],
  },
  {
    id: '3', name: 'Emma Torres', avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    listing: 'Luxury villa w/ horse + 2 dogs', time: 'Yesterday',
    last: 'Looking forward to meeting the animals!', unread: 0, online: false,
    messages: [
      { id: 'm1', from: 'them', text: 'Hi! I applied yesterday. Would love to answer any questions!', time: 'Yesterday' },
      { id: 'm2', from: 'me',   text: 'Thanks Emma! Your vet tech background is impressive.', time: 'Yesterday' },
      { id: 'm3', from: 'them', text: 'Looking forward to meeting the animals!', time: 'Yesterday' },
    ],
  },
]

export default function InboxScreen() {
  const [active, setActive]   = useState<typeof CONVOS[0] | null>(null)
  const [msg, setMsg]         = useState('')
  const [messages, setMessages] = useState<Record<string, typeof CONVOS[0]['messages']>>(
    Object.fromEntries(CONVOS.map(c => [c.id, c.messages]))
  )

  const send = () => {
    if (!msg.trim() || !active) return
    const newMsg = { id: `m${Date.now()}`, from: 'me', text: msg.trim(), time: 'Just now' }
    setMessages(prev => ({ ...prev, [active.id]: [...(prev[active.id] ?? []), newMsg] }))
    setMsg('')
  }

  if (active) {
    const msgs = messages[active.id] ?? []
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActive(null)}><Text style={styles.back}>←</Text></TouchableOpacity>
          <Image source={{ uri: active.avatar }} style={styles.chatAvatar} contentFit="cover" />
          <View style={{ flex: 1 }}>
            <Text style={styles.chatName}>{active.name}</Text>
            <Text style={styles.chatListing} numberOfLines={1}>{active.listing}</Text>
          </View>
          {active.online && <View style={styles.onlineDot} />}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
          <FlatList
            data={msgs}
            keyExtractor={m => m.id}
            contentContainerStyle={styles.messagesList}
            renderItem={({ item: m }) => (
              <View style={[styles.bubbleWrap, m.from === 'me' && styles.bubbleWrapMe]}>
                <View style={[styles.bubble, m.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.bubbleText, m.from === 'me' && styles.bubbleTextMe]}>{m.text}</Text>
                </View>
                <Text style={styles.bubbleTime}>{m.time}</Text>
              </View>
            )}
          />
          <View style={styles.inputBar}>
            <TextInput
              style={styles.msgInput}
              value={msg}
              onChangeText={setMsg}
              placeholder="Message..."
              placeholderTextColor={Colors.grayLight}
              returnKeyType="send"
              onSubmitEditing={send}
            />
            <TouchableOpacity style={[styles.sendBtn, !msg.trim() && styles.sendBtnDisabled]} onPress={send} disabled={!msg.trim()}>
              <Text style={styles.sendBtnText}>↑</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        <View style={styles.unreadTotal}>
          <Text style={styles.unreadTotalText}>{CONVOS.reduce((s, c) => s + c.unread, 0)} unread</Text>
        </View>
      </View>

      <FlatList
        data={CONVOS}
        keyExtractor={c => c.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item: c }) => (
          <TouchableOpacity style={styles.convoCard} onPress={() => setActive(c)} activeOpacity={0.85}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: c.avatar }} style={styles.convoAvatar} contentFit="cover" />
              {c.online && <View style={styles.onlineDotSmall} />}
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <View style={styles.convoTop}>
                <Text style={styles.convoName}>{c.name}</Text>
                <Text style={styles.convoTime}>{c.time}</Text>
              </View>
              <Text style={styles.convoListing} numberOfLines={1}>{c.listing}</Text>
              <Text style={[styles.convoLast, c.unread > 0 && styles.convoLastUnread]} numberOfLines={1}>{c.last}</Text>
            </View>
            {c.unread > 0 && (
              <View style={styles.unreadBadge}><Text style={styles.unreadBadgeText}>{c.unread}</Text></View>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const C = Colors, S = Shadows
const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: C.cream },
  header:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  title:             { fontSize: 26, fontWeight: '800', color: C.navy },
  unreadTotal:       { backgroundColor: C.tealPale, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  unreadTotalText:   { fontSize: 13, fontWeight: '600', color: C.tealDark },
  convoCard:         { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 16, padding: 14, ...S.card },
  avatarWrap:        { position: 'relative' },
  convoAvatar:       { width: 54, height: 54, borderRadius: 27 },
  onlineDotSmall:    { position: 'absolute', bottom: 2, right: 2, width: 13, height: 13, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2, borderColor: C.white },
  convoTop:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convoName:         { fontSize: 15, fontWeight: '700', color: C.navy },
  convoTime:         { fontSize: 12, color: C.grayLight },
  convoListing:      { fontSize: 12, color: C.teal, fontWeight: '500' },
  convoLast:         { fontSize: 13, color: C.gray },
  convoLastUnread:   { color: C.navy, fontWeight: '600' },
  unreadBadge:       { width: 22, height: 22, borderRadius: 11, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  unreadBadgeText:   { color: '#fff', fontSize: 12, fontWeight: '700' },
  // Chat
  chatHeader:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: C.sand, backgroundColor: C.white },
  back:              { fontSize: 22, color: C.navy, padding: 4 },
  chatAvatar:        { width: 40, height: 40, borderRadius: 20 },
  chatName:          { fontSize: 15, fontWeight: '700', color: C.navy },
  chatListing:       { fontSize: 12, color: C.teal },
  onlineDot:         { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
  messagesList:      { padding: 16, gap: 12, paddingBottom: 20 },
  bubbleWrap:        { gap: 3, maxWidth: '80%', alignSelf: 'flex-start' },
  bubbleWrapMe:      { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble:            { borderRadius: 16, padding: 12 },
  bubbleThem:        { backgroundColor: C.white, borderBottomLeftRadius: 4, ...S.card },
  bubbleMe:          { backgroundColor: C.teal, borderBottomRightRadius: 4 },
  bubbleText:        { fontSize: 15, color: C.navy, lineHeight: 22 },
  bubbleTextMe:      { color: '#fff' },
  bubbleTime:        { fontSize: 11, color: C.grayLight, paddingHorizontal: 4 },
  inputBar:          { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: C.sand, backgroundColor: C.white },
  msgInput:          { flex: 1, backgroundColor: C.grayPale, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: C.navy, maxHeight: 100 },
  sendBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled:   { backgroundColor: C.grayLight },
  sendBtnText:       { color: '#fff', fontSize: 18, fontWeight: '700' },
})
