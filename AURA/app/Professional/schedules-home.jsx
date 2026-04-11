import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';
import axios from 'axios';
import NavbarPro from './_Components/NavbarPro';
import CardSchedule from './_Components/card-schedule';

export default function Schedules() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [direction, setDirection] = useState('ASC');
  const [filterType, setFilterType] = useState('todos') 
  const API_URL = process.env.API_URL || 'http://localhost:8080';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
    getSchedules();
  }, [page, size, sortBy, direction]);

  const router = useRouter();

  async function updateSchedule(scheduleId, updatedFields) {
    try {
      if (!scheduleId) {
        throw new Error('ID do agendamento não informado')
      }

      if (!updatedFields || Object.keys(updatedFields).length === 0) {
        throw new Error('Nenhum campo para atualizar informado')
      }

      const payload = {
        id: scheduleId,
      }

      if (updatedFields.status) {
        payload.status = updatedFields.status.toUpperCase()
      }
      if (updatedFields.paymentStatus) {
        payload.paymentStatus = updatedFields.paymentStatus.toUpperCase()
      }


      const response = await axios.patch(
        `${API_URL}/api/agendamentos/${scheduleId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        }
      )

      console.log(`✅ Agendamento atualizado com sucesso`)

      setAgendamentos((prev) =>
        prev.map((schedule) =>
          schedule.id === scheduleId
            ? {
                ...schedule,
                status: updatedFields.status?.toUpperCase() || schedule.status,
                paymentStatus: updatedFields.paymentStatus?.toUpperCase() || schedule.paymentStatus,
              }
            : schedule
        )
      )

      return response.data
    } catch (error) {
      console.error('❌ Erro ao atualizar agendamento:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      })
      throw error
    }
  }

  async function cancelSchedule(scheduleId, mensagem) {
    try {
      
      if (!scheduleId) {
        throw new Error('ID do agendamento não informado')
      }
      
      if (!mensagem || mensagem.trim() === '') {
        throw new Error('Motivo do cancelamento é obrigatório')
      }

      if (!token) {
        throw new Error('Token de autenticação não encontrado')
      }
      
      const response = await axios.delete(`${API_URL}/api/agendamentos/${scheduleId}`, {
        headers: authHeaders,
        params: {
          message: mensagem.trim(),
        },
      })
      
      console.log('✅ Agendamento deletado com sucesso')

      setAgendamentos((prev) =>
        prev.filter((schedule) => schedule.id !== scheduleId)
      )

      return response.data
    } catch (error) {
      console.error('❌ Erro ao deletar agendamento:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      })
      throw error
    }
  }

  async function getSchedules() {
    try {
     
      const response = await axios.get(`${API_URL}/api/agendamentos/card`, {
        headers: authHeaders,
        params: {
          page,
          size,
          sortBy,
          direction,
        },
      });

      const responseData = response.data;
      const content = Array.isArray(responseData.content)
        ? responseData.content
        : Array.isArray(responseData)
          ? responseData
          : [];

      const formattedSchedules = content.map((agendamento) => ({
        id: agendamento.idScheduling,
        userName: agendamento.userName,
        jobsNames: agendamento.jobsNames,
        startDatetime: agendamento.startDatetime,
        endDatetime: agendamento.endDatetime,
        status: agendamento.status,
        paymentStatus: agendamento.paymentStatus,
        totalPrice: agendamento.totalPrice,
        feedback: agendamento.feedback,
      }));

      const sortedSchedules = formattedSchedules.sort((a, b) => {
        const aIsPending = a.status === 'PENDENTE'
        const bIsPending = b.status === 'PENDENTE'
        
        if (aIsPending !== bIsPending) {
          return aIsPending ? -1 : 1
        }

        const aDate = new Date(a.startDatetime || 0)
        const bDate = new Date(b.startDatetime || 0)
        
        return aDate - bDate
      })

    
      setAgendamentos(sortedSchedules);
      setTotalPages(responseData.totalPages ?? 1);
      setTotalItems(responseData.totalElements ?? content.length);
      setPage(responseData.page ?? responseData.pageNumber ?? page);
      setSize(responseData.size ?? responseData.pageSize ?? size);
    }
    catch (error) {
      console.error('❌ Erro ao buscar agendamentos:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      setAgendamentos([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  }

  const getFilteredSchedules = () => {
    if (filterType === 'todos') {
      return agendamentos
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + 7)
    endOfWeek.setHours(23, 59, 59, 999)

    const endOfMonth = new Date(today)
    endOfMonth.setMonth(today.getMonth() + 1)
    endOfMonth.setDate(0)
    endOfMonth.setHours(23, 59, 59, 999)

    return agendamentos.filter((sch) => {
      const schedDate = new Date(sch.startDatetime || 0)

      if (filterType === 'hoje') {
        return schedDate >= today && schedDate <= endOfToday
      }

      if (filterType === 'semana') {
        return schedDate >= today && schedDate <= endOfWeek
      }

      if (filterType === 'mês') {
        return schedDate >= today && schedDate <= endOfMonth
      }

      return true
    })
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/Auth/login')}>
          <Ionicons name="chevron-back" size={30} color="#281111" />
        </Pressable>
        <Text style={styles.title}>Meus Agendamentos</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.filterContainer}>
          <Pressable
            style={[
              styles.filterButton,
              filterType === 'todos' && styles.filterButtonActive
            ]}
            onPress={() => setFilterType('todos')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'todos' && styles.filterButtonTextActive
            ]}>
              Todos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filterType === 'hoje' && styles.filterButtonActive
            ]}
            onPress={() => setFilterType('hoje')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'hoje' && styles.filterButtonTextActive
            ]}>
              Hoje
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filterType === 'semana' && styles.filterButtonActive
            ]}
            onPress={() => setFilterType('semana')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'semana' && styles.filterButtonTextActive
            ]}>
              Semana
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              filterType === 'mês' && styles.filterButtonActive
            ]}
            onPress={() => setFilterType('mês')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'mês' && styles.filterButtonTextActive
            ]}>
              Mês
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed, hovered }) => [
            styles.button,
            pressed && styles.buttonPressed,
            hovered && styles.buttonHover,
          ]}
          onPress={() => router.push('/Professional/new-schedule')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Novo Agendamento</Text>
        </Pressable>

        {getFilteredSchedules().length > 0 ? (
          getFilteredSchedules().map((item) => (
            <CardSchedule 
              key={item.id} 
              schedule={item}
              showActions={
                !['FEITO', 'CANCELADO'].includes(
                  String(item.status).trim().toUpperCase()
                )}
              onCancelSchedule={cancelSchedule}
              onUpdateSchedule={updateSchedule}
              onRefresh={getSchedules}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color="#982546" />
            <Text style={styles.emptyText}>Sem agendamentos neste período</Text>
          </View>
        )}

        <View style={styles.paginationContainer}>
          <Pressable
            style={[styles.pageButton, page <= 0 && styles.pageButtonDisabled]}
            disabled={page <= 0}
            onPress={() => setPage((current) => Math.max(0, current - 1))}
          >
            <Text style={styles.pageButtonText}>Anterior</Text>
          </Pressable>

          <Text style={styles.pageInfo}>
            Página {page + 1} de {totalPages}
          </Text>

          <Pressable
            style={[styles.pageButton, page >= totalPages - 1 && styles.pageButtonDisabled]}
            disabled={page >= totalPages - 1}
            onPress={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
          >
            <Text style={styles.pageButtonText}>Próxima</Text>
          </Pressable>
        </View>
      </ScrollView>

      <NavbarPro active="Agenda" />

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF3DC',
    paddingTop: 20
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
    paddingHorizontal: 20
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1C1B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },

  filterButtonActive: {
    backgroundColor: '#982546',
    borderColor: '#982546',
  },

  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A5A52',
  },

  filterButtonTextActive: {
    color: '#FFFFFF',
  },

  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#982546'
  },

  servico: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  info: {
    marginTop: 6,
    color: '#555'
  },

  valor: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#982546'
  },

  status: {
    marginTop: 8,
    fontWeight: 'bold',
  },

  statusConcluido: {
    color: 'green',
  },

  statusPendente: {
    color: 'red',
  },

  emptyCard: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#982546',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },

  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#982546',
    textAlign: 'center',
  },

  navbar: {
    height: 70,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#982546',
    backgroundColor: '#fff3dc',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 12,
  },

  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25
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

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  pageButton: {
    backgroundColor: '#982546',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },

  pageButtonDisabled: {
    backgroundColor: '#c49a98',
  },

  pageButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  pageInfo: {
    color: '#281111',
    fontWeight: '700',
  }
});