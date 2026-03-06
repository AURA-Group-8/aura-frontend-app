import { useState } from 'react';
import { styles } from '../styles/styles';
import { Text, View, Image, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <LinearGradient
      colors={['#4f1223', '#8a1c3a']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <Pressable 
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 28, color: '#FFF3DC', fontWeight: 'bold' }}>{"<"}</Text>
      </Pressable>

      <View style={styles.container}>
        <Image source={require('../assets/AURA.png')} style={[styles.img, { width: 300, height: 300 }]} />
      </View>

      <View style={styles.containerButton}>
        <Text style={styles.titulo}>Fazer Login</Text>
        
        <TextInput
          placeholder="Email"
          placeholderTextColor="#FFF3DC80"
          value={email}
          onChangeText={setEmail}
          style={{
            backgroundColor: '#5c0f25',
            color: '#FFF3DC',
            borderWidth: 2,
            borderColor: '#FFF3DC',
            width: 300,
            padding: 12,
            borderRadius: 20,
            marginBottom: 10,
            fontWeight: '500',
          }}
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#FFF3DC80"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={{
            backgroundColor: '#5c0f25',
            color: '#FFF3DC',
            borderWidth: 2,
            borderColor: '#FFF3DC',
            width: 300,
            padding: 12,
            borderRadius: 20,
            fontWeight: '500',
          }}
        />

        <Pressable style={styles.btnLogin}>
          <Text style={styles.btnLoginText}>ENTRAR</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
