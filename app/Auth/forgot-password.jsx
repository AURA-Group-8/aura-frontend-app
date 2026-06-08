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
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import CardPopUp from '../Professional/_Components/card-popUp';

export default function ForgotPassword() {
  const router = useRouter();
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  const validateEmail = (emailValue) => {
    if (!emailValue.trim()) {
      setEmailError('Email é obrigatório');
      return false;
    }
    if (!emailValue.includes('@') || !emailValue.includes('.')) {
      setEmailError('Email inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendEmail = async () => {
    if (!validateEmail(email)) {
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await axios(`${API_URL}/api/mensagens/esqueci-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          email: email,
        }),
      });

      console.log('Email enviado:', response.data);

      setPopupMessage('Email enviado com sucesso!');
      setPopupType('success');
      setPopupVisible(true);

      setTimeout(() => {
        router.push({
          pathname: '/Auth/validate-token',
          params: {
            token: response.data.token,
            userId: response.data.userId,
            email: email,
          },
        });
      }, 1500);
    } catch (error) {
      console.error('Erro ao enviar email:', error.response?.data || error.message);
      setPopupMessage('Erro ao enviar email. Verifique se o email está cadastrado.');
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
              <Text style={localStyles.title}>Esqueci a Senha</Text>
              
              <Text style={localStyles.subtitle}>
                Confirme seu e-mail cadastrado para receber o código de redefinição de senha
              </Text>

              <View style={localStyles.formContainer}>
                <Text style={localStyles.label}>Confirmar E-mail:</Text>
                
                <TextInput
                  style={[
                    localStyles.textInput,
                    emailError && localStyles.textInputError,
                  ]}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />

                {emailError && (
                  <Text style={localStyles.errorText}>{emailError}</Text>
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
                    onPress={handleSendEmail}
                    disabled={isSubmitting}
                  >
                    <Text style={localStyles.submitButtonText}>
                      {isSubmitting ? 'Enviando...' : 'Alterar'}
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
    marginBottom: 16,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#FFF3DC',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
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
