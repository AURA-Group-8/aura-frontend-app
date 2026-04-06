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

      setAgendamentos(formattedSchedules);
      setTotalPages(responseData.totalPages ?? 1);
      setTotalItems(responseData.totalElements ?? content.length);
      setPage(responseData.page ?? responseData.pageNumber ?? page);
      setSize(responseData.size ?? responseData.pageSize ?? size);
    }
    catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setAgendamentos([]);
      setTotalPages(1);
      setTotalItems(0);
    }
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

        {agendamentos.length > 0 ? (
          agendamentos.map((item) => (
            <CardSchedule key={item.id} schedule={item} />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color="#982546" />
            <Text style={styles.emptyText}>Sem novos agendamentos</Text>
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
    paddingTop: 60
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