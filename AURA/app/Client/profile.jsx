import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Pressable, Modal, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Navbar from './_Component/Navbar'
import CardPopUp from './_Component/card-popUp'

export default function Profile() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  })
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupType, setPopupType] = useState('success')
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)
  const authHeadersRef = useRef({})

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Buscar token e userId do AsyncStorage
        const token = await AsyncStorage.getItem('token')
        const userId = await AsyncStorage.getItem('userId')

        if (!token || !userId) {
          setError('Usuário não autenticado')
          return
        }

        authHeadersRef.current = { Authorization: `Bearer ${token}` }

        // Fazer requisição para buscar dados do usuário
        const response = await axios.get(`${API_URL}/api/usuarios/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        setUserData(response.data)
        
        // Preencher formData com os dados recebidos
        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
          password: '••••••••', // Não mostrar senha real
          phone: response.data.phone || ''
        })
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
        setError('Erro ao carregar dados do usuário')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Função para formatar telefone
  const formatPhone = (text) => {
    // Remove todos os caracteres não numéricos
    const cleaned = text.replace(/\D/g, '')
    
    // Aplica a máscara (XX) XXXXX-XXXX
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    
    // Para números parciais
    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
    }
  }

  // Função para fazer signout
  const handleSignOut = async () => {
    try {
      // Limpar dados do AsyncStorage
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('userId')
      
      // Redirecionar para login
      router.replace('/Auth/login')
    } catch (error) {
      console.error('Erro ao fazer signout:', error)
      // Mesmo com erro, tentar redirecionar
      router.replace('/Auth/login')
    }
  }

  const confirmDeleteAccount = () => {
    setDeleteConfirmVisible(true)
  }

  const deleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const userId = await AsyncStorage.getItem('userId')

      if (!token || !userId) {
        setPopupMessage('Usuário não autenticado')
        setPopupType('error')
        setPopupVisible(true)
        return
      }

      await axios.delete(`${API_URL}/api/usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('userId')

      setPopupMessage('Conta excluída com sucesso.')
      setPopupType('success')
      setPopupVisible(true)
      router.replace('/Auth/login')
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
      setPopupMessage('Não foi possível excluir a conta. Tente novamente.')
      setPopupType('error')
      setPopupVisible(true)
    }
  }

  // Função para atualizar dados do usuário
  const updateUserData = async () => {
    try {
      setUpdating(true)
      
      const token = await AsyncStorage.getItem('token')
      const userId = await AsyncStorage.getItem('userId')

      if (!token || !userId) {
        setPopupMessage('Usuário não autenticado')
        setPopupType('error')
        setPopupVisible(true)
        return
      }

      // Preparar dados para envio (remover formatação do telefone)
      const updateData = {
        id: parseInt(userId),
        username: formData.username,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''), // Remove formatação
        roleId: 2
      }

      const response = await axios.patch(`${API_URL}/api/usuarios/${userId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Atualizar dados locais
      setUserData(prev => ({
        ...prev,
        username: formData.username,
        phone: formData.phone.replace(/\D/g, '')
      }))

      setSettingsModalVisible(false)
      setPopupMessage('Dados atualizados com sucesso!')
      setPopupType('success')
      setPopupVisible(true)
      
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
      setPopupMessage('Não foi possível atualizar os dados. Tente novamente.')
      setPopupType('error')
      setPopupVisible(true)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF3DC" />

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
            {loading ? (
              <Text style={styles.loadingText}>Carregando...</Text>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : userData ? (
              <>
                <Text style={styles.profileName}>{userData.username || 'Usuário'}</Text>
                <Text style={styles.profileEmail}>{userData.email || 'email@exemplo.com'}</Text>
              </>
            ) : (
              <>
                <Text style={styles.profileName}>Usuário</Text>
                <Text style={styles.profileEmail}>email@exemplo.com</Text>
              </>
            )}
          </View>
        </View>

        {/* Botão de configurações */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSettingsModalVisible(true)}
          activeOpacity={0.6}
        >
          <View style={styles.settingsLeft}>
            <Ionicons name="settings-outline" size={22} color="#3D1515" />
            <Text style={styles.settingsLabel}>Configurações da conta</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#8C8C8C" />
        </TouchableOpacity>

        {/* Card de menu */}
        <View style={styles.menuCard}>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSignOut}
            activeOpacity={0.6}
          >
            <View style={styles.menuLeft}>
              <AntDesign name="logout" size={22} color="#C0392B" />
              <Text style={styles.menuLabelDanger}>
                Sair da conta
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#C0392B" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItemSubtle}
            onPress={confirmDeleteAccount}
            activeOpacity={0.6}
          >
            <Text style={styles.deleteAccountText}>Excluir conta</Text>
          </TouchableOpacity>

        </View>

      <Modal
        visible={deleteConfirmVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <View style={styles.confirmDeleteOverlay}>
          <View style={styles.confirmDeleteBox}>
            <Text style={styles.confirmDeleteTitle}>Excluir conta</Text>
            <Text style={styles.confirmDeleteText}>
              Tem certeza que deseja excluir sua conta?
            </Text>
            <View style={styles.confirmDeleteButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelBtn]}
                onPress={() => setDeleteConfirmVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteBtn]}
                onPress={() => {
                  setDeleteConfirmVisible(false)
                  deleteAccount()
                }}
              >
                <Text style={styles.deleteBtnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

        
      </View>
      
      {/* Modal de configurações */}
      <Modal
        visible={settingsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurações da conta</Text>
              <Pressable 
                onPress={() => setSettingsModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#3D1515" />
              </Pressable>
            </View>

            <View style={styles.formContainer}>
              {/* Username */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome de usuário</Text>
                <TextInput
                  style={styles.input}
                  value={formData.username}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
                  placeholder="Digite seu nome de usuário"
                  placeholderTextColor="#B0A8A0"
                />
              </View>

              {/* Email (não editável) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={formData.email}
                  editable={false}
                  placeholderTextColor="#B0A8A0"
                />
              </View>

              {/* Senha (não editável) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={formData.password}
                  editable={false}
                  secureTextEntry={true}
                  placeholderTextColor="#B0A8A0"
                />
              </View>

              {/* Telefone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: formatPhone(text) }))}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#B0A8A0"
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelBtn]}
                onPress={() => setSettingsModalVisible(false)}
                disabled={updating}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveBtn, updating && styles.saveBtnDisabled]}
                onPress={updateUserData}
                disabled={updating}
              >
                <Text style={styles.saveBtnText}>
                  {updating ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CardPopUp
        visible={popupVisible}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />

      <View>

          <Navbar />

        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF3DC',
  },
  header: {
    backgroundColor: '#F5F0EA',
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D8',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#281111',
    letterSpacing: 0.2,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: '#D1C1B8',
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
    color: '#281111',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#7A5A52',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#D1C1B8',
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
    color: '#281111',
  },
  menuLabelDanger: {
    fontSize: 16,
    fontWeight: '500',
    color: '#982546',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E0D8',
    marginLeft: 20,
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: '#7A5A52',
    marginTop: 4,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7A5A52',
  },
  errorText: {
    fontSize: 14,
    color: '#982546',
  },
  settingsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#D1C1B8',
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#281111',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#D1C1B8',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#281111',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#281111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1C1B8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#281111',
    backgroundColor: '#FAFAF8',
  },
  inputDisabled: {
    backgroundColor: '#F5F0EA',
    color: '#7A5A52',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#982546',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: '#F5F0EA',
  },
  saveBtnDisabled: {
    backgroundColor: '#D1C1B8',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#281111',
  },
  menuItemSubtle: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  deleteAccountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#982546',
    opacity: 0.8,
  },
  confirmDeleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmDeleteBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#D1C1B8',
  },
  confirmDeleteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#281111',
    marginBottom: 12,
  },
  confirmDeleteText: {
    fontSize: 15,
    color: '#7A5A52',
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmDeleteButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  deleteBtn: {
    backgroundColor: '#F5F0EA',
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#281111',
  },
})