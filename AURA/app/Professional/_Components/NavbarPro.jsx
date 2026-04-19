import { View, Pressable, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'

const navItems = [
  { label: 'Agenda', icon: 'calendar-outline', route: '/Professional/schedules-home' },
  { label: 'Serviços', icon: 'briefcase-outline', route: '/Professional/services' },
  { label: 'Finanças', icon: 'wallet-outline', route: '/Professional/finances' },
  { label: 'Clientes', icon: 'people-outline', route: '/Professional/clientScreen' },
  { label: 'Mais', icon: 'menu-outline', route: '/Professional/moreScreen' },
]

export default function NavbarPro({ active = 'Agenda' }) {
  const router = useRouter()

  const handleNavigation = (item) => {
    router.push(item.route)
  }

  return (
    <View style={styles.navbar}>
      {navItems.map((item) => {
        const isActive = active === item.label
        return (
          <Pressable
            key={item.label}
            style={({ pressed }) => [
              styles.navItem,
              pressed && styles.navItemPressed,
            ]}
            onPress={() => handleNavigation(item)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={isActive ? '#5c0f25' : '#982546'}
            />
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  navbar: {
    height: 85,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#982546',
    backgroundColor: '#fff3dc',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemPressed: {
    opacity: 0.7,
  },
  navLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#982546',
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#5c0f25',
  },
})