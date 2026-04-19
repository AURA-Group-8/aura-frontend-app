import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const notificacoes = [
  {
    id: '1',
    tipo: 'agendamento',
    titulo: 'Novo agendamento',
    descricao:
      'Maria Silva agendou Design de Sobrancelhas para 04/02 às 09:00',
    tempo: 'há cerca de 1 ano',
    lida: false,
  },
  {
    id: '2',
    tipo: 'cancelado',
    titulo: 'Agendamento cancelado',
    descricao:
      'Julia Mendes cancelou o atendimento de 03/02',
    tempo: 'há cerca de 1 ano',
    lida: false,
  },
  {
    id: '3',
    tipo: 'lembrete',
    titulo: 'Lembrete',
    descricao:
      'Você tem 3 atendimentos agendados para amanhã',
    tempo: 'há cerca de 1 ano',
    lida: true,
  },
  {
    id: '4',
    tipo: 'feedback',
    titulo: 'Feedback recebido',
    descricao:
      'Ana Santos avaliou seu atendimento com 5 estrelas!',
    tempo: 'há cerca de 1 ano',
    lida: true,
  },
]

export default function NotificacoesScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/Professional/moreScreen')}>
          <Feather name="arrow-left" size={20} color="#5c3b3b" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <TouchableOpacity>
          <Text style={styles.markAll}>Marcar todas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              !item.lida && styles.unreadCard
            ]}
          >
            <View style={styles.row}>
              
              <View style={styles.icon}>
                {item.tipo === 'agendamento' && (
                  <Feather name="calendar" size={18} color="#2ecc71" />
                )}
                {item.tipo === 'cancelado' && (
                  <Feather name="x-circle" size={18} color="#e74c3c" />
                )}
                {item.tipo === 'lembrete' && (
                  <Feather name="bell" size={18} color="#3498db" />
                )}
                {item.tipo === 'feedback' && (
                  <Feather name="star" size={18} color="#f39c12" />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <Text style={styles.description}>
                  {item.descricao}
                </Text>
                <Text style={styles.time}>{item.tempo}</Text>
              </View>

              {!item.lida && <View style={styles.dot} />}
            </View>
          </View>
        )}
      />
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