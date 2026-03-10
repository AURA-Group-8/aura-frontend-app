import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';


export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    console.log(name, email, phone, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image
        source={require('../../assets/AURA.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}> Criar Conta </Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Nome Completo"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Telefone"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />

        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}> Cadastrar </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#281111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF3DC',
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#982546',
    backgroundColor: '#fff3dc',
    color: '#281111',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    width: 350,
  },
  button: {
    marginTop: 10,
    alignSelf: 'center',
    width: 175,
  borderWidth: 2,
  borderColor: '#982546',
  backgroundColor: '#FFF3DC',
  padding: 15,
  borderRadius: 8,
  alignItems: 'center',
},
  buttonText: {
    color: '#982546',
    fontWeight: 'bold',
  },
});