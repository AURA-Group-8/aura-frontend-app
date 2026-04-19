import React from 'react'
import { View, Text, StyleSheet, Switch } from 'react-native'
import TimeInput from "./TimeInput";

export default function AgendaTab() {
  return (
    <View>

      <View style={styles.card}>
        <Text style={styles.title}>Dias de Atendimento</Text>

        {['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'].map((dia, i) => (
          <View key={i} style={styles.row}>
            <Text>{dia}</Text>
            <Switch value={i !== 6} />
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Horário Comercial</Text>

        <View style={styles.rowInputs}>
          <TimeInput label="Início" value="08:00" />
          <TimeInput label="Término" value="18:00" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Intervalo / Pausa</Text>

        <View style={styles.rowInputs}>
          <TimeInput label="Início" value="12:00" />
          <TimeInput label="Término" value="13:00" />
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
})