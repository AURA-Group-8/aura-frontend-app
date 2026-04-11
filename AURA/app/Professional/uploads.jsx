import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import NavbarPro from './_Components/NavbarPro'
import { useRouter } from 'expo-router'

export default function UploadsScreen() {
    const [selectedFile, setSelectedFile] = useState(null)

    const router = useRouter();


    return (
        <View style={styles.container}>
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.replace('./finances')}>
                        <Ionicons name="chevron-back" size={30} color="#281111" />
                    </Pressable>
                    <Text style={styles.title}>Custos de Materiais</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.description}>
                        Gerencie arquivos de custos de materiais. O upload permite que a IA gere{' '}
                        <Text style={styles.highlight}>observações e análises automáticas</Text> sobre seus dados.
                    </Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <Ionicons name="information-circle" size={20} color="#982546" />
                        <Text style={styles.sectionTitleText}>Como funciona</Text>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoBoxText}>
                            📤 <Text style={{ fontWeight: '600' }}>Upload:</Text> Envie um arquivo com os custos de seus materiais.
                        </Text>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoBoxText}>
                            🤖 <Text style={{ fontWeight: '600' }}>Processamento IA:</Text> A IA analisa automaticamente o arquivo e gera observações sobre tendências, anomalias e recomendações.
                        </Text>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoBoxText}>
                            📥 <Text style={{ fontWeight: '600' }}>Download:</Text> Baixe o arquivo com os campos necessários. <br></br>
                            <Pressable style={styles.downloadButton}>
                                <Text style={styles.downloadButtonText}>Baixar arquivo</Text>
                            </Pressable>
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <Ionicons name="cloud-upload" size={20} color="#982546" />
                        <Text style={styles.sectionTitleText}>Enviar novo arquivo</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button]}
                    >

                        <Ionicons name="add-circle" size={20} color="#FFF" />
                        <Text style={styles.buttonText}>Selecionar arquivo</Text>


                    </TouchableOpacity>


                </View>


            </ScrollView>

            <NavbarPro />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF3DC',
    },
    contentContainer: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#5c0f25',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    highlight: {
        color: '#982546',
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#5c0f25',
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitleText: {
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#982546',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    buttonSecondary: {
        backgroundColor: '#5c0f25',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 10,
    },
    fileItem: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 14,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fileInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileDetails: {
        marginLeft: 12,
        flex: 1,
    },
    fileName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    fileSize: {
        fontSize: 11,
        color: '#999',
    },
    deleteButton: {
        padding: 8,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        color: '#666',
        marginTop: 10,
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
    },
    emptyStateIcon: {
        marginBottom: 10,
    },
    emptyStateText: {
        color: '#999',
        fontSize: 13,
        marginTop: 10,
    },
    infoBox: {
        backgroundColor: '#F0E6E6',
        borderLeftWidth: 4,
        borderLeftColor: '#982546',
        borderRadius: 8,
        padding: 14,
        marginBottom: 15,
    },
    infoBoxText: {
        fontSize: 13,
        color: '#5c0f25',
        lineHeight: 18,

    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 10,
    },
    statusBadgeProcessing: {
        backgroundColor: '#FFF3DC',
    },
    statusBadgeReady: {
        backgroundColor: '#E8F5E9',
    },
    statusBadgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    statusBadgeTextProcessing: {
        color: '#F57F17',
    },
    statusBadgeTextReady: {
        color: '#2E7D32',
    },
    downloadButton: {
        marginTop: 10,
        backgroundColor: '#982546',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },

    downloadButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
})