import { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ServiceListComponent({ selectedJobs = [], setSelectedJobs }) {
    const [jobs, setJobs] = useState([])
    const [jobOpen, setJobOpen] = useState(false)
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'
    
    useEffect(() => {
        loadJobs()
    }, [])

    async function loadJobs() {
        const data = await getJobs()
        setJobs(data)
    }

    async function getJobs() {
        try {
            const token = await AsyncStorage.getItem('token')
            const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}
            
            const response = await axios.get(`${API_URL}/api/servicos`, {
                headers: authHeaders,
            })
            return response.data
        } catch (error) {
            console.error('Erro ao buscar serviços:', error)
            return []
        }
    }

    const totalPrice = selectedJobs.reduce((sum, job) => sum + (job.price || 0), 0)
    const totalDuration = selectedJobs.reduce((sum, job) => sum + (job.expectedDurationMinutes || 30), 0)
    const hours = Math.floor(totalDuration / 60)
    const minutes = totalDuration % 60
    const durationDisplay = minutes > 0 ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${hours}h`

    return (
        <View style={styles.selectionInfo}>
            <Text style={styles.selectionLabel}>Serviços</Text>
            
            {/* Serviços Selecionados */}
            {selectedJobs.length > 0 && (
                <View style={styles.selectedServicesContainer}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.selectedServicesList}
                    >
                        {selectedJobs.map((job) => (
                            <View key={`selected-${job.id}`} style={styles.selectedServiceBadge}>
                                <Text style={styles.selectedServiceText}>{job.name}</Text>
                                <Pressable
                                    onPress={() => {
                                        setSelectedJobs(selectedJobs.filter(j => j.id !== job.id))
                                    }}
                                >
                                    <Ionicons name="close" size={18} color="#fff" />
                                </Pressable>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
            
            {/* Botão para Adicionar Serviços */}
            <Pressable
                style={styles.selectButton}
                onPress={() => setJobOpen((value) => !value)}
            >
                <Text style={styles.selectButtonText}>
                    {selectedJobs.length === 0 ? '+ Selecionar serviços' : '+ Adicionar outro'}
                </Text>
            </Pressable>
            
            {/* Totalizações */}
            {selectedJobs.length > 0 && (
                <View style={styles.totalsContainer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Duração Total:</Text>
                        <Text style={styles.totalValue}>{durationDisplay}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2).replace('.', ',')}</Text>
                    </View>
                </View>
            )}
            
            {/* Dropdown com Serviços Disponíveis */}
            {jobOpen && (
                <View style={styles.selectDropdown}>
                    {jobs.length > 0 ? (
                        <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                            {jobs.map((job) => {
                                const label = job.name || `Serviço ${job.id}`
                                const isSelected = selectedJobs.some(j => j.id === job.id)
                                return (
                                    <Pressable
                                        key={`job-${job.id}`}
                                        style={[
                                            styles.selectItem,
                                            isSelected && styles.selectItemSelected
                                        ]}
                                        onPress={() => {
                                            if (isSelected) {
                                                setSelectedJobs(selectedJobs.filter(j => j.id !== job.id))
                                            } else {
                                                setSelectedJobs([...selectedJobs, job])
                                            }
                                        }}
                                    >
                                        <View style={styles.serviceItemContent}>
                                            <View style={styles.serviceInfo}>
                                                <Text style={[
                                                    styles.selectItemText,
                                                    isSelected && styles.selectItemTextSelected
                                                ]}>
                                                    {label}
                                                </Text>
                                                <Text style={styles.serviceDetailText}>
                                                    {job.expectedDurationMinutes || 30} min • R$ {(job.price || 0).toFixed(2).replace('.', ',')}
                                                </Text>
                                            </View>
                                            {isSelected && (
                                                <Ionicons name="checkmark" size={20} color="#7a1f40" />
                                            )}
                                        </View>
                                    </Pressable>
                                )
                            })}
                        </ScrollView>
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
    selectedServicesContainer: {
        marginBottom: 12,
        maxHeight: 60,
    },
    selectedServicesList: {
        flexDirection: 'row',
    },
    selectedServiceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        backgroundColor: '#7a1f40',
        borderRadius: 20,
    },
    selectedServiceText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '600',
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
    totalsContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#d4b98f',
        gap: 6,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: 13,
        color: '#7a3b45',
    },
    totalValue: {
        fontSize: 14,
        color: '#281111',
        fontWeight: '700',
    },
    selectDropdown: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#d4b98f',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        maxHeight: 250,
    },
    dropdownScroll: {
        maxHeight: 250,
    },
    selectItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0e3c7',
    },
    selectItemSelected: {
        backgroundColor: '#f9e9d9',
    },
    serviceItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    serviceInfo: {
        flex: 1,
    },
    selectItemText: {
        fontSize: 15,
        color: '#281111',
        fontWeight: '500',
    },
    selectItemTextSelected: {
        fontWeight: '700',
        color: '#7a1f40',
    },
    serviceDetailText: {
        fontSize: 12,
        color: '#7a3b45',
        marginTop: 4,
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