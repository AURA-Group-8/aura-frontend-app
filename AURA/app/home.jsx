import { styles } from '../styles/styles';
import { Text, View, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Home() {
    
  const router = useRouter();
  const [loginHovered, setLoginHovered] = useState(false);
  const [cadastroHovered, setCadastroHovered] = useState(false);
    
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
        
        <Pressable 
          style={[styles.btnLogin, { opacity: loginHovered ? 0.8 : 1 }]} 
          onPress={() => router.push('/Auth/login')}
          onMouseEnter={() => setLoginHovered(true)}
          onMouseLeave={() => setLoginHovered(false)}
        >
          <Text style={styles.btnLoginText}>LOGIN</Text>
        </Pressable>

        <Pressable 
          style={[styles.btnCadastro, { opacity: cadastroHovered ? 0.8 : 1 }]} 
          onPress={() => router.push('/Auth/signUp')}
          onMouseEnter={() => setCadastroHovered(true)}
          onMouseLeave={() => setCadastroHovered(false)}
        >
          <Text style={styles.btnCadastroText}>CADASTRO</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
