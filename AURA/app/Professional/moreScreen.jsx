import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import NavbarPro from './_Components/NavbarPro'
import { router } from 'expo-router'

export default function MaisScreen() {
    return (
        <View style={styles.container}>
            
            <Text style={styles.title}>Mais</Text>

            <View style={styles.containerGeneral}>

                <View style={styles.profileCard}>
                    <View style={styles.iconCircle}>
                        <Feather name="user" size={22} color="#7a4b4b" />
                    </View>

                    <View>
                        <Text style={styles.name}>Dra. Amanda Costa</Text>
                        <Text style={styles.email}>brunakrengl@gmail.com</Text>
                    </View>
                </View>

                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Professional/settings')}>
                        <Feather name="settings" size={18} color="#7a4b4b" />
                        <Text style={styles.menuText}>Configurações</Text>
                        <Feather name="chevron-right" size={18} color="#7a4b4b" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Professional/notifications')}>
                        <Feather name="bell" size={18} color="#7a4b4b" />
                        <Text style={styles.menuText}>Notificações</Text>
                        <Feather name="chevron-right" size={18} color="#7a4b4b" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
                        <Text style={[styles.menuText, { color: '#e74c3c' }]}>
                            Sair da conta
                        </Text>
                        <Feather name="chevron-right" size={18} color="#7a4b4b" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.version}>AURA v1.0.0</Text>

            </View>

            <NavbarPro active="more" />

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff3dc',
        paddingTop: 15,
        paddingHorizontal: 1,
    },

    containerGeneral: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20
    },

    title: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#5c0f25',
        marginBottom: 20,
    },

    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },

    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f1e3d9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    name: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#3d2b2b',
    },

    email: {
        fontSize: 13,
        color: '#7a6a6a',
    },

    menu: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },

    menuText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: '#5c3b3b',
    },

    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginLeft: 16,
    },

    version: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 12,
        color: '#9b8b8b',
    },
})