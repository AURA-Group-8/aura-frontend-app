import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import axios from 'axios'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

export default function SummaryCardComponent({ selectedDate, selectedTime, selectedClient, selectedJobs }) {
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const clientLabel = selectedClient ? selectedClient.username || selectedClient.name || selectedClient.email : null
    
    const totalPrice = selectedJobs.reduce((sum, job) => sum + (job.price || 0), 0)
    const totalDuration = selectedJobs.reduce((sum, job) => sum + (job.expectedDurationMinutes || 30), 0)
    
    async function handleConfirm() {
        const token = await AsyncStorage.getItem('token')
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

        if (selectedJobs.length === 0 || !selectedTime || !selectedClient) return
        
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')
        const time = selectedTime.endsWith(':00') ? selectedTime : `${selectedTime}:00`
        const startDatetime = `${year}-${month}-${day}T${time}`

        const body = {
            userId: selectedClient.id,
            jobsIds: selectedJobs.map(job => job.id),
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

            router.replace('/Professional/schedules-home')

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

            {selectedJobs.length > 0 && (
                <>
                    <View style={styles.divider} />
                    <Text style={styles.servicesTitle}>Serviços Selecionados</Text>
                    {selectedJobs.map((job, index) => (
                        <View key={`job-${job.id}-${index}`} style={styles.serviceRow}>
                            <Text style={styles.serviceName}>{job.name}</Text>
                            <View style={styles.serviceDetails}>
                                <Text style={styles.serviceDetail}>{job.expectedDurationMinutes || 30} min</Text>
                                <Text style={styles.serviceDetail}>R$ {(job.price || 0).toFixed(2).replace('.', ',')}</Text>
                            </View>
                        </View>
                    ))}
                    <View style={styles.divider} />
                </>
            )}

            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duração Total</Text>
                <Text style={styles.summaryValue}>{formatDuration(totalDuration)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryValue}>R$ {totalPrice.toFixed(2).replace('.', ',')}</Text>
            </View>
            
            <Pressable
                style={[styles.confirmButton, !(selectedJobs.length > 0 && selectedTime && selectedClient) && styles.confirmButtonDisabled]}
                onPress={handleConfirm}
                disabled={isSubmitting || !(selectedJobs.length > 0 && selectedTime && selectedClient)}
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
    divider: {
        height: 1,
        backgroundColor: '#d4b98f',
        marginVertical: 12,
    },
    servicesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7a3b45',
        marginBottom: 10,
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
    },
    serviceName: {
        fontSize: 13,
        color: '#281111',
        fontWeight: '500',
        flex: 1,
    },
    serviceDetails: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-end',
    },
    serviceDetail: {
        fontSize: 12,
        color: '#7a3b45',
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