import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native'
import AgendaTab from './_Components/agendaSett';
import ContaTab from './_Components/contaSett';

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
          <Feather name="arrow-left" size={30}/>
        <Text style={styles.title}>Configurações</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={{ color: '#fff' }}>Salvar</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, aba === 'conta' && styles.activeTab]}
          onPress={() => trocarAba('conta')}
        >
          <Text>Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, aba === 'agenda' && styles.activeTab]}
          onPress={() => trocarAba('agenda')}
        >
          <Text>Agenda</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{
          flexDirection: 'row',
          width: '200%',
          transform: [
            {
              translateX: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -350],
              }),
            },
          ],
        }}
      >
        <View style={{ width: 350 }}>
          <ContaTab />
        </View>

        <View style={{ width: 350 }}>
          <AgendaTab />
        </View>
      </Animated.View>

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
  },

  title: {
    fontWeight: 'bold',
  },

  saveBtn: {
    backgroundColor: '#7a2d2d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#e8d6c8',
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    
  },

  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
})