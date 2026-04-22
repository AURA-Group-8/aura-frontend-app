import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function NotificationsClient() {
  const router = useRouter()
  const [notificacoes, setNotificacoes] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

  const fetchNotificacoes = useCallback(async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('token')
      const userId = await AsyncStorage.getItem('userId') 

      if (!userId) {
        Alert.alert("Erro", "Usuário não identificado.")
        return
      }

      const response = await axios.get(`${API_URL}/api/notificacoes/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { size: 20, direction: 'DESC' }
      })

      setNotificacoes(response.data.content)
    } catch (error) {
      console.error("Erro ao buscar notificações:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotificacoes()
  }, [fetchNotificacoes])

  async function marcarComoLida(notificationId) {
    try {
      const token = await AsyncStorage.getItem('token')
      
      await axios.patch(`${API_URL}/api/notificacoes/${notificationId}`, 
        { isRead: true },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setNotificacoes(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
    } catch (error) {
      console.error("Erro ao marcar como lida:", error)
    }
  }

  async function marcarTodasComoLidas() {
    const naoLidas = notificacoes.filter(n => !n.isRead)
    if (naoLidas.length === 0) return

    try {
      await Promise.all(naoLidas.map(n => marcarComoLida(n.id)))
      Alert.alert("Sucesso", "Todas as notificações foram marcadas como lidas.")
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar todas as notificações.")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#5c3b3b" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <TouchableOpacity onPress={marcarTodasComoLidas}>
          <Text style={styles.markAll}>Marcar todas</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5c3b3b" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => marcarComoLida(item.id)}
              activeOpacity={0.7}
              style={[
                styles.card,
                !item.isRead && styles.unreadCard
              ]}
            >
              <View style={styles.row}>
                <View style={styles.icon}>
                  <Feather 
                    name={item.type === 'CANCELED' ? 'x-circle' : 'bell'} 
                    size={18} 
                    color={item.type === 'CANCELED' ? '#e74c3c' : '#3498db'} 
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title || "Notificação"}</Text>
                  <Text style={styles.description}>{item.description || item.message}</Text>
                  <Text style={styles.time}>{item.createdAt || 'recentemente'}</Text>
                </View>

                {!item.isRead && <View style={styles.dot} />}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma notificação por enquanto.</Text>}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e8df',
    paddingTop: 15,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5c3b3b',
  },

  markAll: {
    fontSize: 13,
    color: '#7a4b4b',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  unreadCard: {
    backgroundColor: '#e8d6c8',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  icon: {
    marginRight: 10,
    marginTop: 2,
  },

  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#3d2b2b',
  },

  description: {
    fontSize: 13,
    color: '#6b4b4b',
    marginTop: 2,
  },

  time: {
    fontSize: 11,
    color: '#9b8b8b',
    marginTop: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7a4b4b',
    marginLeft: 8,
    marginTop: 6,
  },
})