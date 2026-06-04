import { styles } from '../styles/styles';
import { Text, View, Image, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useContext } from 'react';
import { LanguageContext } from './contexts/LanguageContext';
import { getTranslation } from './translations/translations';

export default function Home() {
    
  const router = useRouter();
  const { language, changeLanguage } = useContext(LanguageContext);
  const t = (key) => getTranslation(language, 'home', key);
  
  const [loginHovered, setLoginHovered] = useState(false);
  const [cadastroHovered, setCadastroHovered] = useState(false);
    
  return (
    <LinearGradient
      colors={['#4f1223', '#8a1c3a']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <View style={homeStyles.languageSelector} pointerEvents="auto">
        <Pressable
          onPress={() => changeLanguage('pt')}
          style={[
            homeStyles.languageBtnPT,
            language === 'pt' && homeStyles.languageBtnActive
          ]}
        >
          <Text style={[
            homeStyles.languageText,
            language === 'pt' && homeStyles.languageTextActive
          ]}>PT</Text>
        </Pressable>
        <Pressable
          onPress={() => changeLanguage('en')}
          style={[
            homeStyles.languageBtnEN,
            language === 'en' && homeStyles.languageBtnActive
          ]}
        >
          <Text style={[
            homeStyles.languageText,
            language === 'en' && homeStyles.languageTextActive
          ]}>EN</Text>
        </Pressable>
      </View>

      <View style={homeStyles.logoContainer}>
        <Image source={require('../assets/AURA.png')} style={styles.img} />
      </View>

      <View style={homeStyles.buttonsContainer}>
        <View style={styles.containerButton}>
          <Text style={styles.titulo}>{t('welcome')}</Text>
          
          <Pressable 
            style={[styles.btnLogin, { opacity: loginHovered ? 0.8 : 1 }]} 
            onPress={() => router.push('/Auth/login')}
            onMouseEnter={() => setLoginHovered(true)}
            onMouseLeave={() => setLoginHovered(false)}
          >
            <Text style={styles.btnLoginText}>{t('login')}</Text>
          </Pressable>

          <Pressable 
            style={[styles.btnCadastro, { opacity: cadastroHovered ? 0.8 : 1 }]} 
            onPress={() => router.push('/Auth/signUp')}
            onMouseEnter={() => setCadastroHovered(true)}
            onMouseLeave={() => setCadastroHovered(false)}
          >
            <Text style={styles.btnCadastroText}>{t('signup')}</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const homeStyles = StyleSheet.create({
  languageSelector: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 100,
    flexDirection: 'row',
    gap: 8,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
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
});
