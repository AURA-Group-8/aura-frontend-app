import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState, useRef, useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';
import axios from 'axios';
import NavbarPro from './_Components/NavbarPro';
import CardSchedule from './_Components/card-schedule';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Schedules() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('startDatetime');
  const [direction, setDirection] = useState('DESC');
  const [filterType, setFilterType] = useState('todos')
  const authHeadersRef = useRef({})
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
  const [ready, setReady] = useState(false)
  const PAGE_SIZE = 10; // Força sempre 10 agendamentos por página

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token')
      authHeadersRef.current = token ? { Authorization: `Bearer ${token}` } : {}
      setReady(true)
    }

    init()
  }, [])

  useEffect(() => {
    let isMounted = true

    const setup = async () => {
      if (!ready || !isMounted) return

      if (Platform.OS === 'android') {
        try {
          await NavigationBar.setVisibilityAsync('hidden')
        } catch (e) {
          console.log('NavBar error ignored:', e)
        }
      }
    }

    setup()

    return () => {
      isMounted = false
    }
  }, [ready])

  useFocusEffect(
    useCallback(() => {
      if (ready) {
        console.log('🔄 Tela em foco - refrescando agendamentos')
        // Volta para página 0 ao voltar da tela de criar agendamento
        if (page !== 0) {
          setPage(0)
        } else {
          getSchedules()
        }
      }
    }, [ready])
  )

  useEffect(() => {
    if (ready) {
      console.log('📄 Página alterada - buscando agendamentos')
      getSchedules()
    }
  }, [ready, page])

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

      console.log('📤 Enviando PATCH:', {
        url: `${API_URL}/api/agendamentos/${scheduleId}`,
        payload,
        headers: authHeadersRef.current,
      })

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

      console.log('✅ Resposta do servidor:', response.data)

      // Atualiza o estado IMEDIATAMENTE com os novos valores
      setAgendamentos((prev) =>
        prev.map((schedule) =>
          schedule.id === scheduleId
            ? {
              ...schedule,
              status: response.data.status || schedule.status,
              paymentStatus: response.data.paymentStatus || schedule.paymentStatus,
            }
            : schedule
        )
      )

      // Verifica se é FEITO com PAGO para remover após 20 segundos
      const isFeitoPago = response.data.status === 'FEITO' && response.data.paymentStatus === 'PAGO'

      if (isFeitoPago) {
        // Aguarda 20 segundos antes de remover o card da lista
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

      if (!authHeadersRef.current || Object.keys(authHeadersRef.current).length === 0) {
        throw new Error('Token de autenticação não encontrado')
      }

      const response = await axios.delete(`${API_URL}/api/agendamentos/${scheduleId}`, {
        headers: authHeadersRef.current,
        params: {
          message: mensagem.trim(),
        },
      })

      console.log('✅ Agendamento deletado com sucesso')

      // Aguarda 20 segundos antes de remover o card da lista
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

      // Carrega páginas consecutivas até ter 10 agendamentos válidos
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

        const formattedSchedules = content.map((agendamento) => ({
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

        // Filtra apenas agendamentos válidos (PENDENTE)
        const validSchedules = formattedSchedules.filter(sch => {
          const status = String(sch.status).trim().toUpperCase();
          const paymentStatus = String(sch.paymentStatus).trim().toUpperCase();
          
          if (status === 'CANCELADO') return false;
          if (status === 'FEITO' && paymentStatus === 'PAGO') return false;
          
          return true;
        });

        allSchedules = [...allSchedules, ...validSchedules];

        // Se tem menos de 10 agendamentos válidos e há mais páginas, continua
        if (allSchedules.length < PAGE_SIZE && currentPage < backendTotalPages - 1) {
          currentPage++;
        } else {
          hasMorePages = false;
        }
      }

      // Ordena (PENDENTE primeiro, depois por data)
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

      // Calcula páginas baseado no total de agendamentos válidos
      const totalValid = sortedSchedules.length;
      const calculatedTotalPages = Math.ceil(totalValid / PAGE_SIZE) || 1;

      console.log('📊 DEBUG - Agendamentos recebidos:', {
        totalValido: totalValid,
        page,
        size: PAGE_SIZE,
        calculatedTotalPages,
        backendTotalPages,
      });

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
    // Filtrar: manter PENDENTE ou (FEITO com pagamento pendente)
    // Remover: CANCELADO e FEITO com PAGO
    const activeSchedules = agendamentos.filter(sch => {
      const status = String(sch.status).trim().toUpperCase()
      const paymentStatus = String(sch.paymentStatus).trim().toUpperCase()
      
      // Remove CANCELADO
      if (status === 'CANCELADO') return false
      
      // Remove FEITO com pagamento PAGO
      if (status === 'FEITO' && paymentStatus === 'PAGO') return false
      
      // Mantém PENDENTE e FEITO com pagamento PENDENTE
      return true
    }).sort((a, b) => {
      // Pendentes primeiro
      const aIsPending = a.status === 'PENDENTE'
      const bIsPending = b.status === 'PENDENTE'
      
      if (aIsPending !== bIsPending) {
        return aIsPending ? -1 : 1
      }
      
      // Mesmos status: ordena por data
      const aDate = new Date(a.startDatetime || 0)
      const bDate = new Date(b.startDatetime || 0)
      return aDate - bDate
    })

    // NÃO aplicar paginação extra aqui - o backend já paginou
    if (filterType === 'todos') {
      return activeSchedules
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

    const result = activeSchedules.filter((sch) => {
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
    
    return result
  }

  // Voltar para página anterior se página atual ficar vazia
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
          onPress={() => router.push('/Professional/new-schedule')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Novo Agendamento</Text>
        </Pressable>

        {getFilteredSchedules().length > 0 ? (
          getFilteredSchedules().map((item) => (
            <CardSchedule
              key={item.id}
              schedule={item}
              showActions={item.status !== 'CANCELADO'}
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
    marginTop: 40,
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