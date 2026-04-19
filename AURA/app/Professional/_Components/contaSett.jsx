import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

export default function ContaTab() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Informações da Empresa</Text>

      <Text style={styles.label}>CNPJ</Text>
      <TextInput style={styles.input} value="12.345.678/0001-90" />

      <Text style={styles.label}>Nome do estabelecimento</Text>
      <TextInput style={styles.input} value="Studio AURA Estética" />

      <Text style={styles.label}>Telefone comercial</Text>
      <TextInput style={styles.input} value="(11) 99999-0000" />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
  },

  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    marginTop: 10,
  },

  input: {
    backgroundColor: '#f1e3d9',
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
})