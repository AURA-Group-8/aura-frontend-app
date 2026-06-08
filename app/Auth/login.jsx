import { useEffect, useState, useContext } from 'react';
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
import { LanguageContext } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';

export default function Login() {
  let token = null;
  const router = useRouter();
  const { language, changeLanguage } = useContext(LanguageContext);
  const t = (key) => getTranslation(language, 'login', key);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [buttonHovered, setButtonHovered] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [senhaVisible, setSenhaVisible] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');

  async function handleLogin() {
    setIsLoading(true);
    let hasError = false;

    if (!email.trim()) {
      setEmailError(t('emailRequired'));
      hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError(t('emailInvalid'));
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!senha.trim()) {
      setSenhaError(t('passwordRequired'));
      hasError = true;
    } else if (senha.length < 6) {
      setSenhaError(t('passwordShort'));
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
            setPopupMessage(t('loginSuccess'));
            setPopupType('success');
            setPopupVisible(true);

            setTimeout(() => {
              router.push('/Professional/schedules-home');
              setIsLoading(false);
            }, 1500);
          } else {
            setPopupMessage(t('loginSuccess'));
            setPopupType('success');
            setPopupVisible(true);

            setTimeout(() => {
              router.push('/Client/schedules');
              setIsLoading(false);
            }, 1500);
          }
        } else {
          setPopupMessage(t('loginError'));
          setPopupType('error');
          setPopupVisible(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erro no login:', error);
        setPopupMessage(t('loginError'));
        setPopupType('error');
        setPopupVisible(true);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
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
      <LinearGradient
        colors={['#4f1223', '#8a1c3a']}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <Pressable onPress={() => router.replace('/')} style={localStyles.backButton} pointerEvents="auto">
            <Ionicons name="chevron-back" size={30} color="#FFF3DC" />
          </Pressable>

          <View style={localStyles.languageSelector} pointerEvents="auto">
            <Pressable
              onPress={() => changeLanguage('pt')}
              style={[
                localStyles.languageBtnPT,
                language === 'pt' && localStyles.languageBtnActive
              ]}
            >
              <Text style={[
                localStyles.languageText,
                language === 'pt' && localStyles.languageTextActive
              ]}>PT</Text>
            </Pressable>
            <Pressable
              onPress={() => changeLanguage('en')}
              style={[
                localStyles.languageBtnEN,
                language === 'en' && localStyles.languageBtnActive
              ]}
            >
              <Text style={[
                localStyles.languageText,
                language === 'en' && localStyles.languageTextActive
              ]}>EN</Text>
            </Pressable>
          </View>
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
              <Text style={styles.titulo}>{t('title')}</Text>

              <TextInput
                placeholder={t('email')}
                placeholderTextColor="#FFF3DC80"
                value={email}
                onChangeText={setEmail}
                style={localStyles.input}
              />
              {emailError ? <Text style={localStyles.error}>{emailError}</Text> : null}

              <View style={localStyles.inputContainer}>
                <TextInput
                  placeholder={t('password')}
                  placeholderTextColor="#FFF3DC80"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!senhaVisible}
                  style={localStyles.input}
                />
                <Pressable
                  onPress={() => setSenhaVisible(!senhaVisible)}
                  style={localStyles.eyeIcon}
                >
                  <Ionicons
                    name={senhaVisible ? 'eye' : 'eye-off'}
                    size={24}
                    color="#FFF3DC"
                  />
                </Pressable>
              </View>
              {senhaError ? <Text style={localStyles.error}>{senhaError}</Text> : null}

              <Text style={localStyles.Textlink}>
                {t('noAccount')}{' '}
                <Text style={localStyles.link} onPress={() => router.replace('/Auth/signUp')}>
                  {t('signUp')}
                </Text>
              </Text>
              
              <Text 
                style={localStyles.link} 
                onPress={() => router.push('/Auth/forgot-password')}
              >
                {t('forgotPassword')}
              </Text>
              

              <Pressable
                style={[
                  styles.btnLogin,
                  {
                    backgroundColor: isButtonPressed ? '#e6e6cc' : '#fff3dc',
                    opacity: isLoading ? 0.6 : 1,
                  }
                ]}
                onPress={handleLogin}
                onPressIn={() => setIsButtonPressed(true)}
                onPressOut={() => setIsButtonPressed(false)}
                disabled={isLoading}
              >
                <Text style={[styles.btnLoginText, { color: '#5c0f25' }]}>
                  {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
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
        </View>
      </LinearGradient>
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
  languageSelector: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 100,
    flexDirection: 'row',
    gap: 8,
  },
  languageBtnPT: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF3DC',
    backgroundColor: 'transparent',
  },
  languageBtnEN: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF3DC',
    backgroundColor: 'transparent',
  },
  languageBtnActive: {
    backgroundColor: '#FFF3DC',
  },
  languageText: {
    color: '#FFF3DC',
    fontWeight: '600',
    fontSize: 12,
  },
  languageTextActive: {
    color: '#5c0f25',
  },
  inputContainer: {
    position: 'relative',
    width: 300,
  },
  input: {
    backgroundColor: '#5c0f25',
    color: '#FFF3DC',
    borderWidth: 2,
    borderColor: '#FFF3DC',
    width: 300,
    padding: 12,
    paddingRight: 45,
    borderRadius: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
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