import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Navbar from './_Component/Navbar';

export default function Schedules() {

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  const router = useRouter();

  const agendamentos = [
    { id: 1, servico: "Design de Sobrancelhas", data: "10/03/2026 - 14:00", valor: "R$ 40", status: "Concluído" },
    { id: 2, servico: "Extensão de Cílios", data: "12/03/2026 - 16:30", valor: "R$ 80", status: "Concluído" },
    { id: 3, servico: "Design com henna", data: "18/03/2026 - 11:00", valor: "R$ 25", status: "Concluído" },
    { id: 4, servico: "Volume brasileiro de Cílios", data: "22/03/2026 - 13:30", valor: "R$ 30", status: "Concluído" },
    { id: 5, servico: "Micropigmentação de Sobrancelhas", data: "28/03/2026 - 15:00", valor: "R$ 150", status: "Pendente" },
    { id: 6, servico: "Lifting de Cílios", data: "30/03/2026 - 10:00", valor: "R$ 60", status: "Pendente" },
    { id: 7, servico: "Depilação de Sobrancelhas", data: "05/04/2026 - 14:30", valor: "R$ 20", status: "Pendente" },
    { id: 8, servico: "Volume Russo de Cílios", data: "12/04/2026 - 16:00", valor: "R$ 100", status: "Pendente" },
  ];

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/Auth/login')}>
          <Ionicons name="chevron-back" size={30} color="#281111" />
        </Pressable>
        <Text style={styles.title}>Meus Agendamentos</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        <Pressable style={styles.button}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Novo Agendamento</Text>
        </Pressable>

        {agendamentos.map((item) => (
          <View key={item.id} style={styles.card}>

            <Text style={styles.servico}>{item.servico}</Text>

            <Text style={styles.info}>
              Data: {item.data}
            </Text>

            <Text style={styles.valor}>
              {item.valor}
            </Text>

            <Text style={[styles.status, item.status === 'Concluído' ? styles.statusConcluido : styles.statusPendente]}>
              Status: {item.status}
            </Text>

          </View>
        ))}

      </ScrollView>

      <View>

        <Navbar/>

      </View>

</View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF3DC',
    paddingTop: 60
  },

  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
    paddingHorizontal: 20,
    marginBottom: 40
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#281111',
  },

  scroll: {
    paddingHorizontal: 20
  },

  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#982546'
  },

  servico: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  info: {
    marginTop: 6,
    color: '#555'
  },

  valor: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#982546'
  },

  status: {
    marginTop: 8,
    fontWeight: 'bold',
  },

  statusConcluido: {
    color: 'green',
  },

  statusPendente: {
    color: 'red',
  },

  button: {
    backgroundColor: '#982546',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,

  },
});
