import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import CalendarComponent from './_Components/CalendarComponent'
import TimeSelectionComponent from './_Components/TimeSelectionComponent'
import ServiceListComponent from './_Components/ServiceListComponent'
import ClientListComponent from './_Components/ClientListComponent'
import SummaryCardComponent from './_Components/SummaryCardComponent'
import NavbarPro from './_Components/NavbarPro'

export default function NewSchedule() {
    const router = useRouter()
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [visibleMonth, setVisibleMonth] = useState(today.getMonth())
    const [visibleYear, setVisibleYear] = useState(today.getFullYear())
    const [selectedTime, setSelectedTime] = useState(null)
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedJobs, setSelectedJobs] = useState([])

    return (
        <View style={styles.container}>
            <ScrollView style={styles.page} contentContainerStyle={styles.content}>
                <View style={styles.topBar}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
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

                <ServiceListComponent selectedJobs={selectedJobs} setSelectedJobs={setSelectedJobs} />

                <TimeSelectionComponent
                    selectedDate={selectedDate}
                    selectedJobs={selectedJobs}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                />

                <ClientListComponent selectedClient={selectedClient} setSelectedClient={setSelectedClient} />

                <SummaryCardComponent
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedClient={selectedClient}
                    selectedJobs={selectedJobs}
                    onSuccessCallback={() => router.replace('/Professional/schedules-home')}
                />
            </ScrollView>
            <NavbarPro active="Agenda" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5ead8',
    },
    page: {
        flex: 1,
        backgroundColor: '#f5ead8',
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
        marginTop: 10,

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