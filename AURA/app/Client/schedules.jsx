import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';


export default function Schedules() {

   useEffect(() => {
    if (Platform.OS === 'android') {
      import('expo-navigation-bar').then(NavigationBar => {
        NavigationBar.setVisibilityAsync('hidden');
        NavigationBar.setBehaviorAsync('overlay-swipe');
      });
    }
  }, []);

  const router = useRouter();

  const agendamentos = [
    { id: 1, servico: "Corte de Cabelo", data: "10/03/2026 - 14:00", valor: "R$ 40" },
    { id: 2, servico: "Barba", data: "12/03/2026 - 16:30", valor: "R$ 25" },
    { id: 3, servico: "Corte + Barba", data: "18/03/2026 - 11:00", valor: "R$ 60" },
    { id: 4, servico: "Hidratação", data: "22/03/2026 - 13:30", valor: "R$ 50" },
    { id: 5, servico: "Corte Social", data: "28/03/2026 - 15:00", valor: "R$ 45" },
    { id: 6, servico: "Corte Infantil", data: "30/03/2026 - 10:00", valor: "R$ 30" },
    { id: 7, servico: "Corte + Hidratação", data: "05/04/2026 - 14:30", valor: "R$ 80" },
    { id: 8, servico: "Barba + Hidratação", data: "12/04/2026 - 16:00", valor: "R$ 70" },
  ];

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Seus Agendamentos</Text>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {agendamentos.map((item) => (
          <View key={item.id} style={styles.card}>

            <Text style={styles.servico}>{item.servico}</Text>

            <Text style={styles.info}>
              Data: {item.data}
            </Text>

            <Text style={styles.valor}>
              {item.valor}
            </Text>

          </View>
        ))}

      </ScrollView>


      <View style={styles.navbar}>

   <Pressable 
    style={styles.navItem}
    onPress={() => router.push('/servicos')}
  >
    <Ionicons name="cut-outline" size={28} color="#982546" />
  </Pressable>

  <Pressable 
    style={styles.navItem}
    onPress={() => router.push('/carrinho')}
  >
    <Ionicons name="cart-outline" size={28} color="#982546" />
  </Pressable>

  <Pressable 
    style={styles.navItem}
    onPress={() => router.push('/perfil')}
  >
    <Ionicons name="person-outline" size={28} color="#982546" />
  </Pressable>

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

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#281111',
    marginBottom: 20
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

  navbar: {
  height: 70,
  flexDirection: 'row',
  borderTopWidth: 1,
  borderColor: '#982546',
  backgroundColor: '#fff3dc',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderRadius: 12,
},

navItem: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 25
}

});