import { View, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/styles';
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export default function SplashScreen() {

    const rotacao = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotacao, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

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
            />
        </LinearGradient>
    );
}