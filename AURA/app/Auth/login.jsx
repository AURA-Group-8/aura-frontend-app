import { useState } from 'react';
import { styles } from '../../styles/styles';
import { Text, View, Image, Pressable, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import CardPopUp from '../Professional/_Components/card-popUp';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  let token = null; 
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [buttonHovered, setButtonHovered] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');

  async function handleLogin() {
    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Email inválido');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!senha.trim()) {
      setSenhaError('Senha é obrigatória');
      hasError = true;
    } else if (senha.length < 6) {
      setSenhaError('Senha deve ter pelo menos 6 dígitos');
    hasError = true;
    } else {
      setSenhaError('');
    }

    if (!hasError) {
      try {
        const loginResponse = await axios(`${API_URL}/api/usuarios/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            email: email,
            password: senha
          })        

        });
        console.log('Login response:', loginResponse);

        token = loginResponse.data?.token || loginResponse.data?.accessToken || loginResponse.data?.access_token;
        await AsyncStorage.setItem('token', token);


        if (loginResponse.status === 200) {
          const userResponse = await axios.get(`${API_URL}/api/usuarios/${loginResponse.data.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

        
          const userData = userResponse.data;

          if (userData.role.id === 1) {
            setPopupMessage('Login realizado com sucesso!');
            setPopupType('success');
            setPopupVisible(true);

            setTimeout(() => {
              router.push('/Professional/schedules-home');
            }, 1500);
          } else {
            setPopupMessage('Login realizado com sucesso!');
            setPopupType('success');
            setPopupVisible(true);

            setTimeout(() => {
              router.push('/Client/schedules');
            }, 1500);
          }
        } else {
          setPopupMessage('Erro ao realizar login. Tente novamente.');
          setPopupType('error');
          setPopupVisible(true);
        }
      } catch (error) {
        console.error('Erro no login:', error);
        setPopupMessage('Erro ao realizar login. Tente novamente.');
        setPopupType('error');
        setPopupVisible(true);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#4f1223', '#8a1c3a']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={localStyles.container}
    >
      <Pressable
        onPress={() => router.back()}
        style={localStyles.backButton}
      >
        <Ionicons name="chevron-back" size={30} color="#FFF3DC" />
      </Pressable>

      <View style={styles.container}>
        <Image source={require('../../assets/AURA.png')} style={[styles.img, { width: 250, height: 250 }]} />
      </View>

      <View style={[styles.containerButton, { flex: 2 }]}>
        <Text style={styles.titulo}>Login</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#FFF3DC80"
          value={email}
          onChangeText={setEmail}
          style={localStyles.input}
        />
        {emailError ? <Text style={localStyles.error}>{emailError}</Text> : null}

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#FFF3DC80"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={localStyles.input}
        />
        {senhaError ? <Text style={localStyles.error}>{senhaError}</Text> : null}
        <Link href="/Auth/forgot-password">
          <Text style={{ color: '#FFF3DC', textDecorationLine: 'underline' }}>Esqueci minha senha</Text>
        </Link>
          <Text style={localStyles.Textlink}> Ainda não tem uma conta? <Text style={localStyles.link} onPress={() => router.replace('/Auth/signUp')}>Cadastre-se</Text></Text>  

        <Pressable
          style={[styles.btnLogin, { backgroundColor: '#fff3dc', color: '#5c0f25', opacity: buttonHovered ? 0.8 : 1 }]}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          onPress={handleLogin}
        >
          <Text style={[styles.btnLoginText, { color: '#5c0f25' }]}>ENTRAR</Text>
        </Pressable>

        <CardPopUp
          visible={popupVisible}
          message={popupMessage}
          type={popupType}
          onClose={() => setPopupVisible(false)}
        />
      </View>
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  input: {
    backgroundColor: '#5c0f25',
    color: '#FFF3DC',
    borderWidth: 2,
    borderColor: '#FFF3DC',
    width: 300,
    padding: 12,
    borderRadius: 20,
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