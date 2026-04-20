import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native'
import AgendaTab from './_Components/agendaSett';
import ContaTab from './_Components/contaSett';
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'

// 2. Pegar a largura da tela
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING = 16;
const TAB_WIDTH = SCREEN_WIDTH - (PADDING * 2);

export default function Configuracoes() {
  const [aba, setAba] = useState('conta')
  const anim = useRef(new Animated.Value(0)).current
  const router = useRouter()

  function trocarAba(novaAba) {
    setAba(novaAba)

    Animated.timing(anim, {
      toValue: novaAba === 'conta' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/Professional/moreScreen')}>
          <Feather name="arrow-left" size={30}/>
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, aba === 'conta' && styles.activeTab]}
          onPress={() => trocarAba('conta')}
        >
          <Text style={{ fontWeight: aba === 'conta' ? 'bold' : 'normal' }}>Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, aba === 'agenda' && styles.activeTab]}
          onPress={() => trocarAba('agenda')}
        >
          <Text style={{ fontWeight: aba === 'agenda' ? 'bold' : 'normal' }}>Agenda</Text>
        </TouchableOpacity>
      </View>

      <View style={{ overflow: 'hidden', flex: 1 }}> 
        <Animated.View
          style={{
            flexDirection: 'row',
            width: TAB_WIDTH * 2,
            transform: [
              {
                translateX: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -TAB_WIDTH],
                }),
              },
            ],
          }}
        >
          <View style={{ width: TAB_WIDTH }}>
            <ContaTab />
          </View>

          <View style={{ width: TAB_WIDTH }}>
            <AgendaTab />
          </View>
        </Animated.View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e8df',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#7a2d2d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#e8d6c8',
    borderRadius: 12,
    marginBottom: 16,
    padding: 4, 
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
})