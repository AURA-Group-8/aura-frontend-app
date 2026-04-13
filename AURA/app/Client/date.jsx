import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'

const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

const CLIENTES = [
  'Ana Paula Silva',
  'Beatriz Souza',
  'Carla Mendes',
  'Daniela Lima',
  'Fernanda Costa',
]

function gerarDiasDoMes(ano, mes) {
  const primeiroDia = new Date(ano, mes, 1).getDay()
  const totalDias = new Date(ano, mes + 1, 0).getDate()
  const diasAnteriores = new Date(ano, mes, 0).getDate()
  const dias = []

  // Dias do mês anterior
  for (let i = primeiroDia - 1; i >= 0; i--) {
    dias.push({ dia: diasAnteriores - i, mesAtual: false })
  }

  // Dias do mês atual
  for (let i = 1; i <= totalDias; i++) {
    dias.push({ dia: i, mesAtual: true })
  }

  // Dias do próximo mês para completar a grade
  const restante = 42 - dias.length
  for (let i = 1; i <= restante; i++) {
    dias.push({ dia: i, mesAtual: false })
  }

  return dias
}

export default function NovoAgendamento() {
  const router = useRouter()
  const hoje = new Date()

  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth())
  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate())
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [dropdownAberto, setDropdownAberto] = useState(false)

  const dias = gerarDiasDoMes(ano, mes)

  function mesAnterior() {
    if (mes === 0) { setMes(11); setAno(ano - 1) }
    else setMes(mes - 1)
    setDiaSelecionado(null)
  }

  function proximoMes() {
    if (mes === 11) { setMes(0); setAno(ano + 1) }
    else setMes(mes + 1)
    setDiaSelecionado(null)
  }

  function isHoje(dia, mesAtual) {
    return (
      mesAtual &&
      dia === hoje.getDate() &&
      mes === hoje.getMonth() &&
      ano === hoje.getFullYear()
    )
  }

  function isSelecionado(dia, mesAtual) {
    return mesAtual && dia === diaSelecionado
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F0EA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#3D1515" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Agendamento</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Calendário */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selecione a data</Text>

          {/* Navegação de mês */}
          <View style={styles.mesNav}>
            <TouchableOpacity style={styles.navBtn} onPress={mesAnterior}>
              <Feather name="chevron-left" size={18} color="#6B3A3A" />
            </TouchableOpacity>
            <Text style={styles.mesLabel}>
              {MESES[mes]} {ano}
            </Text>
            <TouchableOpacity style={styles.navBtn} onPress={proximoMes}>
              <Feather name="chevron-right" size={18} color="#6B3A3A" />
            </TouchableOpacity>
          </View>

          {/* Cabeçalho dias da semana */}
          <View style={styles.semanaRow}>
            {DIAS_SEMANA.map((d) => (
              <Text key={d} style={styles.semanaLabel}>{d}</Text>
            ))}
          </View>

          {/* Grid de dias */}
          <View style={styles.grid}>
            {dias.map((item, index) => {
              const selecionado = isSelecionado(item.dia, item.mesAtual)
              const hoje_ = isHoje(item.dia, item.mesAtual)

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.diaCell,
                    selecionado && styles.diaSelecionado,
                  ]}
                  onPress={() => item.mesAtual && setDiaSelecionado(item.dia)}
                  activeOpacity={item.mesAtual ? 0.7 : 1}
                >
                  <Text
                    style={[
                      styles.diaText,
                      !item.mesAtual && styles.diaForaMes,
                      selecionado && styles.diaTextSelecionado,
                      !selecionado && hoje_ && styles.diaHoje,
                    ]}
                  >
                    {item.dia}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Card Cliente */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cliente</Text>

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownAberto(!dropdownAberto)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dropdownText, !clienteSelecionado && styles.placeholder]}>
              {clienteSelecionado ?? 'Selecione o cliente'}
            </Text>
            <Feather
              name={dropdownAberto ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#8C8C8C"
            />
          </TouchableOpacity>

          {dropdownAberto && (
            <View style={styles.dropdownList}>
              {CLIENTES.map((cliente) => (
                <TouchableOpacity
                  key={cliente}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setClienteSelecionado(cliente)
                    setDropdownAberto(false)
                  }}
                >
                  <Text style={styles.dropdownItemText}>{cliente}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botão confirmar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmarBtn}
          activeOpacity={0.8}
          onPress={() => {
            // lógica de confirmação
          }}
        >
          <Text style={styles.confirmarText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EDE8E0',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0EA',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D8',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D1515',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },

  // Cards
  card: {
    backgroundColor: '#FAFAF8',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D1515',
    marginBottom: 16,
  },

  // Calendário
  mesNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EBE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mesLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D1515',
  },
  semanaRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  semanaLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: '#A89080',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  diaCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  diaSelecionado: {
    backgroundColor: '#D4B483',
  },
  diaText: {
    fontSize: 15,
    color: '#3D1515',
    fontWeight: '400',
  },
  diaForaMes: {
    color: '#C8C0B8',
  },
  diaTextSelecionado: {
    color: '#fff',
    fontWeight: '700',
  },
  diaHoje: {
    fontWeight: '700',
    color: '#982546',
  },

  // Dropdown
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0EBE3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 15,
    color: '#3D1515',
  },
  placeholder: {
    color: '#A89080',
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#F0EBE3',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D8',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#3D1515',
  },

  // Footer
  footer: {
    padding: 16,
    backgroundColor: '#EDE8E0',
  },
  confirmarBtn: {
    backgroundColor: '#A87070',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  confirmarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
})