import React, { useState, useEffect, useCallback } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

export default function ContaTab() {
  const [cnpj, setCnpj] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [loading, setLoading] = useState(true)
  
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('token')
      const userId = await AsyncStorage.getItem('userId')

      if (!userId) return

      const response = await axios.get(`${API_URL}/api/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data) {
        setCnpj(response.data.observation || '')
        setNome(response.data.username || '')
        setTelefone(response.data.phone || '')
      }
    } catch (error) {
      console.error("Erro ao carregar dados da conta:", error)
      Alert.alert("Erro", "Não foi possível carregar as informações.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  async function handleSaveAccount() {
    try {
      const token = await AsyncStorage.getItem('token')
      const userId = await AsyncStorage.getItem('userId')

      const body = {
        username: nome,
        phone: telefone,
        observation: cnpj,
        roleId: 1 
      }

      await axios.patch(`${API_URL}/api/usuarios/${userId}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      })

      Alert.alert("Sucesso", "Informações atualizadas!")
    } catch (error) {
      console.error(error)
      Alert.alert("Erro", "Falha ao salvar informações.")
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5c0f25" />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Informações da Empresa</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CNPJ</Text>
            <TextInput 
              style={styles.input} 
              value={cnpj} 
              onChangeText={setCnpj}
              placeholder="12.345.678/0001-90"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do estabelecimento</Text>
            <TextInput 
              style={styles.input} 
              value={nome} 
              onChangeText={setNome}
              placeholder="Studio AURA Estética"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone comercial</Text>
            <TextInput 
              style={styles.input} 
              value={telefone} 
              onChangeText={setTelefone}
              placeholder="(11) 99999-0000"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: scale(20),
    borderRadius: scale(16),
    width: '100%',
    maxWidth: 500,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: scale(18),
    fontWeight: '700',
    marginBottom: scale(20),
    color: '#333',
  },
  inputGroup: {
    width: '100%',
    marginBottom: scale(15),
  },
  label: {
    fontSize: scale(13),
    color: '#666',
    marginBottom: scale(6),
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#EDE0D4',
    paddingHorizontal: scale(15),
    height: scale(48), 
    borderRadius: scale(10),
    fontSize: scale(15),
    color: '#333',
  },
})