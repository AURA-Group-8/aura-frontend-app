import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState, useRef, useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';
import axios from 'axios';
import CardSchedule from './_Component/card-schedule-client';
import Navbar from './_Component/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function SchedulesClient() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('startDatetime');
  const [direction, setDirection] = useState('DESC');
  const [filterType, setFilterType] = useState('todos')
  const userIdRef = useRef(null);
  const userNameRef = useRef(null);
  const authHeadersRef = useRef({});
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
  const [ready, setReady] = useState(false)
  const PAGE_SIZE = 10; 

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token')
      const userId = await AsyncStorage.getItem('userId')
      const userName = await AsyncStorage.getItem('userName')

      authHeadersRef.current = token ? { Authorization: `Bearer ${token}` } : {}
      userIdRef.current = userId
      userNameRef.current = userName

      setReady(true)
    }

    init()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (ready) {
        if (Platform.OS === 'android') {
          NavigationBar.setVisibilityAsync('hidden').catch((e) => console.log('NavBar error ignored:', e))
        }
        getSchedules()
      }
    }, [ready, page, filterType])
  )

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
            ...authHeadersRef.current,
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

      const isFeitoPago = updatedFields.status?.toUpperCase() === 'FEITO' && updatedFields.paymentStatus?.toUpperCase() === 'PAGO'

      if (isFeitoPago) {
        setTimeout(() => {
          setAgendamentos((prev) =>
            prev.filter((schedule) => schedule.id !== scheduleId)
          )
        }, 20000)
      }

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


      const response = await axios.delete(
        `${API_URL}/api/agendamentos/${scheduleId}`,
        {
          headers: authHeadersRef.current,
          params: {
            message: mensagem.trim(),
          },
        }
      )

      console.log('✅ Agendamento deletado com sucesso')

      setTimeout(() => {
        setAgendamentos((prev) =>
          prev.filter((schedule) => schedule.id !== scheduleId)
        )
      }, 20000)

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
      let allSchedules = [];
      let currentPage = page;
      let hasMorePages = true;
      let backendTotalPages = 1;

      while (allSchedules.length < PAGE_SIZE && hasMorePages) {
        const response = await axios.get(`${API_URL}/api/agendamentos/card`, {
          headers: authHeadersRef.current,
          params: {
            page: currentPage,
            size: PAGE_SIZE,
            sortBy,
            direction,
          },
        });

        const responseData = response.data;
        backendTotalPages = responseData.totalPages ?? 1;
        const content = Array.isArray(responseData.content)
          ? responseData.content
          : Array.isArray(responseData)
            ? responseData
            : [];

        if (content.length === 0) {
          hasMorePages = false;
          break;
        }

        const userSchedules = content.filter((agendamento) =>
          String(agendamento.userName).toLowerCase() === String(userNameRef.current).toLowerCase()
        );

        const formattedSchedules = userSchedules.map((agendamento) => ({
          id: agendamento.idScheduling || agendamento.id,
          userName: agendamento.userName,
          jobsNames: agendamento.jobsNames,
          startDatetime: agendamento.startDatetime,
          endDatetime: agendamento.endDatetime,
          status: agendamento.status,
          paymentStatus: agendamento.paymentStatus,
          totalPrice: agendamento.totalPrice,
          feedback: agendamento.feedback,
        }));

        const validSchedules = formattedSchedules.filter((agendamento) => {
          const status = String(agendamento.status).trim().toUpperCase();
          const paymentStatus = String(agendamento.paymentStatus).trim().toUpperCase();
          
          if (status === 'CANCELADO') return false;
          if (status === 'FEITO' && paymentStatus === 'PAGO') return false;
          
          return true;
        });

        allSchedules = [...allSchedules, ...validSchedules];

        if (allSchedules.length < PAGE_SIZE && currentPage < backendTotalPages - 1) {
          currentPage++;
        } else {
          hasMorePages = false;
        }
      }

      const sortedSchedules = allSchedules.sort((a, b) => {
        const aIsPending = a.status === 'PENDENTE';
        const bIsPending = b.status === 'PENDENTE';

        if (aIsPending !== bIsPending) {
          return aIsPending ? -1 : 1;
        }

        const aDate = new Date(a.startDatetime || 0);
        const bDate = new Date(b.startDatetime || 0);

        return aDate - bDate;
      });

      const totalValid = sortedSchedules.length;
      const calculatedTotalPages = Math.ceil(totalValid / PAGE_SIZE) || 1;

      setAgendamentos(sortedSchedules);
      setTotalPages(calculatedTotalPages);
      setTotalItems(totalValid);
      setSize(PAGE_SIZE);
    } catch (error) {
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

  useEffect(() => {
    const filtered = getFilteredSchedules()
    if (filtered.length === 0 && page > 0 && agendamentos.length > 0) {
      console.log('📄 Página vazia após filtro, voltando para página anterior')
      setPage(page - 1)
    }
  }, [filterType, agendamentos])

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
          onPress={() => router.push('/Client/newScheduleClient')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Novo Agendamento</Text>
        </Pressable>

        {getFilteredSchedules().length > 0 ? (
          getFilteredSchedules().map((item) => (
            <CardSchedule
              key={item.id}
              schedule={item}
              isClient={true}
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
      </ScrollView>

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

      <Navbar />

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
    marginTop: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
    paddingBottom: 20,
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