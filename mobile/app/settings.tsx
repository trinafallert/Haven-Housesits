import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Shadows } from '@/constants/colors'
import { useState } from 'react'

export default function SettingsScreen() {
  const router = useRouter()

  // Notification toggles
  const [newMessage, setNewMessage] = useState(true)
  const [newApplication, setNewApplication] = useState(true)
  const [applicationUpdate, setApplicationUpdate] = useState(true)
  const [reviewReceived, setReviewReceived] = useState(true)
  const [sitReminder, setSitReminder] = useState(true)
  const [promotions, setPromotions] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  // Privacy toggles
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)
  const [profileVisible, setProfileVisible] = useState(true)

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will permanently delete your profile, sits, and messages. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => router.replace('/(auth)/welcome') },
      ]
    )
  }

  const SettingRow = ({
    label,
    desc,
    value,
    onChange,
  }: {
    label: string
    desc?: string
    value: boolean
    onChange: (v: boolean) => void
  }) => (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {desc && <Text style={styles.toggleDesc}>{desc}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: Colors.teal, false: Colors.sand }}
        thumbColor={Colors.white}
      />
    </View>
  )

  const LinkRow = ({
    icon,
    label,
    sub,
    onPress,
    danger,
  }: {
    icon: string
    label: string
    sub?: string
    onPress: () => void
    danger?: boolean
  }) => (
    <TouchableOpacity style={styles.linkRow} onPress={onPress}>
      <Text style={styles.linkIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.linkLabel, danger && { color: Colors.red }]}>{label}</Text>
        {sub && <Text style={styles.linkSub}>{sub}</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Account */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.card}>
          <LinkRow icon="✏️" label="Edit profile" sub="Photo, bio, headline, location" onPress={() => {}} />
          <LinkRow icon="🔑" label="Change password" onPress={() => {}} />
          <LinkRow icon="📧" label="Change email" sub="jordan@email.com" onPress={() => {}} />
          <LinkRow icon="📱" label="Phone number" sub="Add for ID verification" onPress={() => {}} />
          <LinkRow icon="🌐" label="Language" sub="English" onPress={() => {}} />
        </View>

        {/* Membership */}
        <Text style={styles.sectionHeader}>MEMBERSHIP</Text>
        <View style={styles.memberCard}>
          <View style={styles.memberTop}>
            <View>
              <Text style={styles.memberPlan}>Standard Plan</Text>
              <Text style={styles.memberSub}>Free · 3 applications/month · Basic support</Text>
            </View>
            <View style={styles.planBadge}><Text style={styles.planBadgeText}>STANDARD</Text></View>
          </View>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>⚡ Upgrade to Premium — $129/yr</Text>
          </TouchableOpacity>
          <Text style={styles.premiumPerks}>Unlimited applications · Haven Guarantee · 24/7 support · Listing boost · Early access</Text>
        </View>

        {/* Payments */}
        <Text style={styles.sectionHeader}>PAYMENTS</Text>
        <View style={styles.card}>
          <LinkRow icon="💳" label="Payment methods" sub="Add or manage cards" onPress={() => {}} />
          <LinkRow icon="🏦" label="Payout account" sub="Add bank account to receive tips" onPress={() => {}} />
          <LinkRow icon="📄" label="Transaction history" onPress={() => {}} />
          <LinkRow icon="🧾" label="Tax documents" sub="1099-K available for US sitters" onPress={() => {}} />
        </View>

        {/* Notifications */}
        <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
        <View style={styles.card}>
          <SettingRow label="New messages" value={newMessage} onChange={setNewMessage} />
          <SettingRow label="New applications" desc="Someone applied to your listing" value={newApplication} onChange={setNewApplication} />
          <SettingRow label="Application updates" desc="Accepted, declined, or withdrawn" value={applicationUpdate} onChange={setApplicationUpdate} />
          <SettingRow label="Review received" value={reviewReceived} onChange={setReviewReceived} />
          <SettingRow label="Sit reminders" desc="24h before your sit starts" value={sitReminder} onChange={setSitReminder} />
          <SettingRow label="Weekly digest" desc="Sits matching your preferences" value={weeklyDigest} onChange={setWeeklyDigest} />
          <SettingRow label="Promotions & offers" value={promotions} onChange={setPromotions} />
        </View>

        {/* Privacy */}
        <Text style={styles.sectionHeader}>PRIVACY</Text>
        <View style={styles.card}>
          <SettingRow label="Show online status" desc="Others can see when you're active" value={showOnlineStatus} onChange={setShowOnlineStatus} />
          <SettingRow label="Public profile" desc="Visible in sitter search results" value={profileVisible} onChange={setProfileVisible} />
          <LinkRow icon="🔒" label="Blocked users" onPress={() => {}} />
          <LinkRow icon="📋" label="Privacy policy" onPress={() => {}} />
          <LinkRow icon="📋" label="Terms of service" onPress={() => {}} />
        </View>

        {/* Support */}
        <Text style={styles.sectionHeader}>SUPPORT</Text>
        <View style={styles.card}>
          <LinkRow icon="❓" label="Help centre" sub="FAQs and guides" onPress={() => {}} />
          <LinkRow icon="💬" label="Contact support" sub="Average reply < 2 hours" onPress={() => {}} />
          <LinkRow icon="🐛" label="Report a bug" onPress={() => {}} />
          <LinkRow icon="⭐" label="Rate the app" onPress={() => {}} />
        </View>

        {/* Danger zone */}
        <Text style={styles.sectionHeader}>ACCOUNT ACTIONS</Text>
        <View style={styles.card}>
          <LinkRow
            icon="⏸️"
            label="Pause account"
            sub="Temporarily hide your profile"
            onPress={() => Alert.alert('Pause account', 'Your profile will be hidden from search results until you reactivate it.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Pause', onPress: () => {} },
            ])}
          />
          <LinkRow
            icon="🗑️"
            label="Delete account"
            sub="Permanently remove your data"
            onPress={handleDeleteAccount}
            danger
          />
        </View>

        {/* App info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Haven Housesits v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2025 Haven Housesits Inc.</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.card },
  backBtnText: { fontSize: 18, color: Colors.navy },
  title: { fontSize: 20, fontWeight: '800', color: Colors.navy },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionHeader: { fontSize: 11, fontWeight: '700', color: Colors.grayLight, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8, marginTop: 16 },
  card: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', marginBottom: 4, ...Shadows.card },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  toggleDesc: { fontSize: 11, color: Colors.gray, marginTop: 1 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  linkIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  linkLabel: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  linkSub: { fontSize: 11, color: Colors.gray, marginTop: 1 },
  chevron: { fontSize: 20, color: Colors.grayLight },
  memberCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 4, ...Shadows.card },
  memberTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  memberPlan: { fontSize: 17, fontWeight: '800', color: Colors.navy, marginBottom: 2 },
  memberSub: { fontSize: 12, color: Colors.gray },
  planBadge: { backgroundColor: Colors.sand, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  planBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.gray, letterSpacing: 0.5 },
  upgradeBtn: { backgroundColor: Colors.navy, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  upgradeBtnText: { fontSize: 14, fontWeight: '800', color: Colors.white },
  premiumPerks: { fontSize: 11, color: Colors.gray, lineHeight: 17, textAlign: 'center' },
  appInfo: { alignItems: 'center', paddingVertical: 16, gap: 4 },
  appInfoText: { fontSize: 11, color: Colors.grayLight },
})
