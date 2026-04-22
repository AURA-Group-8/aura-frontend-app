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
  const [clientes, setClientes] = useState([])
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
      
      const response = await axios.get(`${API_URL}/api/usuarios`, {
        headers: authHeadersRef.current,
      })

      setClientes(response.data) 
      
    } catch (err) {
      console.error('❌ Erro ao buscar clientes:', err)
      setError('Não foi possível carregar a lista de clientes.')
      Alert.alert("Erro", "Falha ao conectar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>

      <View style={styles.containerGeneral}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar cliente..."
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={fetchClientes}>
            <Ionicons name="refresh" size={18} color="#7a4b4b" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={clientes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Feather name="message-circle" size={18} color="#7a4b4b" />
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
              ListEmptyComponent={() => {
                return (
                  <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum usuário cadastrado.</Text>
                )
              }}
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
    height: 40
  },
  sendButton: {
    padding: 6
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
  }
})