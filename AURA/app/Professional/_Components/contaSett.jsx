import React from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native'

const { width, height } = Dimensions.get('window');

const scale = (size) => (width / 375) * size;

export default function ContaTab() {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Informações da Empresa</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CNPJ</Text>
            <TextInput 
              style={styles.input} 
              value="12.345.678/0001-90" 
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do estabelecimento</Text>
            <TextInput 
              style={styles.input} 
              value="Studio AURA Estética" 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone comercial</Text>
            <TextInput 
              style={styles.input} 
              value="(11) 99999-0000" 
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: scale(20),
    borderRadius: scale(16),
    width: '100%',
    maxWidth: 500,
    
  
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: scale(18),
    fontWeight: '700',
    marginBottom: scale(20),
    color: '#333',
  },
  inputGroup: {
    width: '100%',
    marginBottom: scale(15),
  },
  label: {
    fontSize: scale(13),
    color: '#666',
    marginBottom: scale(6),
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#EDE0D4',
    paddingHorizontal: scale(15),
    height: scale(48), 
    borderRadius: scale(10),
    fontSize: scale(15),
    color: '#333',
  },
})