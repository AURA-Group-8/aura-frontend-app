import { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default async function ServiceListComponent({ selectedJob, setSelectedJob }) {
    const [jobs, setJobs] = useState([])
    const [jobOpen, setJobOpen] = useState(false)
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'
    const token = typeof window !== 'undefined' ? await AsyncStorage.getItem('token') : null
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

    useEffect(() => {
        loadJobs()
    }, [])

    async function loadJobs() {
        const data = await getJobs()
        setJobs(data)
    }

    async function getJobs() {
        try {
            const response = await axios.get(`${API_URL}/api/servicos`, {
                headers: authHeaders,
            })

            console.log('Serviços disponíveis:', response.data)
            return response.data
        } catch (error) {
            console.error('Erro ao buscar serviços:', error)
            return []
        }
    }

    return (
        <View style={styles.selectionInfo}>
            <Text style={styles.selectionLabel}>Serviço</Text>
            <Pressable
                style={styles.selectButton}
                onPress={() => setJobOpen((value) => !value)}
            >
                <Text style={styles.selectButtonText}>
                    {selectedJob?.name ? selectedJob.name : 'Selecione um serviço'}
                </Text>
            </Pressable>
            {jobOpen && (
                <View style={styles.selectDropdown}>
                    {jobs.length > 0 ? (
                        jobs.map((job) => {
                            const label = job.name || `Serviço ${job.id}`
                            return (
                                <Pressable
                                    key={`job-${job.id}`}
                                    style={styles.selectItem}
                                    onPress={() => {
                                        setSelectedJob(job)
                                        setJobOpen(false)
                                    }}
                                >
                                    <Text style={styles.selectItemText}>{label}</Text>
                                </Pressable>
                            )
                        })
                    ) : (
                        <View style={styles.selectEmpty}>
                            <Text style={styles.selectEmptyText}>Nenhum serviço disponível</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
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
    selectButton: {
        marginTop: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#d4b98f',
        borderRadius: 16,
        backgroundColor: '#fff',
    },
    selectButtonText: {
        fontSize: 15,
        color: '#281111',
        fontWeight: '600',
    },
    selectDropdown: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#d4b98f',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    selectItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0e3c7',
    },
    selectItemText: {
        fontSize: 15,
        color: '#281111',
    },
    selectEmpty: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    selectEmptyText: {
        color: '#999',
        fontSize: 15,
    },
})