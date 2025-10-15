// SplashScreen.tsx : Initial screen with login functionality
// Imports
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

// Define navigation 
type ScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Splash'
>;

type Props = {
    navigation: ScreenNavigationProp;
};

/* SplashScreen Component
Admin authentication
Provides guest access option */
const SplashScreen: React.FC<Props> = ({ navigation }) => {
    // Animation values for fade and slide effects
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    // State management for password input and error messages
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const correctPassword = '2004';
    // Hardcoded password for demo purposes, I also gave the password as a hint

    /* Triggers animation sequence when the component is first rendered */
    useEffect(() => {
        Animated.sequence([
            // Fade in animation
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            // Slide up animation
            Animated.spring(slideAnim, {
                toValue: 0,
                speed: 1,
                bounciness: 15,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    /* Handles admin login authentication
    Validates password and navigates to admin dashboard on success */
    // IF STATEMENT: Check password validation
    const handleLogin = () => {
        if (password === correctPassword) {
            console.log('Login Successful');
            navigation.navigate('HomeA'); // Navigate to Admin Dashboard
            setPassword(''); // Clear password field
            setError('');    // Clear any previous errors
        } else {
            setError('Incorrect! Hint: The year the business was founded (2004).');
        }
    };

    /* Handles guest access without authentication
    Navigates directly to guest view */
    const handleGuestAccess = () => {
        console.log('Continue as Guest');
        navigation.navigate('HomeG'); // Navigate to Guest Home
    };

    return (
        <LinearGradient
            colors={['#0557ef', '#f0101b']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.container}>
                {/* Animated brand section */}
                <Animated.View
                    style={[
                        styles.centerContent,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <Image
                        source={require('../assets/Logo(2).jpeg')}
                        style={styles.logo}
                    />
                    <Text style={styles.brand}>Kitchen Delicacies</Text>
                    <Text style={styles.subtitle}>Empowering Culinary Excellence</Text>
                    <Text style={styles.subtitle}></Text>
                </Animated.View>

                {/* Login form section */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginTitle}>Admin Login</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter password"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        onSubmitEditing={handleLogin}
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    {error !== '' && <Text style={styles.error}>{error}</Text>}

                    <TouchableOpacity
                        style={styles.guestButton}
                        onPress={handleGuestAccess}
                    >
                        <Text style={styles.guestButtonText}>Continue as Guest</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

// Styles using StyleSheet for better performance
const styles = StyleSheet.create({
    gradient: {
        flex: 1
    },
    // General Style
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
        borderRadius: 60, // Circular logo
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
    // Login Section
    loginContainer: {
        width: '85%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
    },
    loginTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
    },
    input: {
        width: '80%',
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: '#fff',
    },
    loginButton: {
        backgroundColor: '#0557ef',
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 25,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Error
    error: {
        marginTop: 10,
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    // Guest Access
    guestButton: {
        marginTop: 15,
        backgroundColor: '#06D6A0',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
    },
    guestButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default SplashScreen;