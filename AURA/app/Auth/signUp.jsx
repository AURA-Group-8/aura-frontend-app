import { useState, useEffect, useContext } from 'react';
import { styles } from '../../styles/styles';
import { Text, View, Image, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import CardPopUp from '../Professional/_Components/card-popUp';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { LanguageContext } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';

export default function SignUp() {
  const router = useRouter();
  const { language, changeLanguage } = useContext(LanguageContext);
  const t = (key) => getTranslation(language, 'signUp', key);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [buttonHovered, setButtonHovered] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

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
      setNameError(t('nameRequired'));
      hasError = true;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError(t('emailRequired'));
      hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError(t('emailInvalid'));
      hasError = true;
    } else {
      setEmailError('');
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      setPhoneError(t('phoneRequired'));
      hasError = true;
    } else if (phoneDigits.length < 10) {
      setPhoneError(t('phoneInvalid'));
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (!password.trim()) {
      setPasswordError(t('passwordRequired'));
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError(t('passwordShort'));
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
        setPopupMessage(t('signupSuccess'));
        setPopupType('success');
        setPopupVisible(true);
      } else {
        setPopupMessage(t('signupError'));
        setPopupType('error');
        setPopupVisible(true);
        console.error('Erro ao realizar cadastro:', response.data);

      }
    }
  }

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} pointerEvents="none">
        <View style={{ flex: 1, backgroundColor: '#281111' }} pointerEvents="auto">


          <Pressable
            onPress={() => router.replace('/Auth/login')}
            style={localStyles.backButton}
            pointerEvents="auto"
          >
            <Ionicons name="chevron-back" size={30} color="#FFF3DC" />
          </Pressable>

          <View style={localStyles.languageSelector} pointerEvents="auto" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
              paddingVertical: 40,
              marginTop: keyboardVisible ? 100 : 0
            }}
            keyboardShouldPersistTaps="handled"
            pointerEvents="auto"
          >

            {!keyboardVisible && (
              <Image
                source={require('../../assets/AURA.png')}
                style={{ width: 150, height: 150, marginBottom: 20 }}
              />
            )}

            <View style={{ width: '100%', alignItems: 'center' }}>
              <Text style={styles.titulo}>{t('title')}</Text>

              <TextInput
                placeholder={t('name')}
                placeholderTextColor="#FFF3DC80"
                value={name}
                onChangeText={setName}
                style={localStyles.input}
              />
              {nameError ? <Text style={localStyles.error}>{nameError}</Text> : null}

              <TextInput
                placeholder={t('email')}
                placeholderTextColor="#FFF3DC80"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={localStyles.input}
              />
              {emailError ? <Text style={localStyles.error}>{emailError}</Text> : null}

              <TextInput
                placeholder={t('phone')}
                placeholderTextColor="#FFF3DC80"
                value={phone}
                onChangeText={(text) => setPhone(formatPhone(text))}
                keyboardType="phone-pad"
                style={localStyles.input}
                maxLength={16}
              />
              {phoneError ? <Text style={localStyles.error}>{phoneError}</Text> : null}

              <View style={localStyles.inputContainer}>
                <TextInput
                  placeholder={t('password')}
                  placeholderTextColor="#FFF3DC80"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  style={localStyles.input}
                />
                <Pressable
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={localStyles.eyeIcon}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    size={24}
                    color="#FFF3DC"
                  />
                </Pressable>
              </View>
              {passwordError ? <Text style={localStyles.error}>{passwordError}</Text> : null}

              <Text style={localStyles.Textlink}>
                {t('haveAccount')}{' '}
                <Text
                  style={localStyles.link}
                  onPress={() => router.replace('/Auth/login')}
                >
                  {t('login')}
                </Text>
              </Text>

              <Pressable
                style={[
                  styles.btnLogin,
                  { backgroundColor: '#fff3dc', opacity: buttonHovered ? 0.8 : 1 }
                ]}
                onPress={SignUp}
              >
                <Text style={[styles.btnLoginText, { color: '#281111' }]}>
                  {t('createButton')}
                </Text>
              </Pressable>
            </View>

          </ScrollView>

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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    top: 40,
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
    color: '#281111',
  },
  inputContainer: {
    position: 'relative',
    width: 300,
  },
  input: {
    backgroundColor: '#fff3dc1a',
    color: '#FFF3DC',
    borderWidth: 2,
    borderColor: '#FFF3DC',
    width: 300,
    padding: 12,
    paddingRight: 45,
    borderRadius: 20,
    marginBottom: 20,
    fontWeight: '500',
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
  },

  Textlink: {
    color: '#fff6e5',
    marginBottom: 20,

  },

  link: {
    color: '#FFF3DC',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
