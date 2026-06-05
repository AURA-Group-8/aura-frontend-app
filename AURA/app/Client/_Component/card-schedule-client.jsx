import { useState } from 'react'
import { View, Text, StyleSheet, Pressable, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function CardSchedule({ 
  schedule,
  onCancelSchedule,
  onUpdateSchedule,
  onRefresh,
  isClient = true
}) {
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const canShowActions = !isClient && !['FEITO', 'CANCELADO'].includes(
    String(schedule.status).trim().toUpperCase()
  )

  const confirmarCancelamento = async () => {
    if (cancellationReason.trim() === '') {
      setErrorMessage('Por favor, informe o motivo do cancelamento.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
    
      await onCancelSchedule(schedule.id, cancellationReason)
      
      console.log('✅ Agendamento cancelado com sucesso!')
      
     
      setCancelModalOpen(false)
      setCancellationReason('')
      
      
      setTimeout(() => {
        if (onRefresh) {
          onRefresh()
        }
      }, 500)
      
    } catch (error) {
      setErrorMessage('Erro ao cancelar. Verifique o console para detalhes.')
      console.error('❌ Erro ao cancelar agendamento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmSchedule = async () => {
    try {
      await onUpdateSchedule(schedule.id, { status: 'FEITO' })
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error)
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
  
  const calculateDuration = () => {
    if (!current.startDatetime || !current.endDatetime) return null
    const start = new Date(current.startDatetime)
    const end = new Date(current.endDatetime)
    const diffMs = end - start
    const diffMins = Math.round(diffMs / 60000)
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return mins > 0 ? `${hours}h ${String(mins).padStart(2, '0')}m` : `${hours}h`
  }
  
  const duration = calculateDuration()

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.name}>{current.userName ?? 'Cliente'}</Text>
        <View style={[styles.statusBadge, current.status === 'FEITO' ? styles.statusConfirmed : styles.statusPending]}>
          <Text style={styles.statusText}>{current.status}</Text>
        </View>
      </View>

      {current.jobsNames && current.jobsNames.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.jobsScroll}
        >
          {Array.isArray(current.jobsNames) ? (
            current.jobsNames.map((job, index) => (
              <Text key={`job-${index}`} style={styles.servicoBadge}>
                {job}
              </Text>
            ))
          ) : (
            <Text style={styles.servicoBadge}>{current.jobsNames}</Text>
          )}
        </ScrollView>
      )}

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
          <Text style={styles.detail}>
            {schedule.paymentStatus === 'PAGO' ? 'PAGO' : 'PENDENTE'}
          </Text>
        </View>
      </View>

      {duration && (
        <View style={styles.detailsRow}>
          <View>
            <Text style={styles.label}>Duração Total</Text>
            <Text style={styles.detail}>{duration}</Text>
          </View>
        </View>
      )}
      {canShowActions && (
          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setCancelModalOpen(true)
              }}
            >
              <Text style={styles.actionText}>✕</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.confirmButton]}
              onPress={handleConfirmSchedule}
            >
              <Text style={styles.actionText}>✓</Text>
            </Pressable>
          </View>
        )}

      <Modal
        visible={cancelModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setCancelModalOpen(false)
          setCancellationReason('')
          setErrorMessage('')
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Motivo do Cancelamento</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Digite o motivo do cancelamento..."
              placeholderTextColor="#B0A8A0"
              value={cancellationReason}
              onChangeText={(text) => {
                setCancellationReason(text)
                setErrorMessage('')
              }}
              multiline={true}
              numberOfLines={4}
              editable={!isLoading}
            />

            {errorMessage !== '' && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelBtn]}
                onPress={() => {
                  setCancelModalOpen(false)
                  setCancellationReason('')
                  setErrorMessage('')
                }}
                disabled={isLoading}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalConfirmBtn,
                  isLoading && styles.modalButtonDisabled
                ]}
                onPress={confirmarCancelamento}
                disabled={isLoading}
              >
                <Text style={styles.modalButtonText}>
                  {isLoading ? 'Processando...' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#281111',
  },

  jobsScroll: {
    maxHeight: 32,
    marginBottom: 14,
  },

  servicoBadge: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#7a1f40',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    overflow: 'hidden',
    minWidth: 60,
  },

  servico: {
    fontSize: 14,
    color: '#7A5A52',
  },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    justifyContent: 'center',
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
    textAlign: 'center',
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

  paymentContainer: {
    flex: 1,
  },

  picker: {
    width: '100%',
    height: 40
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#281111',
    marginBottom: 16,
    textAlign: 'center',
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#E9E2DD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    fontSize: 14,
    color: '#281111',
    textAlignVertical: 'top',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCancelBtn: {
    backgroundColor: '#F7E1E0',
  },

  modalConfirmBtn: {
    backgroundColor: '#E3F7ED',
  },

  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#281111',
  },

  modalButtonDisabled: {
    opacity: 0.5,
  },

})
