import { View, Pressable, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router';

export default function Navbar() {

  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <Pressable style={styles.navItem}>
        <AntDesign name="schedule" size={28} color="#982546" />
      </Pressable>

      <Pressable style={styles.navItem} onPress={() => router.replace('/Client/date')}>
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
  height: 70,
  flexDirection: 'row',
  borderTopWidth: 1,
  borderColor: '#982546',
  backgroundColor: '#fff3dc',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderRadius: 12,
},
navItem: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 25
}
})