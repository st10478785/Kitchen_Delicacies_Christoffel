// SettingsScreen.tsx - Simple App Settings
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// App settings interface
interface AppSettings {
    darkMode: boolean;
    notifications: boolean;
    soundEffects: boolean;
    autoBackup: boolean;
    language: string;
    currency: string;
}

const SettingsScreen: React.FC = () => {
    // App settings state
    const [settings, setSettings] = useState<AppSettings>({
        darkMode: false,
        notifications: true,
        soundEffects: true,
        autoBackup: true,
        language: 'English',
        currency: 'ZAR'
    });

    /* Update setting value
    Changes individual setting based on user input */
    const updateSetting = (key: keyof AppSettings, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    /* Reset all settings to default
    Confirms with user before resetting */
    const handleResetSettings = () => {
        // IF STATEMENT: Show confirmation before reset
        Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset all settings?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        setSettings({
                            darkMode: false,
                            notifications: true,
                            soundEffects: true,
                            autoBackup: true,
                            language: 'English',
                            currency: 'ZAR'
                        });
                        Alert.alert('Success', 'Settings reset to default');
                    }
                }
            ]
        );
    };

    /* Backup data
    Simulates data backup process */
    const handleBackup = () => {
        Alert.alert(
            'Backup Started',
            'Your data is being backed up...',
            [{ text: 'OK' }]
        );
    };

    // Available languages and currencies
    const languages = ['English', 'Afrikaans', 'Zulu', 'French'];
    const currencies = ['ZAR', 'USD', 'EUR', 'GBP'];

    return (
        <LinearGradient colors={['#ffffff', '#f0f4ff']} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Text style={styles.title}>App Settings</Text>
                        <Text style={styles.subtitle}>Customize your experience</Text>
                    </View>

                    {/* Appearance Settings */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Appearance</Text>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="moon-outline" size={24} color="#0557ef" />
                                <View style={styles.settingTexts}>
                                    <Text style={styles.settingTitle}>Dark Mode</Text>
                                    <Text style={styles.settingDescription}>Switch to dark theme</Text>
                                </View>
                            </View>
                            <Switch
                                value={settings.darkMode}
                                onValueChange={(value) => updateSetting('darkMode', value)}
                            />
                        </View>
                    </View>

                    {/* Notification Settings */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Notifications</Text>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="notifications-outline" size={24} color="#0557ef" />
                                <View style={styles.settingTexts}>
                                    <Text style={styles.settingTitle}>Push Notifications</Text>
                                    <Text style={styles.settingDescription}>Receive app notifications</Text>
                                </View>
                            </View>
                            <Switch
                                value={settings.notifications}
                                onValueChange={(value) => updateSetting('notifications', value)}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="volume-high-outline" size={24} color="#0557ef" />
                                <View style={styles.settingTexts}>
                                    <Text style={styles.settingTitle}>Sound Effects</Text>
                                    <Text style={styles.settingDescription}>Play sounds for actions</Text>
                                </View>
                            </View>
                            <Switch
                                value={settings.soundEffects}
                                onValueChange={(value) => updateSetting('soundEffects', value)}
                            />
                        </View>
                    </View>

                    {/* Data & Storage */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Data & Storage</Text>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="cloud-upload-outline" size={24} color="#0557ef" />
                                <View style={styles.settingTexts}>
                                    <Text style={styles.settingTitle}>Auto Backup</Text>
                                    <Text style={styles.settingDescription}>Backup data automatically</Text>
                                </View>
                            </View>
                            <Switch
                                value={settings.autoBackup}
                                onValueChange={(value) => updateSetting('autoBackup', value)}
                            />
                        </View>

                        <TouchableOpacity style={styles.actionButton} onPress={handleBackup}>
                            <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>Backup Now</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Language & Region */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Language & Region</Text>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="language-outline" size={24} color="#0557ef" />
                                <Text style={styles.settingTitle}>Language</Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text style={styles.valueText}>{settings.language}</Text>
                            </View>
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="cash-outline" size={24} color="#0557ef" />
                                <Text style={styles.settingTitle}>Currency</Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text style={styles.valueText}>{settings.currency}</Text>
                            </View>
                        </View>
                    </View>

                    {/* App Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>App Information</Text>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Version</Text>
                                <Text style={styles.infoValue}>2.1.0</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Build</Text>
                                <Text style={styles.infoValue}>2024.12</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Last Updated</Text>
                                <Text style={styles.infoValue}>Dec 15, 2024</Text>
                            </View>
                        </View>
                    </View>

                    {/* Danger Zone */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Danger Zone</Text>

                        <TouchableOpacity style={[styles.actionButton, styles.resetButton]} onPress={handleResetSettings}>
                            <Ionicons name="refresh-outline" size={20} color="#f0101b" />
                            <Text style={[styles.actionButtonText, styles.resetButtonText]}>Reset All Settings</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#222',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        margin: 16,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingTexts: {
        marginLeft: 12,
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 14,
        color: '#666',
    },
    valueContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#f8f9fa',
    },
    valueText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#0557ef',
        marginTop: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    resetButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0101b',
    },
    resetButtonText: {
        color: '#f0101b',
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    infoItem: {
        width: '48%',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
});

export default SettingsScreen;