import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Image, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type SplashScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Splash'
>;

type Props = {
    navigation: SplashScreenNavigationProp;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        // Fade and slide animation for the logo and title
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                speed: 1,
                bounciness: 15,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <LinearGradient
            colors={['#0557efff', '#f0101bff']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <Animated.View
                    style={[
                        styles.centerContent,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* Logo */}
                    <Image
                        source={require('../assets/icon.png')} 
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {/* Brand name */}
                    <Text style={styles.brand}>KitchenPro</Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>Empowering Culinary Excellence</Text>
                </Animated.View>

                {/* Action buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.adminButton]}
                        onPress={() => navigation.navigate('Admin')}
                    >
                        <Text style={styles.buttonText}>Login as Admin</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.guestButton]}
                        onPress={() => navigation.navigate('Guest')}
                    >
                        <Text style={styles.buttonText}>Continue as Guest</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
    },
    centerContent: {
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    brand: {
        fontSize: 34,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#DDE3F0',
        marginTop: 6,
        fontStyle: 'italic',
    },
    buttonContainer: {
        width: '80%',
    },
    button: {
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginVertical: 8,
    },
    adminButton: {
        backgroundColor: '#FFD166',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    guestButton: {
        backgroundColor: '#06D6A0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 0.5,
    },
});