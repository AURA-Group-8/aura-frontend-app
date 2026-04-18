import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import CalendarComponent from './_Component/CalendarComponentClient'
import TimeSelectionComponent from './_Component/TimeSelectionComponentClient'
import ServiceListComponent from './_Component/ServiceListComponentClient'
import SummaryCardComponent from './_Component/SummaryCardComponentClient'
import Navbar from './_Component/Navbar'


export default function NewScheduleClient() {
    const router = useRouter()
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [visibleMonth, setVisibleMonth] = useState(today.getMonth())
    const [visibleYear, setVisibleYear] = useState(today.getFullYear())
    const [selectedTime, setSelectedTime] = useState(null)
    const [selectedJob, setSelectedJob] = useState(null)

    return (
        <View style={styles.page}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <View style={styles.topBar}>
                    <Pressable style={styles.backButton} onPress={() => router.replace('/Client/schedules')}>
                        <Ionicons name="chevron-back" size={26} color="#281111" />
                    </Pressable>
                    <Text style={styles.pageTitle}>Selecione a data</Text>
                </View>

                <CalendarComponent
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    visibleMonth={visibleMonth}
                    setVisibleMonth={setVisibleMonth}
                    visibleYear={visibleYear}
                    setVisibleYear={setVisibleYear}
                />

                <ServiceListComponent selectedJob={selectedJob} setSelectedJob={setSelectedJob} />

                <TimeSelectionComponent
                    selectedDate={selectedDate}
                    selectedJob={selectedJob}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                />

                <SummaryCardComponent
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedJob={selectedJob}
                />
            </ScrollView>

            <Navbar />
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f5ead8',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#281111',
    },
    selectionInfo: {
        marginTop: 24,
        padding: 18,
        backgroundColor: '#fff3dc',
        borderRadius: 20,
    },
    selectionLabel: {
        fontSize: 14,
        color: '#7a3b45',
        marginBottom: 6,
    },
    selectionValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#281111',
    },
})