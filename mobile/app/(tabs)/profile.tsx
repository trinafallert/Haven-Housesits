import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Colors, Shadows } from '@/constants/colors'
import { useState } from 'react'
import { useProfile, useLogout } from '@/src/hooks'

const EDIT_SECTIONS = [
  { href: '/profile/edit-profile',       icon: '👤', label: 'Profile details',   desc: 'Name, photo, bio, headline' },
  { href: '/profile/edit-experience',    icon: '🐾', label: 'Experience & pets', desc: 'Years, skills, pets cared for' },
  { href: '/profile/edit-preferences',   icon: '⚙️', label: 'Preferences',       desc: 'Home types, countries, animals' },
  { href: '/profile/edit-availability',  icon: '📅', label: 'Availability',       desc: 'Add available date ranges' },
  { href: '/profile/edit-verification',  icon: '🛡️', label: 'Verification',       desc: 'ID check & background check' },
  { href: '/profile/edit-references',    icon: '⭐', label: 'References',         desc: 'Up to 4 personal references' },
]

function calcCompleteness(p: any): number {
  const checks = [
    !!p.firstName, !!p.lastName, !!p.avatar, !!p.tagline, !!p.bio,
    !!p.city, p.idVerified, p.backgroundCheckStatus === 'APPROVED',
    (p.totalReviews ?? 0) > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export default function ProfileScreen() {
  const router = useRouter()
  const [isOwnerMode, setIsOwnerMode] = useState(false)

  const { data, isLoading } = useProfile()
  const logoutMutation = useLogout()

  const user = data?.profile

  const handleSignOut = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.replace('/(auth)/welcome'),
    })
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </SafeAreaView>
    )
  }

  const completeness = user ? calcCompleteness(user) : 0
  const planLabel = user?.membershipPlan === 'PREMIUM' ? 'Premium ⚡' : 'Standard'
  const planColor = user?.membershipPlan === 'PREMIUM' ? '#F59E0B' : '#92400E'
  const planBg    = user?.membershipPlan === 'PREMIUM' ? '#FEF9C3' : '#FEF3C7'

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{isOwnerMode ? '🏠 Owner Mode' : '🐾 Sitter Mode'}</Text>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Mode switcher */}
        <View style={styles.modeSwitcher}>
          <Text style={[styles.modeLabel, !isOwnerMode && styles.modeLabelActive]}>🐾 Sitter</Text>
          <Switch
            value={isOwnerMode}
            onValueChange={setIsOwnerMode}
            trackColor={{ false: Colors.teal, true: Colors.navy }}
            thumbColor={Colors.white}
          />
          <Text style={[styles.modeLabel, isOwnerMode && styles.modeLabelActive]}>🏠 Owner</Text>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={{ fontSize: 36 }}>👤</Text>
              </View>
            )}
            {user?.idVerified && (
              <View style={styles.verifiedDot}>
                <Text style={{ fontSize: 10 }}>✓</Text>
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {user ? `${user.firstName} ${user.lastName}` : '—'}
            </Text>
            {user?.tagline ? (
              <Text style={styles.headline} numberOfLines={2}>{user.tagline}</Text>
            ) : null}
            {user?.city && (
              <Text style={styles.location}>📍 {user.city}{user.state ? `, ${user.state}` : ''}</Text>
            )}
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>
                {user?.averageRating ? user.averageRating.toFixed(1) : '—'}
              </Text>
              <Text style={styles.statLab}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{user?.totalSits ?? 0}</Text>
              <Text style={styles.statLab}>Sits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{user?.totalReviews ?? 0}</Text>
              <Text style={styles.statLab}>Reviews</Text>
            </View>
          </View>

          {/* Verification chips */}
          <View style={styles.chips}>
            {user?.idVerified && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>ID Verified ✓</Text>
              </View>
            )}
            {user?.backgroundCheckStatus === 'APPROVED' && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>Background Check ✓</Text>
              </View>
            )}
            <View style={[styles.chip, { backgroundColor: planBg }]}>
              <Text style={[styles.chipText, { color: planColor }]}>⭐ {planLabel}</Text>
            </View>
          </View>

          {/* Profile completeness */}
          <View style={styles.completeWrap}>
            <View style={styles.completeHeader}>
              <Text style={styles.completeLab}>Profile completeness</Text>
              <Text style={styles.completeVal}>{completeness}%</Text>
            </View>
            <View style={styles.completeBar}>
              <View style={[styles.completeFill, { width: `${completeness}%` as any }]} />
            </View>
          </View>

          {/* View public profile */}
          <TouchableOpacity
            style={styles.viewProfileBtn}
            onPress={() => user && router.push(`/profile/${user.id}`)}
          >
            <Text style={styles.viewProfileText}>View my public profile →</Text>
          </TouchableOpacity>
        </View>

        {/* Edit sections */}
        <Text style={styles.sectionHeader}>Edit profile</Text>
        <View style={styles.editList}>
          {EDIT_SECTIONS.map((s, i) => (
            <TouchableOpacity
              key={s.href}
              style={[styles.editRow, i === EDIT_SECTIONS.length - 1 && styles.editRowLast]}
              onPress={() => router.push(s.href as any)}
            >
              <View style={styles.editIcon}>
                <Text style={{ fontSize: 18 }}>{s.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.editLabel}>{s.label}</Text>
                <Text style={styles.editDesc}>{s.desc}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upgrade banner (only for non-premium) */}
        {user?.membershipPlan !== 'PREMIUM' && (
          <TouchableOpacity style={styles.upgradeBanner}>
            <Text style={styles.upgradeEmoji}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
              <Text style={styles.upgradeSub}>$129/yr · Haven Guarantee + 24/7 support + listing boost</Text>
            </View>
            <Text style={styles.upgradeArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending
            ? <ActivityIndicator color={Colors.red} />
            : <Text style={styles.signOutText}>Sign out</Text>
          }
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Colors.cream },
  scroll:           { paddingHorizontal: 20, paddingBottom: 40 },
  header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom: 16 },
  title:            { fontSize: 26, fontWeight: '800', color: Colors.navy, letterSpacing: -0.5 },
  settingsBtn:      { padding: 8 },
  modeSwitcher:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 14, padding: 12, marginBottom: 20, ...Shadows.card },
  modeLabel:        { fontSize: 15, fontWeight: '600', color: Colors.grayLight },
  modeLabelActive:  { color: Colors.navy },
  profileCard:      { backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 24, ...Shadows.card },
  avatarWrap:       { position: 'relative', width: 80, height: 80, marginBottom: 12 },
  avatar:           { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: { backgroundColor: Colors.grayPale, alignItems: 'center', justifyContent: 'center' },
  verifiedDot:      { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.teal, borderWidth: 2, borderColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  profileInfo:      { marginBottom: 16 },
  name:             { fontSize: 22, fontWeight: '800', color: Colors.navy, marginBottom: 4 },
  headline:         { fontSize: 14, color: Colors.gray, lineHeight: 20, marginBottom: 4 },
  location:         { fontSize: 13, color: Colors.grayLight },
  statsRow:         { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.sand, marginBottom: 14 },
  stat:             { alignItems: 'center' },
  statVal:          { fontSize: 22, fontWeight: '800', color: Colors.navy },
  statLab:          { fontSize: 11, color: Colors.gray, marginTop: 2 },
  statDivider:      { width: 1, backgroundColor: Colors.sand },
  chips:            { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  chip:             { backgroundColor: Colors.tealPale, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  chipText:         { fontSize: 11, fontWeight: '700', color: Colors.tealDark },
  completeWrap:     { marginBottom: 14 },
  completeHeader:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  completeLab:      { fontSize: 12, color: Colors.gray },
  completeVal:      { fontSize: 12, fontWeight: '700', color: Colors.teal },
  completeBar:      { height: 6, backgroundColor: Colors.sand, borderRadius: 4, overflow: 'hidden' },
  completeFill:     { height: '100%', backgroundColor: Colors.teal, borderRadius: 4 },
  viewProfileBtn:   { alignItems: 'center', paddingTop: 4 },
  viewProfileText:  { fontSize: 14, fontWeight: '600', color: Colors.teal },
  sectionHeader:    { fontSize: 12, fontWeight: '700', color: Colors.grayLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  editList:         { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16, ...Shadows.card },
  editRow:          { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  editRowLast:      { borderBottomWidth: 0 },
  editIcon:         { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.tealPale, alignItems: 'center', justifyContent: 'center' },
  editLabel:        { fontSize: 14, fontWeight: '700', color: Colors.navy },
  editDesc:         { fontSize: 12, color: Colors.gray, marginTop: 1 },
  chevron:          { fontSize: 20, color: Colors.grayLight },
  upgradeBanner:    { backgroundColor: Colors.navy, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  upgradeEmoji:     { fontSize: 24 },
  upgradeTitle:     { fontSize: 15, fontWeight: '700', color: Colors.white, marginBottom: 2 },
  upgradeSub:       { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  upgradeArrow:     { fontSize: 22, color: Colors.tealLight },
  signOutBtn:       { paddingVertical: 14, alignItems: 'center' },
  signOutText:      { fontSize: 15, fontWeight: '600', color: Colors.red },
})
