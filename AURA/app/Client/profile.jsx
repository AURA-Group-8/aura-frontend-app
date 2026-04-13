import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

export default function Profile() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDE8E0" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mais</Text>
      </View>

      <View style={styles.container}>

        {/* Card de perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={32} color="#6B3A3A" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Dra. Amanda Costa</Text>
            <Text style={styles.profileEmail}>brunakarengl@gmail.com</Text>
          </View>
        </View>

        {/* Card de menu */}
        <View style={styles.menuCard}>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/Client/configuracoes')}
            activeOpacity={0.6}
          >
            <View style={styles.menuLeft}>
              <Feather name="settings" size={22} color="#3D1515" />
              <Text style={styles.menuLabel}>Configurações</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#8C8C8C" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/Client/notificacoes')}
            activeOpacity={0.6}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={22} color="#3D1515" />
              <Text style={styles.menuLabel}>Notificações</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#8C8C8C" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.replace('/login')}
            activeOpacity={0.6}
          >
            <View style={styles.menuLeft}>
              <AntDesign name="logout" size={22} color="#C0392B" />
              <Text style={styles.menuLabelDanger}>Sair da conta</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#C0392B" />
          </TouchableOpacity>

        </View>

        <Text style={styles.version}>AURA v1.0.0</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EDE8E0',
  },
  header: {
    backgroundColor: '#F5F0EA',
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D8',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3D1515',
    letterSpacing: 0.2,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#FAFAF8',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8E2DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D1515',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8C8C8C',
  },
  menuCard: {
    backgroundColor: '#FAFAF8',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3D1515',
  },
  menuLabelDanger: {
    fontSize: 16,
    fontWeight: '500',
    color: '#C0392B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E0D8',
    marginLeft: 20,
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: '#8C8C8C',
    marginTop: 4,
  },
})