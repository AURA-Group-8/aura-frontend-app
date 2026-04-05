import { View, Pressable, Text, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

const navItems = [
  { label: 'Agenda', icon: 'calendar-outline' },
  { label: 'Serviços', icon: 'briefcase-outline' },
  { label: 'Finanças', icon: 'wallet-outline' },
  { label: 'Clientes', icon: 'people-outline' },
  { label: 'Mais', icon: 'menu-outline' },
]

export default function NavbarPro({ active = 'Agenda', onPress = () => {} }) {
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
            onPress={() => onPress(item.label)}
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