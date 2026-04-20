import { View, Pressable, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'

export default function Navbar() {

  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <Pressable style={styles.navItem} onPress={() => router.replace('/Client/schedules')}>
        <AntDesign name="schedule" size={28} color="#982546" />
      </Pressable>

      <Pressable style={styles.navItem} onPress={() => router.replace('/Client/newScheduleClient')}>
        <AntDesign name="clock-circle" size={28} color="#982546" />
      </Pressable>

      <Pressable style={styles.navItem} onPress={() => router.replace('/Client/profile')}>
        <Ionicons name="person-outline" size={28} color="#982546" />
      </Pressable>
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