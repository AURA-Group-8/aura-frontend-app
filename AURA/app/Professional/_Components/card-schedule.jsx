import { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import axios from 'axios'
import { Picker } from '@react-native-picker/picker'


export default function CardSchedule({ schedule }) {

  const API_URL = process.env.API_URL || 'http://localhost:8080';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const [paymentOpen, setPaymentOpen] = useState(false)
  const [scheduleStatus, setScheduleStatus] = useState(
    schedule.status || 'PENDENTE'
  )

  const [paymentStatus, setPaymentStatus] = useState(
    schedule.paymentStatus || 'PENDENTE'
  )

  async function updateSchedule(updatedFields) {
    try {
      const payload = {
        id: schedule.id,
        status: (
          updatedFields.status ?? scheduleStatus
        ).toUpperCase(),

        paymentStatus: (
          updatedFields.paymentStatus ?? paymentStatus
        ).toUpperCase(),
      }

      console.log('PAYLOAD ENVIADO:', payload)

      const response = await axios.patch(
        `${API_URL}/api/agendamentos/${schedule.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        }
      )

      console.log('Atualizado com sucesso:', response.data)
    } catch (error) {
      console.error(
        'Erro ao atualizar:',
        error.response?.data || error.message
      )
    }
  }

  const current = schedule
  const startDatetime = current.startDatetime ? new Date(current.startDatetime).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }) : current.data || '-'
  const endDatetime = current.endDatetime ? new Date(current.endDatetime).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }) : null
  const totalPrice = current.totalPrice != null ? `R$ ${Number(current.totalPrice).toFixed(2).replace('.', ',')}` : current.valor || 'R$ 0,00'

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{current.userName ?? 'Cliente'}</Text>
          <Text style={styles.servico}>{current.jobsNames?.length > 0 ? current.jobsNames.join(', ') : 'Agendamento'}</Text>
        </View>
        <View style={[styles.statusBadge, current.status === 'Concluído' ? styles.statusConfirmed : styles.statusPending]}>
          <Text style={styles.statusText}>{scheduleStatus}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View>
          <Text style={styles.label}>Início</Text>
          <Text style={styles.detail}>{startDatetime}</Text>
        </View>
        {endDatetime && (
          <View style={styles.priceBox}>
            <Text style={styles.label}>Fim</Text>
            <Text style={styles.detail}>{endDatetime}</Text>
          </View>
        )}
      </View>

      <View style={{ ...styles.detailsRow, justifyContent: 'flex-start', gap: 20 }}>
        <View>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.price}>{totalPrice}</Text>
        </View>
        <View style={styles.paymentContainer}>
          <Text style={styles.label}>Pagamento</Text>

          <Pressable
            style={styles.selectButton}
            onPress={() => {
              if (paymentStatus !== 'PAGO') {
                setPaymentOpen(!paymentOpen)
              }
            }}
          >
            <Text style={styles.detail}>
              {paymentStatus === 'PAGO' ? 'Pago' : 'Pendente'}
            </Text>

            {paymentStatus !== 'PAGO' && (
              <Ionicons
                name={paymentOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#281111"
              />
            )}
          </Pressable>

          {paymentOpen && paymentStatus !== 'PAGO' && (
            <View style={styles.dropdown}>
              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  setPaymentStatus('PAGO')
                  setPaymentOpen(false)

                  updateSchedule({
                    paymentStatus: 'PAGO'
                  })
                }}
              >
                <Text style={styles.detail}>Pago</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {scheduleStatus !== 'FEITO' && (
        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {
              setScheduleStatus('CANCELADO')
              updateSchedule({ status: 'CANCELADO' })
            }}
          >
            <Text style={styles.actionText}>✕</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => {
              setScheduleStatus('FEITO')
              updateSchedule({ status: 'FEITO' })
            }}
          >
            <Text style={styles.actionText}>✓</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9E2DD',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#281111',
    marginBottom: 4,
  },

  servico: {
    fontSize: 14,
    color: '#7A5A52',
  },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },

  statusConfirmed: {
    backgroundColor: '#E8F6EF',
  },

  statusPending: {
    backgroundColor: '#FCE8E8',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#281111',
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    color: '#7A5A52',
    marginBottom: 4,
  },

  detail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#281111',
  },

  priceBox: {
    alignItems: 'flex-end',
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#281111',
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },

  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    backgroundColor: '#F7E1E0',
  },

  confirmButton: {
    backgroundColor: '#E3F7ED',
  },

  actionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#281111',
  },

  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
    marginVertical: 10,
  },

  selectButton: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d4b98f',
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    height: 40
  },

})
