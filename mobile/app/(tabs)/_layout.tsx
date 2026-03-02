import { Tabs } from 'expo-router'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { Colors } from '@/constants/colors'

function TabIcon({ name, focused, label }: { name: string; focused: boolean; label: string }) {
  const icons: Record<string, string> = {
    search: '🔍',
    'my-sits': '🏡',
    post: '➕',
    inbox: '💬',
    profile: '👤',
  }
  return (
    <View style={styles.tabItem}>
      <View style={[styles.tabIconWrap, name === 'post' && styles.tabIconPost, focused && name !== 'post' && styles.tabIconActive]}>
        <Text style={[styles.tabEmoji, name === 'post' ? { fontSize: 20 } : {}]}>
          {icons[name]}
        </Text>
      </View>
      {name !== 'post' && (
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
      )}
    </View>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} label="Search" />,
        }}
      />
      <Tabs.Screen
        name="my-sits"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="my-sits" focused={focused} label="My Sits" />,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="post" focused={focused} label="Post" />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="inbox" focused={focused} label="Inbox" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} label="Profile" />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.sand,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    backgroundColor: Colors.tealPale,
  },
  tabIconPost: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.teal,
    shadowColor: Colors.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  tabEmoji: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.gray,
  },
  tabLabelActive: {
    color: Colors.teal,
    fontWeight: '600',
  },
})
