import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import axios from 'axios'
import CardPopUp from './_Components/card-popUp'

export default function NewService() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  })
  const [loading, setLoading] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupType, setPopupType] = useState('success')
  const [popupMessage, setPopupMessage] = useState('')

  const API_URL = process.env.API_URL || 'http://localhost:8080'
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const handleChangeForm = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setPopupType('error')
      setPopupMessage('Nome do serviço é obrigatório')
      setPopupVisible(true)
      return false
    }

    if (!formData.description.trim()) {
      setPopupType('error')
      setPopupMessage('Descrição é obrigatória')
      setPopupVisible(true)
      return false
    }

    if (!formData.duration || isNaN(formData.duration) || parseInt(formData.duration) <= 0) {
      setPopupType('error')
      setPopupMessage('Duração deve ser um número válido maior que 0')
      setPopupVisible(true)
      return false
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setPopupType('error')
      setPopupMessage('Preço deve ser um número válido maior que 0')
      setPopupVisible(true)
      return false
    }

    return true
  }

  const handleAddService = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      console.log('🔄 Criando novo serviço...')

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        expectedDurationMinutes: parseInt(formData.duration),
        price: parseFloat(formData.price),
      }

      console.log('Payload:', payload)

      const response = await axios.post(`${API_URL}/api/servicos`, payload, {
        headers: authHeaders,
      })

      console.log('✅ Serviço criado com sucesso:', response.data)

      setPopupType('success')
      setPopupMessage('Serviço adicionado com sucesso!')
      setPopupVisible(true)

      router.back()

      setFormData({
        name: '',
        description: '',
        duration: '',
        price: '',
      })
    } catch (err) {
      console.error('❌ Erro ao criar serviço:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      })
      setPopupType('error')
      setPopupMessage('Falha ao adicionar serviço. Tente novamente.')
      setPopupVisible(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <CardPopUp
        visible={popupVisible}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
        duration={popupType === 'success' ? 2000 : 3000}
      />

      <Modal
        visible={true}
        transparent
        animationType="fade"
        onRequestClose={() => router.back()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Serviço</Text>
              <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#281111" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Nome do serviço *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Design de Sobrancelhas"
                placeholderTextColor="#B0A8A0"
                value={formData.name}
                onChangeText={(text) => handleChangeForm('name', text)}
                editable={!loading}
              />

              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva o serviço..."
                placeholderTextColor="#B0A8A0"
                value={formData.description}
                onChangeText={(text) => handleChangeForm('description', text)}
                multiline
                numberOfLines={4}
                editable={!loading}
              />

              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Duração (min) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="30"
                    placeholderTextColor="#B0A8A0"
                    value={formData.duration}
                    onChangeText={(text) => handleChangeForm('duration', text)}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Preço (R$) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#B0A8A0"
                    value={formData.price}
                    onChangeText={(text) => handleChangeForm('price', text)}
                    keyboardType="decimal-pad"
                    editable={!loading}
                  />
                </View>
              </View>

              <Text style={styles.requiredNote}>* Campos obrigatórios</Text>
            </ScrollView>

            <Pressable
              style={({ pressed, hovered }) => [
                styles.addButton,
                (pressed || hovered) && styles.addButtonHover,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleAddService}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContent}>
                  <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.addButtonText}>Carregando...</Text>
                </View>
              ) : (
                <Text style={styles.addButtonText}>Adicionar Serviço</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E2DD',
    paddingBottom: 16,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#281111',
  },

  closeButton: {
    padding: 8,
  },

  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#281111',
    marginTop: 16,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#A8574B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#281111',
    backgroundColor: '#FAFAFA',
  },

  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },

  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },

  halfWidth: {
    flex: 1,
  },

  requiredNote: {
    fontSize: 12,
    color: '#7A5A52',
    marginTop: 16,
    marginBottom: 20,
    fontStyle: 'italic',
  },

  addButton: {
    backgroundColor: '#982546',
    marginHorizontal: 24,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  },

  addButtonHover: {
    backgroundColor: '#7a1f40',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.6,
  },
})
