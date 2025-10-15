// ProfileScreen.tsx - Simple User Profile
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// User profile interface
interface UserProfile {
    name: string;
    email: string;
    phone: string;
    role: string;
    notifications: {
        email: boolean;
        push: boolean;
    };
    dietaryPreferences: string[];
}

const ProfileScreen: React.FC = () => {
    // User profile state
    const [profile, setProfile] = useState<UserProfile>({
        name: 'Chef Christoffel',
        email: 'chef@kitchendelicacies.com',
        phone: '+27 12 345 6789',
        role: 'Head Chef & Administrator',
        notifications: {
            email: true,
            push: true,
        },
        dietaryPreferences: ['Vegetarian', 'Low-Carb'],
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm, setEditForm] = useState({
        name: profile.name,
        email: profile.email,
        phone: profile.phone
    });

    // Available dietary options
    const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Carb'];

    /* Save profile changes
    Updates profile with new data from edit form */
    const handleSaveProfile = () => {
        // IF STATEMENT: Check if any fields are empty
        if (!editForm.name || !editForm.email) {
            Alert.alert('Error', 'Please fill in name and email');
            return;
        }

        setProfile(prev => ({
            ...prev,
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone
        }));
        setEditModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully!');
    };

    /* Toggle notification settings
    Switches between enabled/disabled states */
    const toggleNotification = (type: keyof UserProfile['notifications']) => {
        setProfile(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: !prev.notifications[type]
            }
        }));
    };

    /* Toggle dietary preference
    Adds or removes preference from list */
    const toggleDietaryPreference = (preference: string) => {
        setProfile(prev => ({
            ...prev,
            dietaryPreferences: prev.dietaryPreferences.includes(preference)
                ? prev.dietaryPreferences.filter(p => p !== preference)
                : [...prev.dietaryPreferences, preference]
        }));
    };

    /* Open edit modal
    Prepares form with current profile data */
    const openEditModal = () => {
        setEditForm({
            name: profile.name,
            email: profile.email,
            phone: profile.phone
        });
        setEditModalVisible(true);
    };

    return (
        <LinearGradient colors={['#ffffff', '#f0f4ff']} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Text style={styles.title}>My Profile</Text>
                        <Text style={styles.subtitle}>Manage your account settings</Text>
                    </View>

                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        <View style={styles.profileHeader}>
                            <Image source={require('../assets/Logo(1).jpeg')} style={styles.avatar} />
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>{profile.name}</Text>
                                <Text style={styles.profileRole}>{profile.role}</Text>
                                <Text style={styles.profileEmail}>{profile.email}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                            <Ionicons name="create-outline" size={18} color="#0557ef" />
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Notifications Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Notifications</Text>

                        <View style={styles.settingItem}>
                            <Ionicons name="mail-outline" size={24} color="#0557ef" />
                            <Text style={styles.settingText}>Email Notifications</Text>
                            <Switch
                                value={profile.notifications.email}
                                onValueChange={() => toggleNotification('email')}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <Ionicons name="notifications-outline" size={24} color="#0557ef" />
                            <Text style={styles.settingText}>Push Notifications</Text>
                            <Switch
                                value={profile.notifications.push}
                                onValueChange={() => toggleNotification('push')}
                            />
                        </View>
                    </View>

                    {/* Dietary Preferences */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Dietary Preferences</Text>
                        <Text style={styles.sectionSubtitle}>Select your food preferences</Text>

                        <View style={styles.tagsContainer}>
                            {dietaryOptions.map(preference => (
                                <TouchableOpacity
                                    key={preference}
                                    style={[
                                        styles.tag,
                                        profile.dietaryPreferences.includes(preference) && styles.selectedTag
                                    ]}
                                    onPress={() => toggleDietaryPreference(preference)}
                                >
                                    <Text style={[
                                        styles.tagText,
                                        profile.dietaryPreferences.includes(preference) && styles.selectedTagText
                                    ]}>
                                        {preference}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="shield-checkmark-outline" size={24} color="#0557ef" />
                            <Text style={styles.actionText}>Change Password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="help-circle-outline" size={24} color="#0557ef" />
                            <Text style={styles.actionText}>Help & Support</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
                            <Ionicons name="log-out-outline" size={24} color="#f0101b" />
                            <Text style={[styles.actionText, styles.logoutText]}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Edit Profile Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={editModalVisible}
                    onRequestClose={() => setEditModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Edit Profile</Text>
                                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalBody}>
                                <Text style={styles.inputLabel}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editForm.name}
                                    onChangeText={text => setEditForm(prev => ({ ...prev, name: text }))}
                                    placeholder="Enter your name"
                                />

                                <Text style={styles.inputLabel}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editForm.email}
                                    onChangeText={text => setEditForm(prev => ({ ...prev, email: text }))}
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                />

                                <Text style={styles.inputLabel}>Phone</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editForm.phone}
                                    onChangeText={text => setEditForm(prev => ({ ...prev, phone: text }))}
                                    placeholder="Enter your phone"
                                    keyboardType="phone-pad"
                                />

                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    profileCard: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#0557ef',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
        marginBottom: 4,
    },
    profileRole: {
        fontSize: 16,
        color: '#0557ef',
        fontWeight: '600',
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#0557ef',
        padding: 12,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#0557ef',
        fontWeight: '600',
        marginLeft: 6,
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
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
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
    settingText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#0557ef',
        backgroundColor: '#fff',
    },
    selectedTag: {
        backgroundColor: '#0557ef',
    },
    tagText: {
        fontSize: 14,
        color: '#0557ef',
        fontWeight: '500',
    },
    selectedTagText: {
        color: '#fff',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    actionText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#222',
        fontWeight: '500',
    },
    logoutButton: {
        borderBottomWidth: 0,
        marginTop: 8,
    },
    logoutText: {
        color: '#f0101b',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    modalBody: {
        padding: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#06D6A0',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen;