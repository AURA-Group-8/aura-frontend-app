import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardPopUp from '../Professional/_Components/card-popUp';

export default function ValidateToken() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

  const [token] = useState(params?.token || '');
  const [userId] = useState(params?.userId || '');
  const [email] = useState(params?.email || '');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Pop-up state
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');

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

  const validatePasswords = () => {
    let hasError = false;

    const passwordTrim = password.trim();
    const confirmTrim = confirmPassword.trim();

    // Regex para detectar emojis
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u;

    // Validar se campos estão preenchidos
    if (!passwordTrim) {
      setPasswordError('Senha é obrigatória');
      hasError = true;
    } else if (emojiRegex.test(passwordTrim)) {
      setPasswordError('Emojis não são permitidos na senha');
      hasError = true;
    } else if (passwordTrim.length < 6) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!confirmTrim) {
      setConfirmPasswordError('Confirmação de senha é obrigatória');
      hasError = true;
    } else if (emojiRegex.test(confirmTrim)) {
      setConfirmPasswordError('Emojis não são permitidos na senha');
      hasError = true;
    } else if (confirmTrim.length < 6) {
      setConfirmPasswordError('A senha deve ter no mínimo 6 caracteres');
      hasError = true;
    } else if (passwordTrim !== confirmTrim) {
      setConfirmPasswordError('As senhas não coincidem');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    return !hasError;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) {
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const authToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');

      const requestUserId = userId || storedUserId;

      const response = await axios(`${API_URL}/api/usuarios/${requestUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        data: JSON.stringify({
          password: password.trim(),
        }),
      });

      console.log('Senha alterada com sucesso:', response.data);

      setPopupMessage('Senha alterada com sucesso!');
      setPopupType('success');
      setPopupVisible(true);

      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.push('/Auth/login');
      }, 1500);
    } catch (error) {
      console.error('Erro ao alterar senha:', error.response?.data || error.message);
      setPopupMessage('Erro ao alterar a senha. Tente novamente.');
      setPopupType('error');
      setPopupVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardPopUp
            visible={popupVisible}
            message={popupMessage}
            type={popupType}
            onClose={() => setPopupVisible(false)}
            duration={1500}
          />

          <Pressable onPress={() => router.back()} style={localStyles.backButton}>
            <Ionicons name="chevron-back" size={30} color="#FFF3DC" />
          </Pressable>

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingBottom: keyboardVisible ? 20 : 0,
            }}
          >
            <View style={localStyles.container}>
              <Text style={localStyles.title}>Alterar Senha</Text>

              <View style={localStyles.formContainer}>
                <Text style={localStyles.label}>Nova Senha:</Text>

                <TextInput
                  style={[
                    localStyles.textInput,
                    passwordError && localStyles.textInputError,
                  ]}
                  placeholder="Digite a nova senha"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  secureTextEntry
                  editable={!isSubmitting}
                />

                {passwordError && (
                  <Text style={localStyles.errorText}>{passwordError}</Text>
                )}

                <Text style={[localStyles.label, { marginTop: 16 }]}>
                  Confirmar Senha:
                </Text>

                <TextInput
                  style={[
                    localStyles.textInput,
                    confirmPasswordError && localStyles.textInputError,
                  ]}
                  placeholder="Confirme a nova senha"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  secureTextEntry
                  editable={!isSubmitting}
                />

                {confirmPasswordError && (
                  <Text style={localStyles.errorText}>{confirmPasswordError}</Text>
                )}

                <View style={localStyles.buttonContainer}>
                  <Pressable
                    style={localStyles.cancelButton}
                    onPress={() => router.back()}
                    disabled={isSubmitting}
                  >
                    <Text style={localStyles.cancelButtonText}>Cancelar</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      localStyles.submitButton,
                      isSubmitting && localStyles.submitButtonDisabled,
                    ]}
                    onPress={handleChangePassword}
                    disabled={isSubmitting}
                  >
                    <Text style={localStyles.submitButtonText}>
                      {isSubmitting ? 'Alterando...' : 'Alterar'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const localStyles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },

  container: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF3DC',
    marginBottom: 32,
    textAlign: 'center',
  },

  formContainer: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#982546',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(79, 18, 35, 0.5)',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF3DC',
    marginBottom: 12,
  },

  textInput: {
    backgroundColor: '#FFFFFF',
    color: '#362323',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
  },

  textInputError: {
    borderColor: '#DC4C4C',
  },

  errorText: {
    color: '#DC4C4C',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    justifyContent: 'space-between',
  },

  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#982546',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: '#982546',
    fontSize: 16,
    fontWeight: '600',
  },

  submitButton: {
    flex: 1,
    backgroundColor: '#982546',
    borderWidth: 2,
    borderColor: '#FFF3DC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButtonDisabled: {
    opacity: 0.5,
  },

  submitButtonText: {
    color: '#FFF3DC',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
