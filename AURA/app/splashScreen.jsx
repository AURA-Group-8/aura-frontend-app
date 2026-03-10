import { View, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/styles';
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {

    const router = useRouter();
    const rotacao = useRef(new Animated.Value(0)).current;
    const animationRef = useRef(null);

    useEffect(() => {
        animationRef.current = Animated.loop(
            Animated.timing(rotacao, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        animationRef.current.start();
        
        const timer = setTimeout(() => {
            router.replace("/home");
        }, 2500);

        
        return () => {
      clearTimeout(timer);
      animationRef.current?.stop();
    };

    }, []);

    const rotate = rotacao.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <LinearGradient
            colors={['#4f1223', '#8a1c3a']}
            style={styles.container}
        >
            <Image
                source={require('../assets/AURA.png')}
                style={styles.img}
            />

            <Animated.View
                style={[styles.animacao, { transform: [{ rotate }]}]}
            >
                <Text style={styles.loadingText}>⟳</Text>
            </Animated.View>
        </LinearGradient>
    );
}