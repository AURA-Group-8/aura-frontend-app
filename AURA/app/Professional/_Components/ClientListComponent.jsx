import { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import axios from 'axios'
import CardPopUp from './card-popUp'

export default function ClientListComponent({ selectedClient, setSelectedClient }) {
    const [clients, setClients] = useState([])
    const [clientOpen, setClientOpen] = useState(false)
    const API_URL = process.env.API_URL || 'http://localhost:8080'
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

    useEffect(() => {
        loadClients()
    }, [])

    async function loadClients() {
        const data = await getClients()
        setClients(data)
    }

    async function getClients() {
        try {
            const response = await axios.get(`${API_URL}/api/usuarios`, {
                headers: authHeaders,
            })
            return response.data
        } catch (error) {
            console.error('Erro ao buscar clientes:', error)
            return []
        }
    }

    return (
        <View style={styles.selectionInfo}>
            <Text style={styles.selectionLabel}>Cliente</Text>
            <Pressable
                style={styles.selectButton}
                onPress={() => setClientOpen((value) => !value)}
            >
                <Text style={styles.selectButtonText}>
                    {selectedClient ? selectedClient.username || selectedClient.name || selectedClient.email : 'Selecione um cliente'}
                </Text>
            </Pressable>
            {clientOpen && (
                <View style={styles.selectDropdown}>
                    {clients.map((client) => {
                        const label = client.username || client.name || client.email || `Cliente ${client.id}`
                        return (
                            <Pressable
                                key={`client-${client.id}`}
                                style={styles.selectItem}
                                onPress={() => {
                                    setSelectedClient(client)
                                    setClientOpen(false)
                                }}
                            >
                                <Text style={styles.selectItemText}>{label}</Text>
                            </Pressable>
                        )
                    })}
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
})