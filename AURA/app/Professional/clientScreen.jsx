import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import NavbarPro from './_Components/NavbarPro'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ClientesScreen() {
  const [clientes, setClientes] = useState([]) // Lista completa do banco
  const [filteredClientes, setFilteredClientes] = useState([]) // Lista que aparece na tela
  const [searchText, setSearchText] = useState('') // Texto da busca
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const authHeadersRef = useRef(null)
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        authHeadersRef.current = token ? { Authorization: `Bearer ${token}` } : {}
        await fetchClientes()
      } catch (err) {
        console.error("Erro ao iniciar:", err)
      }
    }
    init()
  }, [])

  async function fetchClientes() {
    try {
      setLoading(true)
      setError(null)
      setSearchText('') // Limpa a busca ao recarregar do banco
      
      const response = await axios.get(`${API_URL}/api/usuarios`, {
        headers: authHeadersRef.current,
      })

      setClientes(response.data) 
      setFilteredClientes(response.data) // Inicializa a lista filtrada com todos os dados
      
    } catch (err) {
      console.error('❌ Erro ao buscar clientes:', err)
      setError('Não foi possível carregar a lista de clientes.')
      Alert.alert("Erro", "Falha ao conectar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  // Função para filtrar a lista localmente
  const handleFilter = () => {
    if (searchText.trim() === '') {
      setFilteredClientes(clientes) // Se a busca estiver vazia, mostra todos
      return
    }

    const filtered = clientes.filter(cliente => 
      cliente.username.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredClientes(filtered)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>

      <View style={styles.containerGeneral}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar cliente..."
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText} // Atualiza o texto enquanto digita
          />
          
          {/* Botão de Confirmar Busca */}
          <TouchableOpacity style={styles.actionButton} onPress={handleFilter}>
            <Ionicons name="search" size={20} color="#7a4b4b" />
          </TouchableOpacity>

          {/* Botão de Recarregar do Banco */}
          <TouchableOpacity style={styles.actionButton} onPress={fetchClientes}>
            <Ionicons name="refresh" size={20} color="#7a4b4b" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#7a4b4b" />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={filteredClientes} // Agora usamos a lista filtrada no FlatList
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                return (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.nome}>{item.username}</Text>
                      <TouchableOpacity>
                        <Feather name="message-circle" size={18} color="#7a4b4b" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                      <Feather name="phone" size={14} color="#7a4b4b" />
                      <Text style={styles.text}>{item.phone || 'Sem telefone'}</Text>
                    </View>

                    <View style={styles.row}>
                      <Feather name="calendar" size={14} color="#7a4b4b" />
                      <Text style={styles.text}>
                        {item.dateOfBirth ? item.dateOfBirth.split('-').reverse().join('/') : 'N/A'}
                      </Text>
                    </View>

                    {item.observation && item.observation !== 'string' && (
                      <View style={styles.obs}>
                        <Text style={styles.obsText}>{item.observation}</Text>
                      </View>
                    )}
                  </View>
                )
              }}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
              )}
            />
          </View>
        )}
      </View>

      <NavbarPro active="Clientes" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3dc',
    paddingTop: 1,
    paddingHorizontal: 1
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#5c0f25',
    backgroundColor: '#fff3dc',
    height: 60,
    fontSize: 28,
    paddingTop: 15
  },
  containerGeneral: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8d6c8',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 45
  },
  actionButton: {
    padding: 8,
    marginLeft: 4
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#3d2b2b'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  text: {
    marginLeft: 6,
    color: '#5c3b3b'
  },
  obs: {
    marginTop: 10,
    backgroundColor: '#f1e3d9',
    padding: 8,
    borderRadius: 10
  },
  obsText: {
    fontSize: 12,
    color: '#6b4b4b'
  },
  emptyText: {
    textAlign: 'center', 
    marginTop: 20, 
    color: '#7a4b4b'
  }
})