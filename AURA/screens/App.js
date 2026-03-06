import { styles } from '../styles/styles';
import { Text, View, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={['#4f1223', '#8a1c3a']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <View style={styles.container}>
        <Image source={require('../assets/AURA.png')} style={styles.img} />
      </View>

      <View style={styles.containerButton}>
        <Text style={styles.titulo}>Bem-vindo!</Text>
        
        <Pressable style={styles.btnLogin} onPress={() => router.push('/login')}>
          <Text style={styles.btnLoginText}>LOGIN</Text>
        </Pressable>

        <Pressable style={styles.btnCadastro}>
          <Text style={styles.btnCadastroText}>CADASTRO</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

