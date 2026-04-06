import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import axios from 'axios'
import { router } from 'expo-router'

const monthNames = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
]

export default function SummaryCardComponent({ selectedDate, selectedTime, selectedClient, selectedJob }) {
    const API_URL = process.env.API_URL || 'http://localhost:8080'
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}
    const [isSubmitting, setIsSubmitting] = useState(false)

    const clientLabel = selectedClient ? selectedClient.username || selectedClient.name || selectedClient.email : null

    async function handleConfirm() {
        if (!selectedJob || !selectedTime || !selectedClient) return

        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')
        const time = selectedTime.endsWith(':00') ? selectedTime : `${selectedTime}:00`
        const startDatetime = `${year}-${month}-${day}T${time}`

        const body = {
            userId: selectedClient.id,
            jobsIds: [selectedJob.id],
            startDatetime,
        }

        try {
            setIsSubmitting(true)
            const response = await axios.post(`${API_URL}/api/agendamentos`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders,
                },
            })
            console.log('Agendamento criado com sucesso:', response.data)

            router.push('/Professional/schedules-home')

        } catch (error) {
            console.error('Erro ao criar agendamento:', error)

        } finally {
            setIsSubmitting(false)
        }
    }


    const selectedLabel = `${selectedDate.getDate().toString().padStart(2, '0')} de ${monthNames[selectedDate.getMonth()]} de ${selectedDate.getFullYear()}`
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h ${String(mins).padStart(2, '0')}m` : `${hours}h`
    }

    return (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo</Text>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cliente</Text>
                <Text style={styles.summaryValue}>{clientLabel ?? '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Data</Text>
                <Text style={styles.summaryValue}>{selectedLabel}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Horário</Text>
                <Text style={styles.summaryValue}>{selectedTime ?? '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duração</Text>
                <Text style={styles.summaryValue}>{formatDuration(selectedJob?.expectedDurationMinutes ?? selectedJob?.duration ?? 30)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryValue}>{selectedJob?.price != null ? `R$ ${Number(selectedJob.price).toFixed(2).replace('.', ',')}` : 'R$ 0,00'}</Text>
            </View>
            <Pressable
                style={[styles.confirmButton, !(selectedJob && selectedTime && selectedClient) && styles.confirmButtonDisabled]}
                onPress={handleConfirm}
                disabled={isSubmitting || !(selectedJob && selectedTime && selectedClient)}
            >
                <Text style={styles.confirmButtonText}>
                    {isSubmitting ? 'Enviando...' : 'Confirmar Agendamento'}
                </Text>
            </Pressable>

            
        </View>
    )
}

const styles = StyleSheet.create({
    summaryCard: {
        marginTop: 24,
        padding: 20,
        backgroundColor: '#f9e9d9',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 20,
        elevation: 5,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#281111',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#7a3b45',
    },
    summaryValue: {
        fontSize: 15,
        color: '#281111',
        fontWeight: '700',
    },
    confirmButton: {
        marginTop: 12,
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7a1f40',
    },
    confirmButtonDisabled: {
        backgroundColor: '#c49a98',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
})