import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import NavbarPro from './_Components/NavbarPro'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ClientesScreen() {
  const [clientes, setClientes] = useState([]) 
  const [filteredClientes, setFilteredClientes] = useState([]) 
  const [searchText, setSearchText] = useState('') 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedClientForNotes, setSelectedClientForNotes] = useState(null)
  const [observationText, setObservationText] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  
  const authHeadersRef = useRef(null)
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        authHeadersRef.current = token ? { Authorization: `Bearer ${token}` } : {}
        await fetchClientes()
      } catch (err) {
        setError('Não foi possível carregar a lista de clientes.')
        Alert.alert("Erro", "Falha ao conectar com o servidor.")
      }
    }
    init()
  }, [])

  useEffect(() => {
    handleFilter()
  }, [searchText, clientes])

  async function fetchClientes() {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(`${API_URL}/api/usuarios`, {
        headers: authHeadersRef.current,
      })

      setClientes(response.data)
      
    } catch (err) {
      setError('Não foi possível carregar a lista de clientes.')
      Alert.alert("Erro", "Falha ao conectar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

 
  const handleFilter = () => {
    if (searchText.trim() === '') {
      setFilteredClientes(clientes) 
      return
    }

    const searchLower = searchText.toLowerCase()
    const filtered = clientes.filter(cliente => 
      (cliente.username && cliente.username.toLowerCase().includes(searchLower)) ||
      (cliente.name && cliente.name.toLowerCase().includes(searchLower)) ||
      (cliente.email && cliente.email.toLowerCase().includes(searchLower))
    )
    setFilteredClientes(filtered)
  }

  const openNotesModal = (cliente) => {
    setSelectedClientForNotes(cliente)
    setObservationText(cliente.observation || '')
    setModalVisible(true)
  }

  const closeNotesModal = () => {
    setModalVisible(false)
    setSelectedClientForNotes(null)
    setObservationText('')
  }

  const saveObservation = async () => {
    if (!selectedClientForNotes) return

    try {
      setSavingNotes(true)
      
      await axios.patch(
        `${API_URL}/api/usuarios/${selectedClientForNotes.id}`,
        { observation: observationText },
        { headers: authHeadersRef.current }
      )

      await fetchClientes()
      closeNotesModal()
      Alert.alert('Sucesso', 'Observação salva com sucesso!')
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar a observação.')
    } finally {
      setSavingNotes(false)
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
            value={searchText}
            onChangeText={setSearchText} 
          />
          
          <TouchableOpacity style={styles.actionButton} onPress={handleFilter}>
            <Ionicons name="search" size={20} color="#7a4b4b" />
          </TouchableOpacity>

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
              data={filteredClientes} 
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              renderItem={({ item }) => {
                return (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.nome}>{item.username}</Text>
                      <TouchableOpacity 
                        onPress={() => openNotesModal(item)}
                        activeOpacity={0.6}
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                      >
                        <Feather name="message-circle" size={20} color="#7a4b4b" />
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

                    {item.observation && item.observation.trim() !== '' && item.observation !== 'string' && (
                      <View style={styles.obsContainer}>
                        <Text style={styles.obsLabel}>Obs.:</Text>
                        <Text style={styles.obsText} numberOfLines={2}>
                          {item.observation}
                        </Text>
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

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeNotesModal}
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Observações - {selectedClientForNotes?.username}
              </Text>
              <TouchableOpacity onPress={closeNotesModal} disabled={savingNotes}>
                <Ionicons name="close" size={24} color="#7a4b4b" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.notesInput}
              placeholder="Digite as observações sobre o cliente..."
              placeholderTextColor="#999"
              multiline={true}
              value={observationText}
              onChangeText={setObservationText}
              editable={!savingNotes}
            />

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeNotesModal}
                disabled={savingNotes}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveObservation}
                disabled={savingNotes}
              >
                {savingNotes ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    textAlign: 'left',
    marginBottom: 16,
    color: '#5c0f25',
    backgroundColor: '#fff3dc',
    height: 60,
    fontSize: 28,
    paddingTop: 15,
    paddingHorizontal: 20,
    marginTop: 40,
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
  obsContainer: {
    marginTop: 12,
    backgroundColor: '#fff9f3',
    padding: 10,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#7a4b4b',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  obsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7a4b4b',
    marginRight: 6,
    textTransform: 'lowercase'
  },
  obsText: {
    fontSize: 13,
    color: '#5c3b3b',
    lineHeight: 18,
    flex: 1
  },
  emptyText: {
    textAlign: 'center', 
    marginTop: 20, 
    color: '#7a4b4b'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c0f25',
    flex: 1
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d4b98f',
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    color: '#281111',
    marginBottom: 20
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 12
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    backgroundColor: '#e8d6c8',
    borderWidth: 1,
    borderColor: '#d4b98f'
  },
  cancelButtonText: {
    color: '#5c0f25',
    fontWeight: '600',
    fontSize: 14
  },
  saveButton: {
    backgroundColor: '#7a4b4b'
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  }
})