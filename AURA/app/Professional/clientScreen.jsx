import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import NavbarPro from './_Components/NavbarPro'

const clientes = [
  {
    id: '1',
    nome: 'Maria Silva',
    telefone: '(11) 99999-1234',
    data: '14 de maio',
    obs: 'Prefere horários pela manhã'
  },
  {
    id: '2',
    nome: 'Ana Santos',
    telefone: '(11) 99999-5678',
    data: '21 de agosto',
    obs: ''
  },
  {
    id: '3',
    nome: 'Carla Oliveira',
    telefone: '(11) 99999-9012',
    data: '02 de dezembro',
    obs: 'Alérgica a alguns produtos'
  }
]

export default function ClientesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>
      
      <View style={styles.containerGeneral}>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar cliente..."
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={18} color="#7a4b4b" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={clientes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Feather name="message-circle" size={18} color="#7a4b4b" />
              </View>

              <View style={styles.row}>
                <Feather name="phone" size={14} color="#7a4b4b" />
                <Text style={styles.text}>{item.telefone}</Text>
              </View>

              <View style={styles.row}>
                <Feather name="calendar" size={14} color="#7a4b4b" />
                <Text style={styles.text}>{item.data}</Text>
              </View>

              {item.obs !== '' && (
                <View style={styles.obs}>
                  <Text style={styles.obsText}>{item.obs}</Text>
                </View>
              )}
            </View>
          )}
        />
      </View>

      <NavbarPro active="Clientes"/>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3dc',
    paddingTop: 1,
    paddingHorizontal: 1
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#5c0f25',
    backgroundColor: '#fff3dc',
    height: 60,
    fontSize: 28,
    paddingTop: 15
  },
  containerGeneral: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8d6c8',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40
  },
  sendButton: {
    padding: 6
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#3d2b2b'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  text: {
    marginLeft: 6,
    color: '#5c3b3b'
  },
  obs: {
    marginTop: 10,
    backgroundColor: '#f1e3d9',
    padding: 8,
    borderRadius: 10
  },
  obsText: {
    fontSize: 12,
    color: '#6b4b4b'
  }
})