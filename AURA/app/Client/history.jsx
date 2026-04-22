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
  const [sortBy, setSortBy] = useState('id');
  const [direction, setDirection] = useState('DESC');
  const [userIdRef, setUserIdRef] = useState(null);
  const authHeadersRef = useRef({})
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
    const init = async () => {
      const token = await AsyncStorage.getItem('token')
      const userId = await AsyncStorage.getItem('userId')
      authHeadersRef.current = token ? { Authorization: `Bearer ${token}` } : {}
      setUserIdRef(userId)
      getSchedules();
    }
    init();
  }, [page, size, sortBy, direction]);

  const router = useRouter();

  async function getSchedules() {
    try {
      const response = await axios.get(`${API_URL}/api/agendamentos/card`, {
        headers: authHeadersRef.current,
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
        idClient: agendamento.idClient,
        userName: agendamento.userName,
        jobsNames: agendamento.jobsNames,
        startDatetime: agendamento.startDatetime,
        endDatetime: agendamento.endDatetime,
        status: agendamento.status,
        paymentStatus: agendamento.paymentStatus,
        totalPrice: agendamento.totalPrice,
        feedback: agendamento.feedback,
      }));

      // Filtrar apenas agendamentos do usuário atual
      const userSchedules = formattedSchedules.filter((agendamento) => {
        return String(agendamento.idClient) === String(userIdRef);
      });

      // Filtrar apenas agendamentos com data no passado
      const now = new Date();
      const pastSchedules = userSchedules.filter((agendamento) => {
        const endDate = new Date(agendamento.endDatetime || 0);
        return endDate < now;
      });

      // Ordenar por data decrescente (mais recentes primeiro)
      const sortedSchedules = pastSchedules.sort((a, b) => {
        const aDate = new Date(a.endDatetime || 0);
        const bDate = new Date(b.endDatetime || 0);
        return bDate - aDate;
      });

      setAgendamentos(sortedSchedules);
      setTotalPages(responseData.totalPages ?? 1);
      setTotalItems(responseData.totalElements ?? content.length);
      setPage(responseData.page ?? responseData.pageNumber ?? page);
      setSize(responseData.size ?? responseData.pageSize ?? size);
    }
    catch (error) {
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
              showActions={false}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="history-outline" size={48} color="#982546" />
            <Text style={styles.emptyText}>Nenhum agendamento no histórico</Text>
          </View>
        )}

        {agendamentos.length > 0 && (
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
        )}
      </ScrollView>

      <Navbar/>

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
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#982546',
  },

  pageButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },

  pageButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  pageInfo: {
    fontSize: 14,
    color: '#281111',
    fontWeight: '500',
  },
});
