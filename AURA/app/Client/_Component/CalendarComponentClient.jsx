import { useMemo, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

const dayLabels = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
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

function buildCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    for (let i = 0; i < firstDay; i += 1) {
        days.push({ empty: true })
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        days.push({ empty: false, day, date: new Date(year, month, day) })
    }

    while (days.length % 7 !== 0) {
        days.push({ empty: true })
    }

    const weeks = []
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7))
    }

    return weeks
}

export default function CalendarComponent({ selectedDate, setSelectedDate, visibleMonth, setVisibleMonth, visibleYear, setVisibleYear }) {
    const today = new Date()

    const calendarWeeks = useMemo(
        () => buildCalendar(visibleYear, visibleMonth),
        [visibleYear, visibleMonth]
    )

    const handlePrevMonth = () => {
        if (visibleMonth === 0) {
            setVisibleMonth(11)
            setVisibleYear((value) => value - 1)
            return
        }
        setVisibleMonth((value) => value - 1)
    }

    const handleNextMonth = () => {
        if (visibleMonth === 11) {
            setVisibleMonth(0)
            setVisibleYear((value) => value + 1)
            return
        }
        setVisibleMonth((value) => value + 1)
    }

    const isSameDate = (dateA, dateB) =>
        dateA.getDate() === dateB.getDate() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getFullYear() === dateB.getFullYear()

    const isBeforeToday = (date) => {
        const todayStart = new Date(today)
        todayStart.setHours(0, 0, 0, 0)
        const dateStart = new Date(date)
        dateStart.setHours(0, 0, 0, 0)
        return dateStart < todayStart
    }

    return (
        <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
                <Pressable style={styles.navButton} onPress={handlePrevMonth}>
                    <Ionicons name="chevron-back" size={20} color="#5c0f25" />
                </Pressable>

                <Text style={styles.calendarTitle}>
                    {monthNames[visibleMonth]} {visibleYear}
                </Text>

                <Pressable style={styles.navButton} onPress={handleNextMonth}>
                    <Ionicons name="chevron-forward" size={20} color="#5c0f25" />
                </Pressable>
            </View>

            <View style={styles.weekLabels}>
                {dayLabels.map((label) => (
                    <Text key={label} style={styles.weekLabel}>
                        {label}
                    </Text>
                ))}
            </View>

            {calendarWeeks.map((week, weekIndex) => (
                <View key={`week-${weekIndex}`} style={styles.weekRow}>
                    {week.map((item, index) => {
                        if (item.empty) {
                            return <View key={`empty-${index}`} style={styles.dayCell} />
                        }

                        const isSelected = isSameDate(item.date, selectedDate)
                        const isToday = isSameDate(item.date, today)
                        const isDisabled = isBeforeToday(item.date)

                        return (
                            <Pressable
                                key={`day-${item.day}`}
                                style={({ pressed }) => [
                                    styles.dayCell,
                                    isSelected && styles.dayCellSelected,
                                    isDisabled && styles.dayCellDisabled,
                                    pressed && !isDisabled && styles.dayCellPressed,
                                ]}
                                onPress={() => !isDisabled && setSelectedDate(item.date)}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        isSelected && styles.dayTextSelected,
                                        isToday && !isSelected && styles.todayText,
                                        isDisabled && styles.dayTextDisabled,
                                    ]}
                                >
                                    {item.day}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    calendarCard: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 25,
        elevation: 6,
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#fff3dc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#281111',
        textTransform: 'capitalize',
    },
    weekLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    weekLabel: {
        width: 36,
        textAlign: 'center',
        color: '#a97f55',
        fontWeight: '600',
        fontSize: 12,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    dayCell: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    dayCellSelected: {
        backgroundColor: '#e9d187',
    },
    dayCellDisabled: {
        backgroundColor: '#f2e8d9',
        opacity: 0.45,
    },
    dayCellPressed: {
        opacity: 0.7,
    },
    dayText: {
        color: '#281111',
        fontWeight: '600',
        fontSize: 14,
    },
    dayTextSelected: {
        color: '#281111',
    },
    dayTextDisabled: {
        color: '#b7a08d',
    },
    todayText: {
        color: '#5c0f25',
    },
})