import { useState, useRef, useEffect } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'
import { useConversations, useMessages, useSendMessage } from '@/src/hooks'
import { useAuthStore } from '@/src/store/auth'
import type { Conversation } from '@/src/api/client'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Chat view ────────────────────────────────────────────────────────────────

function ChatView({ convo, onBack }: { convo: Conversation; onBack: () => void }) {
  const user = useAuthStore(s => s.user)
  const [msg, setMsg] = useState('')
  const flatRef = useRef<FlatList>(null)

  const { data, isLoading } = useMessages(convo.id)
  const sendMutation = useSendMessage()

  const msgs = data?.messages ?? []

  useEffect(() => {
    if (msgs.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 100)
    }
  }, [msgs.length])

  const send = () => {
    const text = msg.trim()
    if (!text) return
    setMsg('')
    sendMutation.mutate({ conversationId: convo.id, text })
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        {convo.otherUser?.avatar ? (
          <Image source={{ uri: convo.otherUser.avatar }} style={styles.chatAvatar} contentFit="cover" />
        ) : (
          <View style={[styles.chatAvatar, styles.chatAvatarPlaceholder]}>
            <Text style={{ fontSize: 18 }}>👤</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.chatName}>
            {convo.otherUser
              ? `${convo.otherUser.firstName} ${convo.otherUser.lastName}`
              : 'Unknown user'}
          </Text>
          <Text style={styles.chatListing} numberOfLines={1}>{convo.listingTitle}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {isLoading ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator color={Colors.teal} />
          </View>
        ) : (
          <FlatList
            ref={flatRef}
            data={msgs}
            keyExtractor={m => m.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
            renderItem={({ item: m }) => {
              const isMe = m.senderId === user?.id
              return (
                <View style={[styles.bubbleWrap, isMe && styles.bubbleWrapMe]}>
                  <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                    <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{m.text}</Text>
                  </View>
                  <Text style={styles.bubbleTime}>{timeAgo(m.createdAt)}</Text>
                </View>
              )
            }}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatText}>
                  Start the conversation about{'\n'}"{convo.listingTitle}"
                </Text>
              </View>
            }
          />
        )}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.msgInput}
            value={msg}
            onChangeText={setMsg}
            placeholder="Message..."
            placeholderTextColor={Colors.grayLight}
            returnKeyType="send"
            onSubmitEditing={send}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!msg.trim() || sendMutation.isPending) && styles.sendBtnDisabled]}
            onPress={send}
            disabled={!msg.trim() || sendMutation.isPending}
          >
            {sendMutation.isPending
              ? <ActivityIndicator size="small" color={Colors.white} />
              : <Text style={styles.sendBtnText}>↑</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// ─── Inbox list ───────────────────────────────────────────────────────────────

export default function InboxScreen() {
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null)
  const { data, isLoading, refetch, isRefetching } = useConversations()

  if (activeConvo) {
    return <ChatView convo={activeConvo} onBack={() => setActiveConvo(null)} />
  }

  const convos = data?.conversations ?? []
  const totalUnread = convos.reduce((s, c) => s + c.unreadCount, 0)

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        {totalUnread > 0 && (
          <View style={styles.unreadTotal}>
            <Text style={styles.unreadTotalText}>{totalUnread} unread</Text>
          </View>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.teal} />
        </View>
      ) : (
        <FlatList
          data={convos}
          keyExtractor={c => c.id}
          contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item: c }) => {
            const name = c.otherUser
              ? `${c.otherUser.firstName} ${c.otherUser.lastName}`
              : 'Unknown'
            const lastTime = c.lastMessage?.createdAt ? timeAgo(c.lastMessage.createdAt) : ''

            return (
              <TouchableOpacity
                style={styles.convoCard}
                onPress={() => setActiveConvo(c)}
                activeOpacity={0.85}
              >
                <View style={styles.avatarWrap}>
                  {c.otherUser?.avatar ? (
                    <Image
                      source={{ uri: c.otherUser.avatar }}
                      style={styles.convoAvatar}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={[styles.convoAvatar, styles.avatarPlaceholder]}>
                      <Text style={{ fontSize: 22 }}>👤</Text>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={styles.convoTop}>
                    <Text style={styles.convoName}>{name}</Text>
                    <Text style={styles.convoTime}>{lastTime}</Text>
                  </View>
                  <Text style={styles.convoListing} numberOfLines={1}>{c.listingTitle}</Text>
                  <Text
                    style={[styles.convoLast, c.unreadCount > 0 && styles.convoLastUnread]}
                    numberOfLines={1}
                  >
                    {c.lastMessage?.text ?? 'No messages yet'}
                  </Text>
                </View>
                {c.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{c.unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          }}
          ListEmptyComponent={
            <View style={styles.emptyInbox}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySub}>
                Apply to a sit or accept an applicant to start a conversation
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const C = Colors, S = Shadows
const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: C.cream },
  header:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingBottom: 12 },
  title:             { fontSize: 26, fontWeight: '800', color: C.navy },
  unreadTotal:       { backgroundColor: C.tealPale, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  unreadTotalText:   { fontSize: 13, fontWeight: '600', color: C.tealDark },
  loadingCenter:     { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Conversation card
  convoCard:         { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white, borderRadius: 16, padding: 14, ...S.card },
  avatarWrap:        { position: 'relative' },
  convoAvatar:       { width: 54, height: 54, borderRadius: 27 },
  avatarPlaceholder: { backgroundColor: C.grayPale, alignItems: 'center', justifyContent: 'center' },
  convoTop:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convoName:         { fontSize: 15, fontWeight: '700', color: C.navy },
  convoTime:         { fontSize: 12, color: C.grayLight },
  convoListing:      { fontSize: 12, color: C.teal, fontWeight: '500' },
  convoLast:         { fontSize: 13, color: C.gray },
  convoLastUnread:   { color: C.navy, fontWeight: '600' },
  unreadBadge:       { width: 22, height: 22, borderRadius: 11, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  unreadBadgeText:   { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Empty inbox
  emptyInbox:        { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyEmoji:        { fontSize: 52 },
  emptyTitle:        { fontSize: 20, fontWeight: '700', color: C.navy },
  emptySub:          { fontSize: 14, color: C.gray, textAlign: 'center', maxWidth: 260, lineHeight: 20 },

  // Chat view
  chatHeader:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: C.sand, backgroundColor: C.white },
  back:              { fontSize: 22, color: C.navy, padding: 4 },
  chatAvatar:        { width: 40, height: 40, borderRadius: 20 },
  chatAvatarPlaceholder: { backgroundColor: C.grayPale, alignItems: 'center', justifyContent: 'center' },
  chatName:          { fontSize: 15, fontWeight: '700', color: C.navy },
  chatListing:       { fontSize: 12, color: C.teal },
  messagesList:      { padding: 16, gap: 12, paddingBottom: 20, flexGrow: 1 },
  bubbleWrap:        { gap: 3, maxWidth: '80%', alignSelf: 'flex-start' },
  bubbleWrapMe:      { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble:            { borderRadius: 16, padding: 12 },
  bubbleThem:        { backgroundColor: C.white, borderBottomLeftRadius: 4, ...S.card },
  bubbleMe:          { backgroundColor: C.teal, borderBottomRightRadius: 4 },
  bubbleText:        { fontSize: 15, color: C.navy, lineHeight: 22 },
  bubbleTextMe:      { color: '#fff' },
  bubbleTime:        { fontSize: 11, color: C.grayLight, paddingHorizontal: 4 },
  emptyChat:         { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyChatText:     { fontSize: 14, color: C.gray, textAlign: 'center', lineHeight: 22 },
  inputBar:          { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: C.sand, backgroundColor: C.white },
  msgInput:          { flex: 1, backgroundColor: C.grayPale, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: C.navy, maxHeight: 100 },
  sendBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled:   { backgroundColor: C.grayLight },
  sendBtnText:       { color: '#fff', fontSize: 18, fontWeight: '700' },
})
