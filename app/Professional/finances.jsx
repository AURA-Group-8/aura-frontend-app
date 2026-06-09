import { View, Text, StyleSheet, ScrollView, Pressable, Modal, ActivityIndicator } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar'
import { useEffect, useState, useCallback, useRef } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Platform } from 'react-native'
import axios from 'axios'
import NavbarPro from './_Components/NavbarPro'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BusinessInsightsModal from './_Components/BusinessInsightsModal'

export default function Finances() {
  const [monthlyRevenue, setMonthlyRevenue] = useState('85k')
  const [cancellations, setCancellations] = useState(0)
  
  const [costs, setCosts] = useState('12k')
  const [revenueVariation, setRevenueVariation] = useState(0)
  const [costsVariation, setCostsVariation] = useState(0)
  const [tkmValue, setTkmValue] = useState('450')
  const [tkmVariation, setTkmVariation] = useState(0)
  const [weeklyData, setWeeklyData] = useState([
    { day: 'Seg', value: 0 },
    { day: 'Ter', value: 0 },
    { day: 'Qua', value: 0 },
    { day: 'Qui', value: 0 },
    { day: 'Sex', value: 0 },
    { day: 'Sáb', value: 0 },
  ])
  const [monthHistory, setMonthHistory] = useState([])
  const [topServices, setTopServices] = useState([
    { name: 'Botox', count: '45 atend.' },
    { name: 'Preenchimento', count: '32 atend.' },
    { name: 'Limpeza de Pele', count: '28 atend.' },
  ])
  const [inactiveClients, setInactiveClients] = useState([
    { name: 'Mariana Silva', date: 'jan/2024', badge: 'ALERTA' },
    { name: 'Carlos Oliveira', date: '3M', badge: 'INFO' },
  ])
  const [loading, setLoading] = useState(false)
  const [insightsModalOpen, setInsightsModalOpen] = useState(false)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [faturamentoPeriodo, setFaturamentoPeriodo] = useState(6)
  const [faturamentoData, setFaturamentoData] = useState([])
  const [agendamentosSemanais, setAgendamentosSemanais] = useState({
    domingo: 0,
    segunda: 0,
    terca: 0,
    quarta: 0,
    quinta: 0,
    sexta: 0,
    sabado: 0,
  })
  const [topServiciosPeriodo, setTopServiciosPeriodo] = useState(6)
  const [topServiciosData, setTopServiciosData] = useState([])
  const [topServiciosModalOpen, setTopServiciosModalOpen] = useState(false)
  const [inactiveClientsData, setInactiveClientsData] = useState([])
  const [allInactiveClientsModalOpen, setAllInactiveClientsModalOpen] = useState(false)
  const [allClientsData, setAllClientsData] = useState([])
  const [loadingInactivos, setLoadingInactivos] = useState(false)
  const [agendamentosInfoOpen, setAgendamentosInfoOpen] = useState(false)
  const [tkmInfoOpen, setTkmInfoOpen] = useState(false)
  const [receitaInfoOpen, setReceitaInfoOpen] = useState(false)
  const [custosInfoOpen, setCustosInfoOpen] = useState(false)
  const [kpisInfoOpen, setKpisInfoOpen] = useState(false)
  const [topServiciosInfoOpen, setTopServiciosInfoOpen] = useState(false)
  const [inactivosInfoOpen, setInactivosInfoOpen] = useState(false)

  const authHeadersRef = useRef(null)
  const API_URL = process.env.EXPO_PUBLIC_API_ETL_URL || 'http://localhost:8000'
  const [ready, setReady] = useState(false)
  const router = useRouter()

  async function fetchResumoData() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/resumo`, {
        headers: authHeadersRef.current,
      })

      const data = response.data

      console.log('Dados recebidos do resumo:', data)

      if (data.tkm !== undefined) {
        setTkmValue(Math.round(data.tkm).toString())
      }
      if (data.percentagem_crescimento_tkm !== undefined) {
        console.log('TKM Variation:', data.percentagem_crescimento_tkm)
        setTkmVariation(data.percentagem_crescimento_tkm)
      }

      if (data.receita !== undefined) {
        const receita = data.receita
        if (receita >= 1000) {
          setMonthlyRevenue(`${(receita / 1000).toFixed(0)}k`)
        } else {
          setMonthlyRevenue(receita.toFixed(2))
        }
      }
      if (data.percentagem_crescimento_receita !== undefined) {
        console.log('Revenue Variation:', data.percentagem_crescimento_receita)
        setRevenueVariation(data.percentagem_crescimento_receita)
      }

      if (data.custos !== undefined) {
        const custos = data.custos
        if (custos >= 1000) {
          setCosts(`${(custos / 1000).toFixed(0)}k`)
        } else {
          setCosts(custos.toFixed(2))
        }
      }
      if (data.percentagem_crescimento_custos !== undefined) {
        console.log('Costs Variation:', data.percentagem_crescimento_custos)
        setCostsVariation(data.percentagem_crescimento_custos)
      }
    } catch (error) {
      console.error('Erro ao buscar dados do resumo:', error)
    }
  }

  async function fetchFaturamentoData(periodo = 6) {
    try {
      const response = await axios.get(`${API_URL}/api/v1/faturamento`, {
        params: {
          periodo_meses: periodo,
        },
        headers: authHeadersRef.current,
      })

      const data = response.data
      if (Array.isArray(data)) {
        setFaturamentoData(data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados de faturamento:', error)
    }
  }

  async function fetchAgendamentosSemanais() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/agendamentos_semanais`, {
        headers: authHeadersRef.current,
      })

      const data = response.data
      if (typeof data === 'object') {
        setAgendamentosSemanais(data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados de agendamentos semanais:', error)
    }
  }

  async function fetchTopServicos(periodo = 6) {
    try {
      const response = await axios.get(`${API_URL}/api/v1/top_servicos`, {
        params: {
          periodo_meses: periodo,
        },
        headers: authHeadersRef.current,
      })

      const data = response.data
      if (Array.isArray(data)) {
        setTopServiciosData(data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados de top serviços:', error.response?.status, error.message)
      setTopServiciosData([])
    }
  }

  async function fetchClientesInativos() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/clientes_inativos`, {
        params: {
          limit: 5,
        },
        headers: authHeadersRef.current,
      })

      const data = response.data
      if (Array.isArray(data)) {
        setInactiveClientsData(data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados de clientes inativos:', error.response?.status, error.message)
      setInactiveClientsData([])
    }
  }

  async function fetchAllClientesInativos() {
    try {
      setLoadingInactivos(true)
      console.log('=== Iniciando busca de clientes inativos ===')
      
      const response = await axios.get(`${API_URL}/api/v1/clientes_inativos`, {
        headers: authHeadersRef.current,
      })

      console.log('=== Resposta da API ===')
      console.log('Status:', response.status)
      console.log('Dados:', response.data)
      console.log('Tipo:', typeof response.data)
      console.log('É array?', Array.isArray(response.data))
      
      const data = response.data
      if (Array.isArray(data)) {
        console.log('✅ Total de clientes recebidos:', data.length)
        console.log('Primeiro cliente:', data[0])
        setAllClientsData(data)
        console.log('Estado atualizado com', data.length, 'clientes')
      } else {
        console.log('❌ Dados não é um array')
        setAllClientsData([])
      }
    } catch (error) {
      console.error('❌ Erro ao buscar clientes inativos:', error.message)
      setAllClientsData([])
    } finally {
      setLoadingInactivos(false)
    }
  }

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
          await NavigationBar.setVisibilityAsync('hidden').catch(() => {})
        } catch (e) {
          console.error('Erro ao ocultar a barra de navegação:', e)
        }
      }

      fetchResumoData()
      fetchFaturamentoData(6)
      fetchAgendamentosSemanais()
      fetchTopServicos(6)
      fetchClientesInativos()
    }

    setup()

    return () => {
      isMounted = false
    }
  }, [ready])

  useFocusEffect(
    useCallback(() => {
      if (ready) {
        fetchResumoData()
        fetchFaturamentoData(faturamentoPeriodo)
        fetchAgendamentosSemanais()
        fetchTopServicos(topServiciosPeriodo)
      }
    }, [ready, faturamentoPeriodo, topServiciosPeriodo])
  )

  function handleOpenInsights() {
    setInsightsModalOpen(true)
  }

  const getVariationColor = (value) => {
    return value >= 0 ? '#00C853' : '#E53935'
  }

  const getVariationIcon = (value) => {
    return value >= 0 ? 'arrow-up' : 'arrow-down'
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
              onPress={handleOpenInsights}
            >
              <Ionicons name="bulb-outline" size={24} color="#ffbf00" />
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

        {!loading ? (
          <>
            <View>
              <View style={styles.kpiHeaderContainer}>
                <Text style={styles.kpiSectionTitle}>KPIs</Text>
                <Pressable onPress={() => setKpisInfoOpen(true)}>
                  <Ionicons name="information-circle-outline" size={22} color="#982546" />
                </Pressable>
              </View>
              <View style={styles.kpiContainer}>
                <View style={styles.kpiCard}>
                  <View style={[styles.kpiIconContainer, styles.iconOrange]}>
                    <Ionicons name="cash-outline" size={28} color="#F57C00" />
                  </View>
                  <View style={styles.kpiContent}>
                    <Text style={styles.kpiLabel}>TKM</Text>
                    <Text style={styles.kpiValue}>R$ {tkmValue}</Text>
                  </View>
                  <View style={styles.kpiVariation}>
                    <Ionicons
                      name={getVariationIcon(tkmVariation)}
                      size={16}
                      color={getVariationColor(tkmVariation)}
                    />
                    <Text style={[styles.variationText, { color: getVariationColor(tkmVariation) }]}>
                      ~{Math.abs(tkmVariation)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.kpiCard}>
                  <View style={[styles.kpiIconContainer, styles.iconGray]}>
                    <Ionicons name="wallet-outline" size={28} color="#616161" />
                  </View>
                  <View style={styles.kpiContent}>
                    <Text style={styles.kpiLabel}>RECEITA</Text>
                    <Text style={styles.kpiValue}>R$ {monthlyRevenue}</Text>
                  </View>
                  <View style={styles.kpiVariation}>
                    <Ionicons
                      name={getVariationIcon(revenueVariation)}
                      size={16}
                      color={getVariationColor(revenueVariation)}
                    />
                    <Text style={[styles.variationText, { color: getVariationColor(revenueVariation) }]}>
                      ~{Math.abs(revenueVariation)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.kpiCard}>
                  <View style={[styles.kpiIconContainer, styles.iconRed]}>
                    <Ionicons name="document-outline" size={28} color="#E53935" />
                  </View>
                  <View style={styles.kpiContent}>
                    <Text style={styles.kpiLabel}>CUSTOS</Text>
                    <Text style={styles.kpiValue}>R$ {costs}</Text>
                  </View>
                  <View style={styles.kpiVariation}>
                    <Ionicons
                      name={getVariationIcon(costsVariation)}
                      size={16}
                      color={getVariationColor(costsVariation)}
                    />
                    <Text style={[styles.variationText, { color: getVariationColor(costsVariation) }]}>
                      ~{Math.abs(costsVariation)}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Faturamento</Text>
                <Pressable
                  style={styles.periodSelector}
                  onPress={() => setHistoryModalOpen(true)}
                >
                  <Text style={styles.periodText}>
                    {faturamentoPeriodo} mes{faturamentoPeriodo > 1 ? 'es' : ''}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#982546" />
                </Pressable>
              </View>
              <View style={styles.chartContent}>
                <View style={styles.barsContainer}>
                  {faturamentoData.length > 0 ? (
                    faturamentoData.map((item, index) => {
                      const date = new Date(item.mes)
                      const monthShort = date.toLocaleDateString('pt-BR', {
                        month: 'short',
                      })
                      const maxValue = Math.max(
                        ...faturamentoData.map((d) => d.valor),
                        1
                      )
                      const height = (item.valor / maxValue) * 150

                      return (
                        <View key={index} style={styles.barWrapper}>
                          <View
                            style={[
                              styles.bar,
                              {
                                height: Math.max(20, height),
                              },
                            ]}
                          />
                          <Text style={styles.dayLabel}>{monthShort}</Text>
                        </View>
                      )
                    })
                  ) : (
                    weeklyData.map((item, index) => (
                      <View key={index} style={styles.barWrapper}>
                        <View
                          style={[
                            styles.bar,
                            {
                              height: Math.max(20, Math.random() * 150),
                            },
                          ]}
                        />
                        <Text style={styles.dayLabel}>{item.day}</Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Agendamentos Semanais</Text>
                <Pressable onPress={() => setAgendamentosInfoOpen(true)}>
                  <Ionicons name="information-circle-outline" size={20} color="#982546" />
                </Pressable>
              </View>
              <View style={styles.chartContent}>
                <View style={styles.barsContainer}>
                  {[
                    { key: 'domingo', label: 'Dom' },
                    { key: 'segunda', label: 'Seg' },
                    { key: 'terca', label: 'Ter' },
                    { key: 'quarta', label: 'Qua' },
                    { key: 'quinta', label: 'Qui' },
                    { key: 'sexta', label: 'Sex' },
                    { key: 'sabado', label: 'Sab' },
                  ].map((day, index) => {
                    const maxValue = Math.max(
                      ...Object.values(agendamentosSemanais),
                      1
                    )
                    const height =
                      ((agendamentosSemanais[day.key] || 0) / maxValue) * 150

                    return (
                      <View key={index} style={styles.barWrapper}>
                        <View
                          style={[
                            styles.bar,
                            {
                              height: Math.max(20, height),
                            },
                          ]}
                        />
                        <Text style={styles.dayLabel}>{day.label}</Text>
                        <Text style={styles.barValue}>
                          {agendamentosSemanais[day.key] || 0}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <View style={styles.chartHeaderWithInfo}>
                <View style={styles.chartHeaderLeft}>
                  <Text style={styles.sectionTitle}>Top Serviços</Text>
                  <Pressable onPress={() => setTopServiciosInfoOpen(true)} style={styles.infoIconSmall}>
                    <Ionicons name="information-circle-outline" size={18} color="#982546" />
                  </Pressable>
                </View>
                <Pressable
                  style={styles.periodSelector}
                  onPress={() => setTopServiciosModalOpen(true)}
                >
                  <Text style={styles.periodText}>
                    {topServiciosPeriodo} mes{topServiciosPeriodo > 1 ? 'es' : ''}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#982546" />
                </Pressable>
              </View>
              {topServiciosData.length > 0 ? (
                topServiciosData.map((service, index) => (
                  <View key={index} style={styles.serviceItem}>
                    <View style={styles.serviceNumber}>
                      <Text style={styles.serviceNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>{service.nome_servico || '-'}</Text>
                      <Text style={styles.servicePercentage}>
                        {service.porcentagem_total ? service.porcentagem_total.toFixed(2) : '0'}%
                      </Text>
                    </View>
                    <Text style={styles.serviceCount}>
                      {service.qtd_realizados || 0}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noData}>Nenhum dado disponível</Text>
              )}
            </View>

            <View style={[styles.chartContainer, styles.lastContainer]}>
              <View style={styles.inactiveHeaderWithInfo}>
                <View style={styles.chartHeaderLeft}>
                  <Text style={styles.sectionTitle}>Inativos (Alerta)</Text>
                  <Pressable onPress={() => setInactivosInfoOpen(true)} style={styles.infoIconSmall}>
                    <Ionicons name="information-circle-outline" size={18} color="#982546" />
                  </Pressable>
                </View>
                <Pressable 
                  onPress={async () => {
                    await fetchAllClientesInativos()
                    setAllInactiveClientsModalOpen(true)
                  }}
                >
                  <Text style={styles.alertCount}>VER TODOS</Text>
                </Pressable>
              </View>
              {inactiveClientsData.length > 0 ? (
                inactiveClientsData.slice(0, 5).map((client, index) => {
                  const isBadgeAlert = (client.qtd_meses_ultimo_agendamento || 0) >= 6
                  const badgeType = isBadgeAlert ? 'ALERTA' : 'INFO'

                  return (
                    <View key={index} style={styles.inactiveItem}>
                      <View>
                        <Text style={styles.inactiveName}>{client.nome_cliente || '-'}</Text>
                        <Text style={styles.inactiveDate}>
                          {client.qtd_meses_ultimo_agendamento}
                          {' '}
                          {(client.qtd_meses_ultimo_agendamento || 0) > 1 ? 'meses' : 'mes'}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.badge,
                          badgeType === 'ALERTA' ? styles.badgeAlert : styles.badgeInfo,
                        ]}
                      >
                        <Text style={styles.badgeText}>{badgeType}</Text>
                      </View>
                    </View>
                  )
                })
              ) : (
                <Text style={styles.noData}>Nenhum cliente inativo</Text>
              )}
            </View>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#982546" />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        )}
      </ScrollView>

      <BusinessInsightsModal
        visible={insightsModalOpen}
        onClose={() => setInsightsModalOpen(false)}
      />

      <Modal
        visible={historyModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setHistoryModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Período - Faturamento</Text>
              <Pressable onPress={() => setHistoryModalOpen(false)}>
                <Ionicons name="close" size={24} color="#5c0f25" />
              </Pressable>
            </View>
            <View style={styles.periodGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mes) => (
                <Pressable
                  key={mes}
                  style={[
                    styles.periodOption,
                    faturamentoPeriodo === mes && styles.periodOptionActive,
                  ]}
                  onPress={() => {
                    setFaturamentoPeriodo(mes)
                    fetchFaturamentoData(mes)
                    setHistoryModalOpen(false)
                  }}
                >
                  <Text
                    style={[
                      styles.periodOptionText,
                      faturamentoPeriodo === mes && styles.periodOptionTextActive,
                    ]}
                  >
                    {mes} mes{mes > 1 ? 'es' : ''}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={() => setHistoryModalOpen(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={topServiciosModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setTopServiciosModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Período - Top Serviços</Text>
              <Pressable onPress={() => setTopServiciosModalOpen(false)}>
                <Ionicons name="close" size={24} color="#5c0f25" />
              </Pressable>
            </View>
            <View style={styles.periodGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mes) => (
                <Pressable
                  key={mes}
                  style={[
                    styles.periodOption,
                    topServiciosPeriodo === mes && styles.periodOptionActive,
                  ]}
                  onPress={() => {
                    setTopServiciosPeriodo(mes)
                    fetchTopServicos(mes)
                    setTopServiciosModalOpen(false)
                  }}
                >
                  <Text
                    style={[
                      styles.periodOptionText,
                      topServiciosPeriodo === mes && styles.periodOptionTextActive,
                    ]}
                  >
                    {mes} mes{mes > 1 ? 'es' : ''}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={() => setTopServiciosModalOpen(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={agendamentosInfoOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAgendamentosInfoOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.infoModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Informação</Text>
              <Pressable onPress={() => setAgendamentosInfoOpen(false)}>
                <Ionicons name="close" size={24} color="#5c0f25" />
              </Pressable>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={32} color="#982546" style={{ marginBottom: 12 }} />
              <Text style={styles.infoText}>
                Os agendamentos mostrados são referentes ao mes passado.
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={() => setAgendamentosInfoOpen(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={kpisInfoOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setKpisInfoOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.infoModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sobre as KPIs</Text>
              <Pressable onPress={() => setKpisInfoOpen(false)}>
                <Ionicons name="close" size={24} color="#5c0f25" />
              </Pressable>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={32} color="#982546" style={{ marginBottom: 12 }} />
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: '700' }}>Valores:</Text>{'\n'}
                Referentes ao mes atual.{'\n\n'}
                <Text style={{ fontWeight: '700' }}>Porcentagens:</Text>{'\n'}
                Referentes ao comparativo com o mes anterior.{'\n\n'}
                <Text style={{ fontWeight: '700' }}>Custos:</Text>{'\n'}
                Atualizados no dia seguinte após você subir a planilha de custos.
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={() => setKpisInfoOpen(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={topServiciosInfoOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setTopServiciosInfoOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.infoModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Top Servi\u00e7os</Text>
              <Pressable onPress={() => setTopServiciosInfoOpen(false)}>
                <Ionicons name="close" size={24} color="#5c0f25" />
              </Pressable>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={32} color="#982546" style={{ marginBottom: 12 }} />
              <Text style={styles.infoText}>
                Estes dados são referentes aos últimos 3 meses de serviços realizados.
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={() => setTopServiciosInfoOpen(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={inactivosInfoOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setInactivosInfoOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.infoModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Clientes Inativos</Text>
              <Pressable onPress={() => setInactivosInfoOpen(false)}>
                <Ionicons name="close" size={24} color="#5c0f25" />
              </Pressable>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={32} color="#982546" style={{ marginBottom: 12 }} />
              <Text style={styles.infoText}>
                Clientes são considerados inativos a partir de 3 meses sem agendamentos.
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={() => setInactivosInfoOpen(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={allInactiveClientsModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAllInactiveClientsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.allInactivesModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Todos os Clientes</Text>
              <Pressable onPress={() => setAllInactiveClientsModalOpen(false)}>
                <Ionicons name="close" size={24} color="#5c0f25" />
              </Pressable>
            </View>
            
            {loadingInactivos ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#982546" />
                <Text style={styles.loadingText}>Carregando clientes...</Text>
              </View>
            ) : allClientsData?.length > 0 ? (
              <ScrollView style={styles.inactiveListContainer}>
                {allClientsData.map((client, index) => {
                  const isBadgeAlert = (client.qtd_meses_ultimo_agendamento || 0) >= 6
                  const badgeType = isBadgeAlert ? 'ALERTA' : 'INFO'
                  
                  return (
                    <View key={index} style={styles.inactiveItemList}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.inactiveNameList}>{client.nome_cliente || '-'}</Text>
                        <Text style={styles.inactiveDateList}>
                          {client.qtd_meses_ultimo_agendamento || 0}
                          {' '}
                          {(client.qtd_meses_ultimo_agendamento || 0) > 1 ? 'meses' : 'mês'}
                          {' '} de inatividade
                        </Text>
                        {client.ultimo_agendamento && (
                          <Text style={styles.inactiveDateListSmall}>
                            Último: {new Date(client.ultimo_agendamento).toLocaleDateString('pt-BR')}
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.badgeList,
                          badgeType === 'ALERTA' ? styles.badgeAlertList : styles.badgeInfoList,
                        ]}
                      >
                        <Text style={styles.badgeTextList}>{badgeType}</Text>
                      </View>
                    </View>
                  )
                })}
                </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum cliente inativo encontrado</Text>
              </View>
            )}
            
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={() => setAllInactiveClientsModalOpen(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
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
  kpiHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  kpiSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c0f25',
  },
  kpiContainer: {
    marginBottom: 24,
    gap: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  kpiIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
    marginBottom: 12,
  },
  iconOrange: {
    backgroundColor: '#FFF3E0',
  },
  iconGray: {
    backgroundColor: '#F5F5F5',
  },
  iconRed: {
    backgroundColor: '#FFEBEE',
  },
  kpiContent: {
    flex: 1,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#982546',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#5c0f25',
    textAlign: 'center',
  },
  kpiVariation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  variationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  insightsSection: {
    backgroundColor: '#F0F4FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    padding: 16,
    marginBottom: 24,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  insightIcon: {
    marginTop: 2,
    minWidth: 20,
  },
  insightText: {
    fontSize: 13,
    color: '#333333',
    flex: 1,
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
  lastContainer: {
    marginBottom: 0,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c0f25',
    marginBottom: 40,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  periodText: {
    fontSize: 14,
    color: '#982546',
    fontWeight: '600',
  },
  chartContent: {
    height: 180,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 28,
    backgroundColor: '#8B4555',
    borderRadius: 4,
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 11,
    color: '#982546',
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 100,
  },
  dayCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  dayCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c0f25',
  },
  dayCircleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#982546',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c0f25',
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
    backgroundColor: '#FFE0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#982546',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#5c0f25',
    marginBottom: 4,
  },
  servicePercentage: {
    fontSize: 12,
    color: '#999999',
  },
  serviceCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#982546',
  },
  noData: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 16,
  },
  chartHeaderWithInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inactiveHeaderWithInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIconSmall: {
    padding: 4,
  },
  inactiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#982546',
  },
  inactiveItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  inactiveName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5c0f25',
  },
  inactiveDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeAlert: {
    backgroundColor: '#FFCDD2',
  },
  badgeInfo: {
    backgroundColor: '#FFF9C4',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5c0f25',
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
  modalInsightItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modalInsightText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#5c0f25',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
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
  infoModalContent: {
    maxHeight: '40%',
  },
  infoBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#982546',
  },
  infoText: {
    fontSize: 14,
    color: '#5c0f25',
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  periodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  periodOption: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodOptionActive: {
    backgroundColor: '#5c0f25',
    borderColor: '#5c0f25',
  },
  periodOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  periodOptionTextActive: {
    color: '#ffffff',
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
  allInactivesModalContent: {
    maxHeight: '95%',
    paddingBottom: 0,
    flex: 1,
    flexDirection: 'column',
  },
  inactiveListContainer: {
    flex: 1,
    marginVertical: 16,
  },
  inactiveItemList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e3c7',
  },
  inactiveNameList: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3d2b2b',
    marginBottom: 4,
  },
  inactiveDateList: {
    fontSize: 12,
    color: '#7a5a52',
  },
  inactiveDateListSmall: {
    fontSize: 11,
    color: '#999999',
    marginTop: 2,
  },
  badgeList: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeAlertList: {
    backgroundColor: '#ff9999',
  },
  badgeInfoList: {
    backgroundColor: '#99ccff',
  },
  badgeTextList: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#7a5a52',
    textAlign: 'center',
  },
})
