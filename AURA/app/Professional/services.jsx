import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, Modal, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'
import { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Platform } from 'react-native'
import axios from 'axios'
import NavbarPro from './_Components/NavbarPro'
import CardJob from './_Components/card-job'

export default function Services() {
  const [services, setServices] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const API_URL = process.env.API_URL || 'http://localhost:8080'
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const router = useRouter()

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync("hidden")
      NavigationBar.setBehaviorAsync("overlay-swipe")
    }
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(`${API_URL}/api/servicos`, {
        headers: authHeaders,
      })

      const servicesData = Array.isArray(response.data) ? response.data : response.data.content || []

      const servicesWithDetails = await Promise.all(
        servicesData.map(async (service) => {
          try {
            const detailResponse = await axios.get(`${API_URL}/api/servicos/${service.id}`, {
              headers: authHeaders,
            })
            
            return {
              id: detailResponse.data.id,
              name: detailResponse.data.name,
              jobName: detailResponse.data.name,
              description: detailResponse.data.description || '',
              duration: detailResponse.data.expectedDurationMinutes || 0,
              minutes: detailResponse.data.expectedDurationMinutes || 0,
              price: detailResponse.data.price || 0,
              value: detailResponse.data.price || 0,
            }
          } catch (err) {
            console.error(`❌ Erro ao buscar detalhes do serviço ${service.id}:`, err)
            
            return {
              id: service.id,
              name: service.name,
              jobName: service.name,
              description: service.description || '',
              duration: 0,
              minutes: 0,
              price: service.price || 0,
              value: service.price || 0,
            }
          }
        })
      )

      
      setServices(servicesWithDetails)
    } catch (err) {
      console.error('❌ Erro ao buscar serviços:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      })
      setError('Erro ao carregar serviços')
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter((service) =>
    (service.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const minutesToHours = (minutes) => {
    return (minutes / 60).toFixed(2)
  }

  const hoursToMinutes = (hours) => {
    return Math.round(parseFloat(hours) * 60)
  }

  const handleEditService = async (service) => {
    try {

      const response = await axios.get(`${API_URL}/api/servicos/${service.id}`, {
        headers: authHeaders,
      })

      const completeService = response.data


      setEditingService(completeService)
      setEditForm({
        name: completeService.name || '',
        description: completeService.description || '',
        duration: String(completeService.expectedDurationMinutes || 0),
        price: String(completeService.price || 0),
      })
      setEditModalOpen(true)
    } catch (err) {
      console.error('❌ Erro ao buscar serviço completo:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      })
      Alert.alert('Erro', 'Falha ao carregar dados do serviço')
    }
  }

  const handleSaveEdit = async () => {
    try {
      if (!editForm.name.trim()) {
        Alert.alert('Validação', 'Nome do serviço é obrigatório')
        return
      }

      if (!editForm.duration || isNaN(editForm.duration)) {
        Alert.alert('Validação', 'Duração deve ser um número válido')
        return
      }

      if (!editForm.price || isNaN(editForm.price)) {
        Alert.alert('Validação', 'Preço deve ser um número válido')
        return
      }

      setIsSaving(true)

      const payload = {
        id: editingService.id,
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        expectedDurationMinutes: parseInt(editForm.duration),
        price: parseFloat(editForm.price),
      }

      console.log('Payload:', payload)

      await axios.patch(`${API_URL}/api/servicos/${editingService.id}`, payload, {
        headers: authHeaders,
      })

      console.log('✅ Serviço atualizado com sucesso')

      const durationInMinutes = parseInt(editForm.duration)

      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                name: editForm.name.trim(),
                jobName: editForm.name.trim(),
                description: editForm.description.trim(),
                duration: durationInMinutes,
                minutes: durationInMinutes,
                price: parseFloat(editForm.price),
                value: parseFloat(editForm.price),
              }
            : s
        )
      )

      setEditModalOpen(false)
      setEditingService(null)
      setEditForm({ name: '', description: '', duration: '', price: '' })

      Alert.alert('Sucesso', 'Serviço atualizado com sucesso')
    } catch (err) {
      console.error('❌ Erro ao atualizar serviço:', err)
      Alert.alert('Erro', 'Falha ao atualizar serviço')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteService = async (serviceId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja deletar este serviço?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              setLoading(true)

              await axios.delete(`${API_URL}/api/servicos/${serviceId}`, {
                headers: authHeaders,
              })

              console.log('✅ Serviço deletado com sucesso')

              setServices((prev) => prev.filter((s) => s.id !== serviceId))

              Alert.alert('Sucesso', 'Serviço deletado com sucesso')
            } catch (err) {
              console.error('❌ Erro ao deletar serviço:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
              })
              Alert.alert('Erro', 'Falha ao deletar serviço')
            } finally {
              setLoading(false)
            }
          },
          style: 'destructive',
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.title}>Meus Serviços</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#B0A8A0"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar serviços..."
            placeholderTextColor="#B0A8A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <Pressable
              onPress={() => setSearchQuery('')}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color="#B0A8A0"
              />
            </Pressable>
          )}
        </View>

        <Pressable
          style={({ pressed, hovered }) => [
            styles.button,
            pressed && styles.buttonPressed,
            hovered && styles.buttonHover,
          ]}
          onPress={() => router.push('/Professional/new-service')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Novo Serviço</Text>
        </Pressable>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#982546" />
            <Text style={styles.loadingText}>Carregando serviços...</Text>
          </View>
        )}

        {error !== '' && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#BE4053" />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={fetchServices}
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </Pressable>
          </View>
        )}

        {!loading && filteredServices.length > 0 ? (
          <View style={styles.servicesContainer}>
            {filteredServices.map((service) => (
              <CardJob
                key={service.id}
                job={service}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
              />
            ))}
          </View>
        ) : (
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="briefcase-outline"
                size={48}
                color="#982546"
              />
              <Text style={styles.emptyText}>
                {searchQuery !== ''
                  ? 'Nenhum serviço encontrado'
                  : 'Nenhum serviço cadastrado'}
              </Text>
              {searchQuery === '' && (
                <Pressable
                  style={styles.createButton}
                  onPress={() => router.push('/Professional/new-service')}
                >
                  <Text style={styles.createButtonText}>Criar Primeiro Serviço</Text>
                </Pressable>
              )}
            </View>
          )
        )}
      </ScrollView>

      <Modal
        visible={editModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Serviço</Text>
              <Pressable onPress={() => setEditModalOpen(false)}>
                <Ionicons name="close" size={24} color="#281111" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalFormContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Nome do Serviço</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Corte + Barba"
                placeholderTextColor="#B0A8A0"
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                editable={!isSaving}
              />

              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descrição do serviço"
                placeholderTextColor="#B0A8A0"
                value={editForm.description}
                onChangeText={(text) => setEditForm({ ...editForm, description: text })}
                multiline
                numberOfLines={3}
                editable={!isSaving}
              />

              <Text style={styles.label}>Duração (minutos)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 30 ou 60"
                placeholderTextColor="#B0A8A0"
                value={editForm.duration}
                onChangeText={(text) => setEditForm({ ...editForm, duration: text })}
                keyboardType="numeric"
                editable={!isSaving}
              />

              <Text style={styles.label}>Preço (R$)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 50.00"
                placeholderTextColor="#B0A8A0"
                value={editForm.price}
                onChangeText={(text) => setEditForm({ ...editForm, price: text })}
                keyboardType="decimal-pad"
                editable={!isSaving}
              />
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.cancelButton, isSaving && styles.buttonDisabled]}
                onPress={() => setEditModalOpen(false)}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.buttonDisabled]}
                onPress={handleSaveEdit}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <NavbarPro active="Serviços" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3DC',
    paddingTop: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#281111',
  },

  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9E2DD',
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#281111',
  },

  button: {
    backgroundColor: '#982546',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  buttonHover: {
    backgroundColor: '#7a1f40',
  },

  buttonPressed: {
    opacity: 0.85,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7A5A52',
  },

  errorContainer: {
    backgroundColor: '#FFE8EC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD4E1',
  },

  errorText: {
    fontSize: 14,
    color: '#BE4053',
    marginTop: 8,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 12,
    backgroundColor: '#BE4053',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },

  servicesContainer: {
    paddingBottom: 20,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#982546',
    textAlign: 'center',
  },

  createButton: {
    marginTop: 20,
    backgroundColor: '#982546',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '85%',
    maxHeight: '80%',
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E2DD',
    paddingBottom: 12,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#281111',
  },

  modalFormContainer: {
    paddingHorizontal: 20,
    maxHeight: '60%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#281111',
    marginTop: 16,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E9E2DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#281111',
    backgroundColor: '#FAFAFA',
  },

  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },

  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9E2DD',
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#E9E2DD',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#281111',
    fontSize: 14,
    fontWeight: '600',
  },

  saveButton: {
    flex: 1,
    backgroundColor: '#982546',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  buttonDisabled: {
    opacity: 0.6,
  },
})
