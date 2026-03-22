import { useState } from 'react';
import { styles } from '../../styles/styles';
import { Text, View, Image, Pressable, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [buttonHovered, setButtonHovered] = useState(false);

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

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#FFF3DC80"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={localStyles.input}
        />

        <Pressable 
          style={[styles.btnLogin, { backgroundColor: '#fff3dc', color: '#5c0f25', opacity: buttonHovered ? 0.8 : 1 }]}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          onPress={() => router.push("/Client/schedules")}
        >
          <Text style={[styles.btnLoginText, { color: '#5c0f25' }]}>ENTRAR</Text>
        </Pressable>
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
    marginBottom: 10,
    fontWeight: '500',
  },
});