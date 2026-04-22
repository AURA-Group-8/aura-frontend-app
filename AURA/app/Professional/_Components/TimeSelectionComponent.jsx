import { useMemo, useState, useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

export default function TimeSelectionComponent({ selectedDate, selectedJob, selectedTime, setSelectedTime }) {
    const [availableTimes, setAvailableTimes] = useState([]) 
    const authHeadersRef = useRef({})
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

    useEffect(() => {
        const init = async () => {
            const token = await AsyncStorage.getItem('token')
            authHeadersRef.current = token ? { Authorization: `Bearer ${token}` } : {}
        }
        init()
    }, [])

    const selectedDaySlots = useMemo(() => {
        if (!Array.isArray(availableTimes)) return []
        if (availableTimes.length === 0) return []
        if (typeof availableTimes[0] === 'string') return availableTimes

        const selectedDayString = selectedDate.toISOString().split('T')[0]
        const selectedDayObject = availableTimes.find((item) => {
            const itemDateString = typeof item?.date === 'string'
                ? item.date.split('T')[0]
                : item.date instanceof Date
                    ? item.date.toISOString().split('T')[0]
                    : null

            return itemDateString === selectedDayString
        })

        const slots = Array.isArray(selectedDayObject?.availableTimes)
            ? selectedDayObject.availableTimes
            : Array.isArray(availableTimes) && availableTimes.every((item) => typeof item === 'string')
                ? availableTimes
                : []

        return slots
    }, [availableTimes, selectedDate])

    useEffect(() => {
        loadAvailableTimes()
    }, [selectedDate, selectedJob])

    async function loadAvailableTimes() {
        const duration = selectedJob?.expectedDurationMinutes ?? 30
       
        const times = await getAvailableTimes(duration)
        setAvailableTimes(times)
        setSelectedTime(null)
    }

    async function getAvailableTimes(durationInMinutes) {
        try {
            const firstDayOfWeek = new Date(selectedDate)
            const dayOfWeek = firstDayOfWeek.getDay()
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
            firstDayOfWeek.setDate(firstDayOfWeek.getDate() + mondayOffset)
            const dateString = firstDayOfWeek.toISOString().split('T')[0]

            const response = await axios.get(`${API_URL}/api/agendamentos/available-times`, {
                headers: authHeadersRef.current,
                params: {
                    durationInMinutes,
                    firstDayOfWeek: dateString,
                },
            })
            return response.data
        } catch (error) {
            console.error('Erro ao buscar horários disponíveis:', error)
            return []
        }
    }

    const formatTimeLabel = (time) => {
        const raw = typeof time === 'string' ? time : String(time)
        return raw.endsWith(':00') ? raw.slice(0, -3) : raw
    }

    if (!selectedJob) return null

    return (
        <View style={styles.timesCard}>
            <Text style={styles.timesTitle}>Selecione o horário</Text>
            <View style={styles.timesGrid}>
                {selectedDaySlots.length > 0 ? (
                    selectedDaySlots.map((time, index) => {
                        const timeLabel = formatTimeLabel(time)
                        return (
                            <Pressable
                                key={`time-${timeLabel}-${index}`}
                                style={({ pressed }) => [
                                    styles.timeButton,
                                    selectedTime === timeLabel && styles.timeButtonSelected,
                                    pressed && styles.timeButtonPressed,
                                ]}
                                onPress={() => setSelectedTime(timeLabel)}
                            >
                                <Text
                                    style={[
                                        styles.timeButtonText,
                                        selectedTime === timeLabel && styles.timeButtonTextSelected,
                                    ]}
                                >
                                    {timeLabel}
                                </Text>
                            </Pressable>
                        )
                    })
                ) : (
                    <Text style={styles.noTimesText}>Nenhum horário disponível para este dia</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    timesCard: {
        marginTop: 24,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 25,
        elevation: 6,
    },
    timesTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#281111',
        marginBottom: 16,
    },
    timesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'flex-start',
    },
    timeButton: {
        width: '22%',
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: '#f5ead8',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    timeButtonSelected: {
        backgroundColor: '#7a1f40',
        borderColor: '#5c0f25',
    },
    timeButtonPressed: {
        opacity: 0.7,
    },
    timeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7a3b45',
    },
    timeButtonTextSelected: {
        color: '#fff',
    },
    noTimesText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        width: '100%',
        paddingVertical: 20,
    },
})