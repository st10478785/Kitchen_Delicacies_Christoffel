// MenuManagementScreen.tsx - Comprehensive Menu Management
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, Modal, Alert, ScrollView, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

/* Menu Management Interfaces
  Defines the structure for menu items and categories */
type Category = "Starter" | "Main" | "Dessert" | "Drink";

interface MenuItem {
    id: string;
    name: string;
    description: string;
    category: Category;
    price: number;
    available: boolean;
    popularity?: number;
    ingredients: string[];
    dietaryTags: string[];
    preparationTime: number; // in minutes
    calories?: number;
    spiceLevel: 0 | 1 | 2 | 3; // 0=None, 1=Mild, 2=Medium, 3=Spicy
    imageUrl?: string;
}

/* Menu Management Screen Features:
  Add, edit, delete menu items
  Filter and search functionality
  Detailed item management with additional attributes */
const MenuManagementScreen: React.FC = () => {
    // Menu items state with sample data
    const [menuItems, setMenuItems] = useState<MenuItem[]>([
        {
            id: '1', name: 'Tomato Soup', description: 'Rich and creamy tomato soup with fresh herbs', price: 55, category: 'Starter', available: true, popularity: 4.5,
            ingredients: ['tomatoes', 'cream', 'fresh basil', 'garlic', 'olive oil'], dietaryTags: ['Vegetarian', 'Gluten-Free'], preparationTime: 15, calories: 120, spiceLevel: 0
        },
        {
            id: '2', name: 'Grilled Chicken', description: 'Perfectly grilled chicken served with garlic butter sauce', price: 120, category: 'Main', available: true, popularity: 4.8,
            ingredients: ['chicken breast', 'garlic', 'butter', 'herbs', 'lemon'], dietaryTags: [], preparationTime: 25, calories: 320, spiceLevel: 1
        },
        {
            id: '3', name: 'Chocolate Mousse', description: 'Smooth and rich chocolate dessert', price: 65, category: 'Dessert', available: false, popularity: 4.7,
            ingredients: ['dark chocolate', 'cream', 'eggs', 'sugar'], dietaryTags: ['Vegetarian'], preparationTime: 10, calories: 280, spiceLevel: 0
        },
        {
            id: '4', name: 'Caesar Salad', description: 'Crisp romaine with creamy dressing', price: 70, category: 'Starter', available: true, popularity: 4.3,
            ingredients: ['lettuce', 'croutons', 'parmesan', 'dressing'], dietaryTags: ['Vegetarian'], preparationTime: 10, calories: 150, spiceLevel: 0
        },
        {
            id: '5', name: 'Seafood Platter', description: 'Selection of fresh oysters, prawns and crab', price: 180, category: 'Main', available: true, popularity: 4.6,
            ingredients: ['oysters', 'prawns', 'crab'], dietaryTags: [], preparationTime: 30, calories: 400, spiceLevel: 2
        },
    ]);

    // UI state management
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Form state for add/edit operations
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Starter' as Category,
        price: '',
        ingredients: '',
        dietaryTags: '',
        preparationTime: '',
        calories: '',
        spiceLevel: 0 as 0 | 1 | 2 | 3,
        available: true
    });

    // Available categories and dietary options
    const categories: Category[] = ["Starter", "Main", "Dessert", "Drink",];
    const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Keto', 'Low-Carb'];

    /* Filter and Search Functionality
      Combines category filtering with text search
      Uses useMemo for performance optimization */
    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [menuItems, filterCategory, searchQuery]);

    /* Form Management Functions
      Handles form reset, opening modals, and saving items */
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: 'Starter',
            price: '',
            ingredients: '',
            dietaryTags: '',
            preparationTime: '',
            calories: '',
            spiceLevel: 0,
            available: true
        });
        setEditingItem(null);
    };

    const openAddModal = () => {
        resetForm();
        setModalVisible(true);
    };

    const openEditModal = (item: MenuItem) => {
        setFormData({
            name: item.name,
            description: item.description,
            category: item.category,
            price: item.price.toString(),
            ingredients: item.ingredients.join(', '),
            dietaryTags: item.dietaryTags.join(', '),
            preparationTime: item.preparationTime.toString(),
            calories: item.calories?.toString() || '',
            spiceLevel: item.spiceLevel,
            available: item.available
        });
        setEditingItem(item);
        setModalVisible(true);
    };

    /* Save Item Function
      Validates input and saves new or updated menu items */
    const handleSaveItem = () => {
        if (!formData.name || !formData.description || !formData.price) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const newItem: MenuItem = {
            id: editingItem ? editingItem.id : Date.now().toString(),
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: parseFloat(formData.price),
            available: formData.available,
            ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
            dietaryTags: formData.dietaryTags.split(',').map(t => t.trim()).filter(t => t),
            preparationTime: parseInt(formData.preparationTime) || 15,
            calories: formData.calories ? parseInt(formData.calories) : undefined,
            spiceLevel: formData.spiceLevel,
            popularity: editingItem ? editingItem.popularity : 4.0
        };

        if (editingItem) {
            setMenuItems(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
            Alert.alert('Success', 'Menu item updated successfully!');
        } else {
            setMenuItems(prev => [...prev, newItem]);
            Alert.alert('Success', 'Menu item added successfully!');
        }

        setModalVisible(false);
        resetForm();
    };

    /* Item Management Functions
      Toggle availability and delete items with confirmation */
    const toggleAvailability = (id: string) => {
        setMenuItems(prev => prev.map(item =>
            item.id === id ? { ...item, available: !item.available } : item
        ));
    };

    const deleteItem = (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this menu item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setMenuItems(prev => prev.filter(item => item.id !== id));
                    }
                }
            ]
        );
    };

    /* Menu Item Renderer
      Renders individual menu items in the list */
    const renderMenuItem = ({ item }: { item: MenuItem }) => (
        <View style={styles.menuCard}>
            <View style={styles.cardHeader}>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                </View>
                <Text style={styles.itemPrice}>R {item.price.toFixed(2)}</Text>
            </View>

            <Text style={styles.itemDescription}>{item.description}</Text>

            <View style={styles.itemDetails}>
                <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.preparationTime} min</Text>

                    {item.calories && (
                        <>
                            <Ionicons name="flame-outline" size={16} color="#666" style={styles.detailIcon} />
                            <Text style={styles.detailText}>{item.calories} cal</Text>
                        </>
                    )}

                    <Ionicons name="thermometer-outline" size={16} color="#666" style={styles.detailIcon} />
                    <Text style={styles.detailText}>
                        {['None', 'Mild', 'Medium', 'Spicy'][item.spiceLevel]}
                    </Text>
                </View>

                {item.ingredients.length > 0 && (
                    <Text style={styles.ingredients}>
                        Ingredients: {item.ingredients.join(', ')}
                    </Text>
                )}

                {item.dietaryTags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {item.dietaryTags.map(tag => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.cardActions}>
                <View style={styles.availabilityContainer}>
                    <Switch
                        value={item.available}
                        onValueChange={() => toggleAvailability(item.id)}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={item.available ? '#0557ef' : '#f4f3f4'}
                    />
                    <Text style={[
                        styles.availabilityText,
                        { color: item.available ? '#06D6A0' : '#f0101b' }
                    ]}>
                        {item.available ? 'Available' : 'Unavailable'}
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => openEditModal(item)}
                    >
                        <Ionicons name="create-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteItem(item.id)}
                    >
                        <Ionicons name="trash-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <LinearGradient colors={['#ffffff', '#f0f4ff']} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.title}>Menu Management</Text>
                    <Text style={styles.subtitle}>Manage your restaurant menu items</Text>
                </View>

                {/* Search and Filter Controls */}
                <View style={styles.controls}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search menu items..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
                        <Pressable
                            style={[styles.filterButton, filterCategory === 'All' && styles.activeFilter]}
                            onPress={() => setFilterCategory('All')}
                        >
                            <Text style={[styles.filterText, filterCategory === 'All' && styles.activeFilterText]}>
                                All
                            </Text>
                        </Pressable>
                        {categories.map(category => (
                            <Pressable
                                key={category}
                                style={[styles.filterButton, filterCategory === category && styles.activeFilter]}
                                onPress={() => setFilterCategory(category)}
                            >
                                <Text style={[styles.filterText, filterCategory === category && styles.activeFilterText]}>
                                    {category}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Menu Items List Section */}
                <View style={styles.listContainer}>
                    <View style={styles.listHeader}>
                        <Text style={styles.sectionTitle}>
                            Menu Items ({filteredItems.length})
                        </Text>
                        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Add Item</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={filteredItems}
                        renderItem={renderMenuItem}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                </View>

                {/* Add or Edit Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                                </Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.modalBody}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Item Name *"
                                    value={formData.name}
                                    onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
                                />

                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Description *"
                                    value={formData.description}
                                    onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
                                    multiline
                                    numberOfLines={3}
                                />

                                <Text style={styles.inputLabel}>Category *</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
                                    {categories.map(category => (
                                        <Pressable
                                            key={category}
                                            onPress={() => setFormData(prev => ({ ...prev, category }))}
                                            style={[
                                                styles.categoryOption,
                                                formData.category === category && styles.selectedCategory
                                            ]}
                                        >
                                            <Text style={[
                                                styles.categoryOptionText,
                                                formData.category === category && styles.selectedCategoryText
                                            ]}>
                                                {category}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Price (R) *"
                                    value={formData.price}
                                    onChangeText={text => setFormData(prev => ({ ...prev, price: text }))}
                                    keyboardType="numeric"
                                />

                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Ingredients (comma separated)"
                                    value={formData.ingredients}
                                    onChangeText={text => setFormData(prev => ({ ...prev, ingredients: text }))}
                                    multiline
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Preparation Time (minutes)"
                                    value={formData.preparationTime}
                                    onChangeText={text => setFormData(prev => ({ ...prev, preparationTime: text }))}
                                    keyboardType="numeric"
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Calories (optional)"
                                    value={formData.calories}
                                    onChangeText={text => setFormData(prev => ({ ...prev, calories: text }))}
                                    keyboardType="numeric"
                                />

                                <Text style={styles.inputLabel}>Spice Level</Text>
                                <View style={styles.spiceLevelContainer}>
                                    {[0, 1, 2, 3].map(level => (
                                        <Pressable
                                            key={level}
                                            onPress={() => setFormData(prev => ({ ...prev, spiceLevel: level as 0 | 1 | 2 | 3 }))}
                                            style={[
                                                styles.spiceLevelOption,
                                                formData.spiceLevel === level && styles.selectedSpiceLevel
                                            ]}
                                        >
                                            <Text style={[
                                                styles.spiceLevelText,
                                                formData.spiceLevel === level && styles.selectedSpiceLevelText
                                            ]}>
                                                {['None', 'Mild', 'Medium', 'Spicy'][level]}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>

                                <View style={styles.switchContainer}>
                                    <Text style={styles.switchLabel}>Available for ordering</Text>
                                    <Switch
                                        value={formData.available}
                                        onValueChange={value => setFormData(prev => ({ ...prev, available: value }))}
                                    />
                                </View>

                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveItem}>
                                    <Text style={styles.saveButtonText}>
                                        {editingItem ? 'Update Item' : 'Add to Menu'}
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
};

// StyleSheet - Consolidated without duplicates
const styles = StyleSheet.create({
    // General Layout Styles
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },

    // Header Styles
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

    // Control Section Styles
    controls: {
        padding: 16,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },

    // Filter Styles
    categoryFilter: {
        flexGrow: 0,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 8,
        backgroundColor: '#fff',
    },
    activeFilter: {
        backgroundColor: '#0557ef',
        borderColor: '#0557ef',
    },
    filterText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#fff',
    },

    // List Container Styles
    listContainer: {
        flex: 1,
        padding: 16,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#06D6A0',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
    },
    listContent: {
        paddingBottom: 20,
    },

    // Menu Card Styles
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        marginBottom: 6,
    },
    categoryBadge: {
        backgroundColor: '#0557ef',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    itemPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0557ef',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },

    // Item Details Styles
    itemDetails: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailIcon: {
        marginLeft: 12,
    },
    detailText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    ingredients: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 6,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 10,
        color: '#2E7D32',
        fontWeight: '500',
    },

    // Card Actions Styles
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    availabilityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    availabilityText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        backgroundColor: '#0557ef',
        padding: 8,
        borderRadius: 6,
    },
    deleteButton: {
        backgroundColor: '#f0101b',
        padding: 8,
        borderRadius: 6,
    },

    // Modal Styles
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
        maxHeight: '80%',
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

    // Form Input Styles
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },

    // Category Selection Styles
    categoryRow: {
        flexGrow: 0,
        marginBottom: 16,
    },
    categoryOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 8,
        backgroundColor: '#fff',
    },
    selectedCategory: {
        backgroundColor: '#0557ef',
        borderColor: '#0557ef',
    },
    categoryOptionText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    selectedCategoryText: {
        color: '#fff',
    },

    // Spice Level Styles
    spiceLevelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    spiceLevelOption: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 4,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    selectedSpiceLevel: {
        backgroundColor: '#0557ef',
        borderColor: '#0557ef',
    },
    spiceLevelText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    selectedSpiceLevelText: {
        color: '#fff',
    },

    // Switch and Button Styles
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#06D6A0',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MenuManagementScreen;
