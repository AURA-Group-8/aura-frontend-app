import React from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  Dimensions, 
  Platform 
} from 'react-native'
import TimeInput from "./TimeInput";

const { width } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

export default function AgendaTab() {
  const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Dias de Atendimento</Text>
        {diasDaSemana.map((dia, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.dayText}>{dia}</Text>
            <Switch 
              value={i !== 6} 
              trackColor={{ false: "#767577", true: "#00A884" }}
              thumbColor={Platform.OS === 'ios' ? undefined : "#f4f3f4"}
            />
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Horário Comercial</Text>
        <View style={styles.rowInputs}>
          <View style={styles.inputWrapper}>
            <TimeInput label="Início" value="08:00" />
          </View>
          <View style={styles.inputWrapper}>
            <TimeInput label="Término" value="18:00" />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Intervalo / Pausa</Text>
        <View style={styles.rowInputs}>
          <View style={styles.inputWrapper}>
            <TimeInput label="Início" value="12:00" />
          </View>
          <View style={styles.inputWrapper}>
            <TimeInput label="Término" value="13:00" />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: scale(16),
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: scale(20),
    borderRadius: scale(16),
    marginBottom: scale(16),
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: scale(16),
    fontWeight: 'bold',
    marginBottom: scale(15),
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
    height: scale(30),
  },
  dayText: {
    fontSize: scale(15),
    color: '#444',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: scale(5),
  },
})