import { useEffect, useState } from 'react';
import { styles } from '../../styles/styles';
import { Text, View, Image, Pressable, TextInput, StyleSheet, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import CardPopUp from '../Professional/_Components/card-popUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';

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
        await AsyncStorage.setItem('userId', loginResponse.data.id.toString());
        await AsyncStorage.setItem('userName', loginResponse.data.username);


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

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#4f1223', '#8a1c3a']}
          style={{ flex: 1 }}
        >
          <Pressable onPress={() => router.back()} style={localStyles.backButton}>
              <Ionicons name="chevron-back" size={30} color="#FFF3DC" />
            </Pressable>

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: keyboardVisible ? 'flex-start' : 'center',
              alignItems: 'center',
              paddingVertical: 60,
              marginTop: keyboardVisible ? 100 : 0
            }}
            keyboardShouldPersistTaps="handled"
          >
            
            {!keyboardVisible && (
              <Image
                source={require('../../assets/AURA.png')}
                style={{
                  width: 250,
                  height: 250,
                  marginBottom: 20
                }}
              />
            )}

            <View style={{ width: '100%', alignItems: 'center' }}>
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

              <Text style={localStyles.Textlink}>
                Não tem uma conta?{' '}
                <Text style={localStyles.link} onPress={() => router.push('/Auth/signUp')}>
                  Cadastre-se
                </Text>
              </Text>

              <Pressable
                style={[styles.btnLogin, { backgroundColor: '#fff3dc' }]}
                onPress={handleLogin}
              >
                <Text style={[styles.btnLoginText, { color: '#5c0f25' }]}>
                  ENTRAR
                </Text>
              </Pressable>

              <CardPopUp
                visible={popupVisible}
                message={popupMessage}
                type={popupType}
                onClose={() => setPopupVisible(false)}
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    marginBottom: 20,
  },
  error: {
    color: '#fa8585',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -10,
  },
  Textlink: {
    color: '#fff6e5',
    marginBottom: 20,

  },

  link: {
    color: '#FFF3DC',
    textDecorationLine: 'underline',
    fontWeight: '500',
    marginBottom: 40,
  },
});