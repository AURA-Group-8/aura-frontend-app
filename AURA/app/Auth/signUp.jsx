import { useState } from 'react';
import { styles } from '../../styles/styles';
import { Text, View, Image, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import CardPopUp from '../Professional/_Components/card-popUp';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [buttonHovered, setButtonHovered] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  async function SignUp() {

    let hasError = false;

    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Email inválido');
      hasError = true;
    } else {
      setEmailError('');
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      setPhoneError('Telefone é obrigatório');
      hasError = true;
    } else if (phoneDigits.length < 10) {
      setPhoneError('Telefone inválido');
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (!password.trim()) {
      setPasswordError('Senha é obrigatória');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Senha deve ter pelo menos 6 dígitos');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) {
      return;
    } else {

      const response = await axios(`${API_URL}/api/usuarios`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          username: name,
          email: email,
          phone: phone.replace(/\D/g, ''),
          password: password
        }),

      });

      if (response.status === 201) {
        setPopupMessage('Cadastro realizado com sucesso!');
        setPopupType('success');
        setPopupVisible(true);
      } else {
        setPopupMessage('Erro ao realizar cadastro. Tente novamente.');
        setPopupType('error');
        setPopupVisible(true);
        console.error('Erro ao realizar cadastro:', response.data);

      }
    }

  }


  return (
    <View style={localStyles.container}>

      <Pressable
        onPress={() => router.replace('/Auth/login')}
        style={localStyles.backButton}
      >
        <Ionicons name="chevron-back" size={30} color="#FFF3DC" />
      </Pressable>

      <View style={styles.container}>
        <Image source={require('../../assets/AURA.png')} style={[styles.img, { width: 150, height: 150 }]} />
      </View>

      <View style={[styles.containerButton, { flex: 4 }]}>
        <Text style={styles.titulo}>Criar Conta</Text>

        <TextInput
          placeholder="Nome Completo"
          placeholderTextColor="#FFF3DC80"
          value={name}
          onChangeText={setName}
          style={localStyles.input}
        />
        {nameError ? <Text style={localStyles.error}>{nameError}</Text> : null}

        <TextInput
          placeholder="Email"
          placeholderTextColor="#FFF3DC80"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={localStyles.input}
        />
        {emailError ? <Text style={localStyles.error}>{emailError}</Text> : null}

        <TextInput
          placeholder="Telefone"
          placeholderTextColor="#FFF3DC80"
          value={phone}
          onChangeText={(text) => setPhone(formatPhone(text))}
          keyboardType="phone-pad"
          style={localStyles.input}
          maxLength={16}
        />
        {phoneError ? <Text style={localStyles.error}>{phoneError}</Text> : null}

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#FFF3DC80"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={localStyles.input}
        />
        {passwordError ? <Text style={localStyles.error}>{passwordError}</Text> : null}

        <Text style={localStyles.Textlink}>
          Já tem uma conta?{' '}
          <Text style={localStyles.link} onPress={() => router.replace('/Auth/login')}>
            Faça login
          </Text>
        </Text>

        <Pressable
          style={[styles.btnLogin, { backgroundColor: '#fff3dc', opacity: buttonHovered ? 0.8 : 1 }]}
          onPress={SignUp}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
        >
          <Text style={[styles.btnLoginText, { color: '#281111' }]}>CADASTRAR</Text>
        </Pressable>
      </View>

      <CardPopUp
        visible={popupVisible}
        message={popupMessage}
        type={popupType}
        onClose={() => {
          setPopupVisible(false);

          if (popupType === 'success') {
            router.push('/Auth/login');
          }
        }}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#281111',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  input: {
    backgroundColor: '#fff3dc1a',
    color: '#FFF3DC',
    borderWidth: 2,
    borderColor: '#FFF3DC',
    width: 300,
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    fontWeight: '500',
  },
  error: {
    color: '#fa8585',
    fontSize: 12,
  },

  Textlink: {
    color: '#fff6e5',
    
  },

  link: {
    color: '#FFF3DC',
      textDecorationLine: 'underline',
      fontWeight: '500',
  },
});
