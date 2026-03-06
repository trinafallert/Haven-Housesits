import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Colors, Shadows } from '@/constants/colors'

const MAX_REFS = 4

type Reference = {
  id: string
  name: string
  relationship: string
  email: string
  rating: number
  status: 'AWAITING' | 'CONFIRMED' | 'EMPTY'
}

const MOCK_REFS: Reference[] = [
  { id: '1', name: 'Sarah Mitchell', relationship: 'Former pet owner', email: 'sarah@example.com', rating: 5, status: 'CONFIRMED' },
  { id: '2', name: 'James Torres',   relationship: 'Neighbour',         email: 'james@example.com', rating: 4, status: 'AWAITING' },
  { id: '3', name: '', relationship: '', email: '', rating: 0, status: 'EMPTY' },
  { id: '4', name: '', relationship: '', email: '', rating: 0, status: 'EMPTY' },
]

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
      {[1,2,3,4,5].map(i => (
        <Text key={i} style={{ fontSize: 16, color: i <= rating ? '#F59E0B' : Colors.sand }}>★</Text>
      ))}
    </View>
  )
}

export default function EditReferencesScreen() {
  const router = useRouter()
  const [refs, setRefs] = useState(MOCK_REFS)
  const [modalVisible, setModalVisible] = useState(false)
  const [editRef, setEditRef] = useState<Partial<Reference>>({})

  const openRequest = () => {
    setEditRef({})
    setModalVisible(true)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>References</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>
          Add up to 4 personal references. They'll receive an email to confirm your reference. ✦
        </Text>

        {refs.map((ref, i) => (
          <View key={ref.id} style={styles.refCard}>
            {ref.status === 'EMPTY' ? (
              <TouchableOpacity style={styles.emptySlot} onPress={openRequest}>
                <View style={styles.emptyCircle}>
                  <Text style={styles.emptyPlus}>+</Text>
                </View>
                <Text style={styles.emptyLabel}>Request a reference</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.refContent}>
                <View style={styles.refLeft}>
                  <View style={styles.refAvatar}>
                    <Text style={{ fontSize: 22 }}>👤</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.refName}>{ref.name}</Text>
                    <Text style={styles.refRel}>{ref.relationship}</Text>
                    {ref.status === 'CONFIRMED' && <StarRow rating={ref.rating} />}
                  </View>
                </View>
                <View style={[styles.statusPill, ref.status === 'CONFIRMED' ? styles.confirmedPill : styles.awaitingPill]}>
                  <Text style={[styles.statusText, ref.status === 'CONFIRMED' ? styles.confirmedText : styles.awaitingText]}>
                    {ref.status === 'CONFIRMED' ? '✓ Confirmed' : '⏳ Awaiting'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 References are shown on your public profile and help owners feel confident choosing you.
          </Text>
        </View>
      </ScrollView>

      {/* Request reference modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Request a reference</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.modalSubtitle}>
              We'll email them a link to leave you a reference on Haven.
            </Text>
            {[
              { label: 'Their name', placeholder: 'Full name', key: 'name' },
              { label: 'Relationship', placeholder: 'e.g. Former pet owner, Neighbour', key: 'relationship' },
              { label: 'Their email', placeholder: 'email@example.com', key: 'email' },
            ].map(field => (
              <View key={field.key} style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.grayLight}
                  onChangeText={v => setEditRef(r => ({ ...r, [field.key]: v }))}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.sendBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.sendBtnText}>Send request</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Colors.cream },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  backBtn:          { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:         { fontSize: 22, color: Colors.navy },
  headerTitle:      { fontSize: 18, fontWeight: '700', color: Colors.navy },
  scroll:           { padding: 20, gap: 12 },
  subtitle:         { fontSize: 14, color: Colors.gray, lineHeight: 20, marginBottom: 8 },
  refCard:          { backgroundColor: Colors.white, borderRadius: 16, padding: 16, ...Shadows.card },
  emptySlot:        { flexDirection: 'row', alignItems: 'center', gap: 14 },
  emptyCircle:      { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: Colors.teal, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  emptyPlus:        { fontSize: 22, color: Colors.teal, fontWeight: '300' },
  emptyLabel:       { fontSize: 15, color: Colors.teal, fontWeight: '600' },
  refContent:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  refLeft:          { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  refAvatar:        { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  refName:          { fontSize: 15, fontWeight: '700', color: Colors.navy },
  refRel:           { fontSize: 13, color: Colors.gray, marginTop: 2 },
  statusPill:       { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  confirmedPill:    { backgroundColor: '#D1FAE5' },
  awaitingPill:     { backgroundColor: Colors.grayPale },
  statusText:       { fontSize: 12, fontWeight: '700' },
  confirmedText:    { color: '#065F46' },
  awaitingText:     { color: Colors.gray },
  infoBox:          { backgroundColor: Colors.tealPale, borderRadius: 14, padding: 14, marginTop: 8 },
  infoText:         { fontSize: 13, color: Colors.tealDark, lineHeight: 18 },
  // modal
  modalSafe:        { flex: 1, backgroundColor: Colors.white },
  modalHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  modalTitle:       { fontSize: 18, fontWeight: '700', color: Colors.navy },
  modalClose:       { fontSize: 18, color: Colors.gray, padding: 4 },
  modalScroll:      { padding: 20, gap: 16 },
  modalSubtitle:    { fontSize: 14, color: Colors.gray, lineHeight: 20 },
  fieldWrap:        { gap: 6 },
  fieldLabel:       { fontSize: 14, fontWeight: '600', color: Colors.navy },
  fieldInput:       { backgroundColor: Colors.grayPale, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.navy, borderWidth: 1, borderColor: Colors.sand },
  modalFooter:      { padding: 20, borderTopWidth: 1, borderTopColor: Colors.sand },
  sendBtn:          { backgroundColor: Colors.teal, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  sendBtnText:      { color: Colors.white, fontSize: 16, fontWeight: '700' },
})
