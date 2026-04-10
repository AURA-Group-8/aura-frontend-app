import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native'
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

      console.log('🔄 Buscando serviços...')

      const response = await axios.get(`${API_URL}/api/servicos`, {
        headers: authHeaders,
      })

      const servicesData = Array.isArray(response.data) ? response.data : response.data.content || []

      const formattedServices = servicesData.map((service) => ({
        id: service.idServico || service.id,
        name: service.nomeServico || service.name,
        jobName: service.nomeServico || service.name,
        description: service.descricaoServico || service.description || '',
        duration: service.duracao || service.duration || 0,
        minutes: service.duracao || service.duration || 0,
        price: service.preco || service.price || 0,
        value: service.preco || service.price || 0,
      }))

      console.log(`✅ ${formattedServices.length} serviços carregados`)

      setServices(formattedServices)
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

  const handleEditService = (service) => {
    console.log('Editar serviço:', service)
    
    router.push({
      pathname: '/Professional/new-service',
      params: { serviceId: service.id },
    })
  }

  const handleDeleteService = async (serviceId) => {
    try {
      console.log('🔄 Deletando serviço:', serviceId)

      await axios.delete(`${API_URL}/api/servicos/${serviceId}`, {
        headers: authHeaders,
      })

      console.log('✅ Serviço deletado com sucesso')

      // Remove do estado localmente
      setServices((prev) => prev.filter((s) => s.id !== serviceId))
    } catch (err) {
      console.error('❌ Erro ao deletar serviço:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      })
      setError('Erro ao deletar serviço')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color="#281111" />
        </Pressable>
        <Text style={styles.title}>Meus Serviços</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Campo de Pesquisa */}
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

        {/* Botão Novo Serviço */}
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

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#982546" />
            <Text style={styles.loadingText}>Carregando serviços...</Text>
          </View>
        )}

        {/* Error */}
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

        {/* Lista de Serviços */}
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

      <NavbarPro active="Serviços" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3DC',
    paddingTop: 60,
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
})
