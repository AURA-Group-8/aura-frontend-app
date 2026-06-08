import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

export default function TimeInput({ label, value, onChangeText }) {
  const [time, setTime] = useState(value || '')

  const handleChange = (text) => {
    const formatted = text.replace(/[^0-9]/g, '').slice(0, 4)
    let formattedTime = formatted

    if (formatted.length >= 3) {
      formattedTime = `${formatted.slice(0, 2)}:${formatted.slice(2)}`
    } else if (formatted.length >= 2) {
      formattedTime = `${formatted.slice(0, 2)}`
    }

    setTime(formattedTime)
    if (onChangeText) {
      onChangeText(formattedTime)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={time}
        onChangeText={handleChange}
        placeholder="HH:MM"
        keyboardType="numeric"
        maxLength={5}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 14,
    color: '#5c3b3b',
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e8d6c8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
})