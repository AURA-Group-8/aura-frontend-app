import { View, Pressable, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons, AntDesign } from '@expo/vector-icons'

const navItems = [
  { label: 'Agendamentos', icon: 'schedule', route: '/Client/schedules', iconType: 'AntDesign' },
  { label: 'Histórico', icon: 'clock-circle', route: '/Client/history', iconType: 'AntDesign' },
  { label: 'Localização', icon: 'map-outline', route: '/Client/maps', iconType: 'Ionicons' },
  { label: 'Perfil', icon: 'person-outline', route: '/Client/profile', iconType: 'Ionicons' },
]

export default function Navbar({ active = 'Agendamentos' }) {

  const router = useRouter()

  const handleNavigation = (item) => {
    router.replace(item.route)
  }

  return (
    <View style={styles.navbar}>
      {navItems.map((item) => {
        const isActive = active === item.label
        const IconComponent = item.iconType === 'AntDesign' ? AntDesign : Ionicons
        
        return (
          <Pressable 
            key={item.label} 
            style={styles.navItem} 
            onPress={() => handleNavigation(item)}
          >
            <IconComponent 
              name={item.icon} 
              size={28} 
              color={isActive ? '#5c0f25' : '#982546'} 
            />
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