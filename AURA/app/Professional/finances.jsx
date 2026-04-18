import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'
import { useEffect, useState, useCallback, useRef } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Platform } from 'react-native'
import axios from 'axios'
import NavbarPro from './_Components/NavbarPro'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Finances() {
  const [monthlyRevenue, setMonthlyRevenue] = useState('0')
  const [cancellations, setCancellations] = useState(0)
  const [weeklyData, setWeeklyData] = useState([
    { day: 'Seg', value: 0 },
    { day: 'Ter', value: 0 },
    { day: 'Qua', value: 0 },
    { day: 'Qui', value: 0 },
    { day: 'Sex', value: 0 },
    { day: 'Sáb', value: 0 },
  ])
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [monthHistory, setMonthHistory] = useState([])
  const [topServices, setTopServices] = useState([])
  const [regularClients, setRegularClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')

  const authHeadersRef = useRef(null)

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

  const router = useRouter()

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden')
      NavigationBar.setBehaviorAsync('overlay-swipe')
    }
    const init = async () => {
      const token = await AsyncStorage.getItem('token')
      authHeadersRef.current = token ? { Authorization: `Bearer ${token}` } : {}
      fetchFinancesData()
    }
    init()
  }, [])


  async function fetchFinancesData() {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get(`${API_URL}/api/insights/finance/dashboard`, {
        headers: authHeadersRef.current,
      })


      const { dadosMensais, topServicos, topClientes, atendimentosDiaDaSemanaNoMes } = response.data

      if (dadosMensais) {
        const billedAmount = (dadosMensais.totalBilledInMonth || 0).toFixed(2).replace('.', ',')
        setMonthlyRevenue(billedAmount)
        setCancellations(dadosMensais.totalCanceledSchedulesInMonth || 0)
      }

      if (topServicos && Array.isArray(topServicos)) {
        const servicesWithId = topServicos.map((name, index) => ({
          id: index + 1,
          name: name || 'Serviço sem nome',
        }))
        setTopServices(servicesWithId)
      }

      if (topClientes && Array.isArray(topClientes)) {
        const clientsWithId = topClientes.map((name, index) => ({
          id: index + 1,
          name: name || 'Cliente sem nome',
        }))
        setRegularClients(clientsWithId)
      }

      if (atendimentosDiaDaSemanaNoMes && Array.isArray(atendimentosDiaDaSemanaNoMes)) {
        const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
        const newWeeklyData = days.map((day, index) => ({
          day,
          value: atendimentosDiaDaSemanaNoMes[index] || 0,
        }))
        setWeeklyData(newWeeklyData)
      }
    } catch (err) {
      console.error('❌ Erro ao buscar dados de finanças:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      })
      setError('Erro ao carregar dados financeiros')
    } finally {
      setLoading(false)
    }
  }

  const addRevenue = (amount) => {
    
    const currentAmount = parseFloat(monthlyRevenue.replace(',', '.'))
    const newAmount = (currentAmount + amount).toFixed(2).replace('.', ',')
    setMonthlyRevenue(newAmount)
  }

  const addCancellation = () => {
    setCancellations((prev) => prev + 1)
  }

  async function fetchHistoryData() {
    try {
      setHistoryLoading(true)

      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        return date.getMonth() + 1
      })

      const startMonth = Math.min(...months)
      const endMonth = Math.max(...months)

      const response = await axios.get(`${API_URL}/api/insights/finance/historico`, {
        headers: authHeadersRef.current,
        params: {
          startMonth,
          endMonth,
        },
      })


      if (Array.isArray(response.data)) {
        const monthNames = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
        ]

        const historyFormatted = response.data.map((item) => ({
          month: monthNames[item.month - 1] || `Mês ${item.month}`,
          revenue: item.totalBilledInMonth || 0,
          firstDay: item.firstDayOfMonth,
          schedules: item.totalSchedulesInMonth,
          canceledSchedules: item.totalCanceledSchedulesInMonth,
        }))

        setMonthHistory(historyFormatted)
      } else if (response.data && typeof response.data === 'object') {
        const monthNames = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
        ]

        const singleHistory = [{
          month: monthNames[response.data.month - 1] || `Mês ${response.data.month}`,
          revenue: response.data.totalBilledInMonth || 0,
          firstDay: response.data.firstDayOfMonth,
          schedules: response.data.totalSchedulesInMonth,
          canceledSchedules: response.data.totalCanceledSchedulesInMonth,
        }]

        setMonthHistory(singleHistory)
      }
    } catch (err) {
      console.error('❌ Erro ao buscar histórico:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      })
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleHistoryModalOpen = () => {
    setHistoryModalOpen(true)
    fetchHistoryData()
  }

  const maxValue = Math.max(...weeklyData.map(d => d.value))

  const getBarHeight = (value) => {
    return (value / maxValue) * 150
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finanças</Text>
          <View style={styles.headerButtonsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.headerButtonPressed,
              ]}
              
            >
              <Ionicons name="bulb-outline" size={24} color="#FFC107" />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.headerButtonPressed,
              ]}
              onPress={() => router.push('./uploads')}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#5c0f25" />
            </Pressable>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#982546" />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        )}

        {error !== '' && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#BE4053" />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={fetchFinancesData}
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </Pressable>
          </View>
        )}

        {!loading && error === '' && (
          <>
            <View style={styles.kpiContainer}>
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconContainer, styles.iconGreen]}>
                  <Ionicons name="cash-outline" size={24} color="#00C853" />
                </View>
                <View style={styles.kpiContent}>
                  <Text style={styles.kpiLabel}>Faturamento mensal</Text>
                  <Text style={styles.kpiValue}>R$ {monthlyRevenue}</Text>
                </View>
                <View style={styles.historyButtonContainer}>
                  <Text style={styles.historyButtonLabel}>Histórico</Text>
                  <Pressable
                    onPress={handleHistoryModalOpen}
                    style={({ pressed }) => [
                      styles.historyButton,
                      pressed && styles.historyButtonPressed,
                    ]}
                  >
                    <Ionicons name="time" size={24} color="#5c0f25" />
                  </Pressable>
                </View>
              </View>

              <View style={[styles.kpiCard, styles.cancellationCard]}>
                <View style={[styles.kpiIconContainer, styles.iconRed]}>
                  <Ionicons name="close-circle-outline" size={24} color="#FF5252" />
                </View>
                <View style={styles.kpiContent}>
                  <Text style={styles.kpiLabel}>Cancelamentos</Text>
                  <Text style={styles.kpiValue}>{cancellations}</Text>
                </View>
              </View>
            </View>

            {weeklyData.some(d => d.value > 0) && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Movimentação Semanal</Text>
                <View style={styles.chartContent}>
                  <View style={styles.barsContainer}>
                    {weeklyData.map((item, index) => (
                      <View key={index} style={styles.barWrapper}>
                        <View
                          style={[
                            styles.bar,
                            { height: getBarHeight(item.value) },
                          ]}
                        />
                        <Text style={styles.dayLabel}>{item.day}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {topServices.length > 0 && (
              <View style={styles.servicesContainer}>
                <Text style={styles.sectionTitle}>Serviços Mais Realizados</Text>
                {topServices.map((service) => (
                  <View key={service.id} style={styles.serviceItem}>
                    <View style={styles.serviceNumber}>
                      <Text style={styles.serviceNumberText}>{service.id}</Text>
                    </View>
                    <Text style={styles.serviceName}>{service.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {regularClients.length > 0 && (
              <View style={styles.clientsContainer}>
                <Text style={styles.sectionTitle}>Clientes Regulares</Text>
                {regularClients.map((client) => (
                  <View key={client.id} style={styles.clientItem}>
                    <Text style={styles.clientName}>{client.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={historyModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setHistoryModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Histórico de Faturamento</Text>
              <Pressable
                onPress={() => setHistoryModalOpen(false)}
                style={({ pressed }) => pressed && { opacity: 0.7 }}
              >
                <Ionicons name="close" size={28} color="#5c0f25" />
              </Pressable>
            </View>

            <ScrollView style={styles.historyList}>
              {historyLoading ? (
                <View style={styles.historyLoadingContainer}>
                  <ActivityIndicator size="large" color="#982546" />
                  <Text style={styles.historyLoadingText}>Carregando histórico...</Text>
                </View>
              ) : monthHistory.length > 0 ? (
                monthHistory.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.historyItem}
                    onPress={() => {
                      Alert.alert(
                        `${item.month}`,
                        `Faturamento: R$ ${item.revenue.toFixed(2).replace('.', ',')}\nAgendamentos: ${item.schedules}\nCancelados: ${item.canceledSchedules}`
                      )
                    }}
                  >
                    <View style={styles.historyItemContent}>
                      <Text style={styles.historyMonth}>{item.month}</Text>
                      <Text style={styles.historyRevenue}>R$ {item.revenue.toFixed(2).replace('.', ',')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#982546" />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.historyEmptyContainer}>
                  <Text style={styles.historyEmptyText}>Sem dados de histórico</Text>
                </View>
              )}
            </ScrollView>

            <Pressable
              onPress={() => setHistoryModalOpen(false)}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
            >
              <Text style={styles.closeButtonText}>Voltar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <NavbarPro active="Finanças" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3DC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5c0f25',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
  kpiContainer: {
    marginBottom: 24,
    gap: 12,
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cancellationCard: {
    marginBottom: 0,
  },
  kpiIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconGreen: {
    backgroundColor: '#E8F5E9',
  },
  iconRed: {
    backgroundColor: '#FFEBEE',
  },
  kpiContent: {
    flex: 1,
  },
  kpiLabel: {
    fontSize: 12,
    color: '#982546',
    fontWeight: '500',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#5c0f25',
  },
  historyButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FFF3DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyButtonPressed: {
    opacity: 0.6,
  },
  historyButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  historyButtonLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5c0f25',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c0f25',
    marginBottom: 16,
  },
  chartContent: {
    height: 200,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 32,
    backgroundColor: '#8B4555',
    borderRadius: 4,
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 12,
    color: '#982546',
    fontWeight: '600',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF3DC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5c0f25',
  },
  historyList: {
    marginBottom: 16,
    maxHeight: 300,
  },
  historyItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyItemContent: {
    flex: 1,
  },
  historyMonth: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5c0f25',
    marginBottom: 4,
  },
  historyRevenue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00C853',
  },
  closeButton: {
    backgroundColor: '#5c0f25',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  closeButtonPressed: {
    opacity: 0.8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF3DC',
    textAlign: 'center',
  },
  servicesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  clientsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c0f25',
    marginBottom: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  serviceNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#982546',
  },
  serviceName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#5c0f25',
  },
  clientItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  clientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5c0f25',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7A5A52',
  },
  errorContainer: {
    backgroundColor: '#FFE8EC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD4E1',
  },
  errorText: {
    fontSize: 14,
    color: '#BE4053',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#BE4053',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  historyLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  historyLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7A5A52',
  },
  historyEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  historyEmptyText: {
    fontSize: 14,
    color: '#982546',
    fontWeight: '500',
  },
})
