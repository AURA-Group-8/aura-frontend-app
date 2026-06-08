import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';
import axios from 'axios';
import CardSchedule from './_Component/card-schedule-client';
import Navbar from './_Component/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function HistoryClient() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('startDatetime');
  const [direction, setDirection] = useState('DESC');
  const userNameRef = useRef(null)
  const authHeadersRef = useRef({})
  const pageRef = useRef(0)
  const totalPagesRef = useRef(1)
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
  const [ready, setReady] = useState(false)
  const PAGE_SIZE = 10;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await AsyncStorage.getItem('token')
      const userName = await AsyncStorage.getItem('userName')
      
      userNameRef.current = userName
      authHeadersRef.current = token ? { Authorization: `Bearer ${token}` } : {}
      
      setReady(true)
    }
    
    initializeAuth()
  }, [])

  useEffect(() => {
    pageRef.current = page
    totalPagesRef.current = totalPages
  }, [page, totalPages])

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
  
        getSchedules()
      }
  
      setup()
  
      return () => {
        isMounted = false
      }
    }, [ready, page, size, sortBy, direction])

  const router = useRouter();

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

        const userSchedules = formattedSchedules.filter((agendamento) =>
          String(agendamento.userName).toLowerCase() === String(userNameRef.current).toLowerCase()
        );

        const completedSchedules = userSchedules.filter((agendamento) => {
          const status = String(agendamento.status).trim().toUpperCase();
          return status === 'FEITO' || status === 'CANCELADO';
        });

        allSchedules = [...allSchedules, ...completedSchedules];

        if (allSchedules.length < PAGE_SIZE && currentPage < backendTotalPages - 1) {
          currentPage++;
        } else {
          hasMorePages = false;
        }
      }

      const sortedSchedules = allSchedules.sort((a, b) => {
        const aDate = new Date(a.endDatetime || 0);
        const bDate = new Date(b.endDatetime || 0);
        return bDate - aDate;
      });

      const totalValid = sortedSchedules.length;
      const calculatedTotalPages = Math.ceil(totalValid / PAGE_SIZE) || 1;

      console.log('📊 DEBUG - Histórico recebido:', {
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
      console.error('❌ Erro ao buscar histórico de agendamentos:', {
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

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/Client/schedules')}>
          <Ionicons name="chevron-back" size={30} color="#281111" />
        </Pressable>
        <Text style={styles.title}>Histórico de Agendamentos</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {agendamentos.length > 0 ? (
          agendamentos.map((item) => (
            <CardSchedule 
              key={item.id} 
              schedule={item}
              isClient={true}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="time-outline" size={48} color="#982546" />
            <Text style={styles.emptyText}>Nenhum agendamento no histórico</Text>
          </View>
        )}
      </ScrollView>

      {/* Paginação - sempre visível */}
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

      <Navbar active="Histórico" />

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
    marginBottom: 10,
    marginTop: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#281111',
  },

  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },

  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginVertical: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
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
    fontSize: 14,
    color: '#281111',
    fontWeight: '500',
  },
});
