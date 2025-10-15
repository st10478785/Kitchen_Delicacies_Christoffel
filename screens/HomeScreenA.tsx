// HomeScreenA.tsx : Admin Screen 
// Imports
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, TextInput, Alert, ScrollView, Image, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import MenuManagementScreen from './MenuManagementScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';

// Link to other screens
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeA'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

/* Menu management interfaces */
//  These interfaces define the structure of the menu data
type Category = "Starter" | "Main" | "Dessert" | "Drink";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  available: boolean;
  popularity?: number;
  ingredients?: string[];
  dietaryTags?: string[];
}

// Available categories for menu items
const categories: Category[] = ["Starter", "Main", "Dessert", "Drink"];

/* Admin Dashboard
  Features:
  Menu management (add, edit, delete items)
  Statistics and analytics
  Bottom navigation between different admin screens */
const HomeScreenA: React.FC<Props> = ({ navigation }) => {
  // Menu management - stores all menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    // Expanded
    {
      id: '1',
      name: 'Tomato Soup',
      description: 'Rich and creamy tomato soup',
      price: 55,
      category: 'Starter',
      available: true,
      popularity: 4.5,
      ingredients: ['tomatoes', 'cream', 'herbs'],
      dietaryTags: ['Vegetarian']
    },
    {
      id: '2',
      name: 'Grilled Chicken',
      description: 'Served with garlic butter sauce',
      price: 120,
      category: 'Main',
      available: true,
      popularity: 4.8,
      ingredients: ['chicken', 'garlic', 'butter', 'herbs'],
      dietaryTags: []
    },
    // Compressed, all on one line no spaces
    { id: '3', name: 'Chocolate Mousse', description: 'Smooth chocolate dessert', price: 65, category: 'Dessert', available: false, popularity: 4.7, ingredients: ['chocolate', 'cream', 'eggs'], dietaryTags: ['Vegetarian'] },
    { id: '4', name: 'Caesar Salad', description: 'Crisp romaine with creamy dressing', price: 70, category: 'Starter', available: true, popularity: 4.3, ingredients: ['lettuce', 'croutons', 'parmesan', 'dressing'], dietaryTags: ['Vegetarian'] },
    { id: '5', name: 'Seafood Platter', description: 'Selection of fresh oysters, prawns and crab', price: 180, category: 'Main', available: true, popularity: 4.6, ingredients: ['oysters', 'prawns', 'crab'], dietaryTags: [] },
  ]);

  // Adding new items
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<Category>("Starter");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemIngredients, setNewItemIngredients] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');

  /* Menu Statistics
    Calculates statistics only when menuItems change
    This optimizes performance by avoiding recalculations on every render */
    const stats = useMemo(() => {
    const total = menuItems.length;
    const availableItems = menuItems.filter(item => item.available).length;
    const totalRevenue = menuItems.reduce((sum, item) => sum + item.price, 0);
    const avgPrice = total > 0 ? totalRevenue / total : 0;

    // Calculate average price by course using reduce to group items
    const avgByCourse: Record<string, number> = {};
    const grouped = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});

    // Calculate average for each category
    for (const [course, items] of Object.entries(grouped)) {
      avgByCourse[course] = items.reduce((sum, i) => sum + i.price, 0) / items.length;
    }

    // Calculate price range
    const allPrices = menuItems.map(i => i.price);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);

    // Find most popular course by item count
    const mostPopularCourse = Object.keys(grouped).reduce((a, b) =>
      grouped[a].length > grouped[b].length ? a : b
    );

    // Display for statistics
    return {
      total,
      availableItems,
      totalRevenue,
      avgPrice,
      avgByCourse,
      min,
      max,
      mostPopularCourse
    };
  }, [menuItems]);

  /* Menu Management Function
    Adds a new menu item
    Validates input and shows appropriate alerts */
  const addMenuItem = () => {
    // Validation checks
    if (!newItemName || !newItemDesc || !newItemPrice) {
      Alert.alert("Error", "Please fill out all required fields!");
      return;
    }

    const parsedPrice = parseFloat(newItemPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert("Error", "Enter a valid price.");
      return;
    }

    // Create new menu item object
    const newMenuItem: MenuItem = {
      id: Date.now().toString(), // Simple ID generation using timestamp
      name: newItemName,
      description: newItemDesc,
      category: newItemCategory,
      price: parsedPrice,
      available: true,
      ingredients: newItemIngredients ? newItemIngredients.split(',').map(i => i.trim()) : [],
      dietaryTags: [],
    };

    // Update state with new item
    setMenuItems(prev => [...prev, newMenuItem]);

    // Reset form fields
    setNewItemName("");
    setNewItemDesc("");
    setNewItemPrice("");
    setNewItemIngredients("");
    setModalVisible(false);

    Alert.alert("Success", "Menu item added successfully!");
  };

  //Toggles item availability status
  const toggleAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  // Deletes a menu item after confirmation
  const deleteMenuItem = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this menu item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setMenuItems(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  /* Menu Items
  Renders individual menu item in the list
  Uses FlatList for optimized rendering of large lists */
  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuCard}>
      <View style={styles.menuCardHeader}>
        <View style={styles.menuInfo}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.menuItemPrice}>R {item.price.toFixed(2)}</Text>
      </View>

      <Text style={styles.menuItemDesc}>{item.description}</Text>

      {item.ingredients && item.ingredients.length > 0 && (
        <Text style={styles.ingredients}>
          Ingredients: {item.ingredients.join(', ')}
        </Text>
      )}

      <View style={styles.menuCardFooter}>
        <View style={styles.availabilityContainer}>
          <Text style={[styles.availability, { color: item.available ? 'green' : 'red' }]}>
            {item.available ? 'Available' : 'Unavailable'}
          </Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => toggleAvailability(item.id)}
          >
            <Ionicons
              name={item.available ? "eye" : "eye-off"}
              size={20}
              color={item.available ? "green" : "red"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.menuActions}>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteMenuItem(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /* Render Screen Content
  Renders the active screen content based on bottom navigation selection
  Uses switch statement for different screen components */
  const renderScreenContent = () => {
    switch (activeScreen) {
      case 'dashboard':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image source={require('../assets/Logo(1).jpeg')} style={styles.logo} />
                <View>
                  <Text style={styles.chefName}>Chef Christoffel</Text>
                  <Text style={styles.roleLabel}>Admin Dashboard</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => navigation.navigate('HomeG')}
              >
                <Ionicons name="eye-outline" size={20} color="#fff" />
                <Text style={styles.guestButtonText}>Guest View</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Stats Section */}
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Quick Overview</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Ionicons name="restaurant-outline" size={24} color="#0557ef" />
                  <Text style={styles.statNumber}>{stats.total}</Text>
                  <Text style={styles.statLabel}>Total Items</Text>
                </View>
                <View style={styles.statCard}>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#06D6A0" />
                  <Text style={styles.statNumber}>{stats.availableItems}</Text>
                  <Text style={styles.statLabel}>Available</Text>
                </View>
                <View style={styles.statCard}>
                  <Ionicons name="trending-up-outline" size={33} color="#FF9E0A" />
                  <Text style={styles.statLabel}>Avg Prices by Course</Text>
                  <Text style={styles.space} />
                  {Object.entries(stats.avgByCourse).map(([course, price]) => (
                    <Text key={course} style={styles.additionalStatValue}>
                      {course}: R {price.toFixed(2)}
                    </Text>
                  ))}
                </View>
                <View style={styles.statCard}>
                  <Ionicons name="pricetag-outline" size={24} color="#f0101b" />
                  <Text style={styles.statLabel}>Avg Price</Text>
                  <Text style={styles.statNumber}>R{stats.avgPrice.toFixed(2)}</Text>
                  <Text style={styles.additionalStatValue}>
                    Most Popular: {stats.mostPopularCourse}
                  </Text>
                  <Text style={styles.statLabel}>Price Range</Text>
                  <Text style={styles.additionalStatValue}>
                    R{stats.min} - R{stats.max}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Actions Section */}
            <View style={styles.actionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Ionicons name="add-circle" size={28} color="#fff" />
                  <Text style={styles.actionText}>Add New Item</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="book-outline" size={28} color="#fff" />
                  <Text style={styles.actionText}>Manage Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="analytics-outline" size={28} color="#fff" />
                  <Text style={styles.actionText}>View Analytics</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Menu Items List Section */}
            <View style={styles.menuContainer}>
              <View style={styles.menuHeader}>
                <Text style={styles.sectionTitle}>Menu Items ({menuItems.length})</Text>
                <TouchableOpacity style={styles.filterButton}>
                  <Ionicons name="filter" size={20} color="#0557ef" />
                  <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.menuList}
              />
            </View>

            {/* Recent Activity Section */}
            <View style={styles.activityContainer}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: '#06D6A0' }]} />
                  <Text style={styles.activityText}>New menu item "Seafood Platter" added</Text>
                  <Text style={styles.activityTime}>2 hours ago</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'menu':
        return <MenuManagementScreen />;

      case 'profile':
        return <ProfileScreen />;

      case 'settings':
        return <SettingsScreen />;

      default:
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Dashboard</Text>
          </View>
        );
    }
  };

  /* Helper function to get screen title based on active screen */
  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'dashboard': return 'Dashboard';
      case 'menu': return 'Menu';
      case 'profile': return 'Profile';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#f0f4ff']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Page Title Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{getScreenTitle()}</Text>
        </View>

        {/* Main Content Area */}
        {renderScreenContent()}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          {[
            { key: 'dashboard', icon: 'restaurant', label: 'Dashboard' },
            { key: 'menu', icon: 'book', label: 'Menu' },
            { key: 'profile', icon: 'person', label: 'Profile' },
            { key: 'settings', icon: 'settings', label: 'Settings' },
          ].map((navItem) => (
            <TouchableOpacity
              key={navItem.key}
              style={[styles.navItem, activeScreen === navItem.key && styles.activeNavItem]}
              onPress={() => setActiveScreen(navItem.key)}
            >
              <Ionicons
                name={navItem.icon as any}
                size={24}
                color={activeScreen === navItem.key ? '#0557ef' : '#666'}
              />
              <Text style={[styles.navText, activeScreen === navItem.key && styles.activeNavText]}>
                {navItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Item Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Menu Item</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <TextInput
                  style={styles.input}
                  placeholder="Item Name"
                  value={newItemName}
                  onChangeText={setNewItemName}
                />

                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description"
                  value={newItemDesc}
                  onChangeText={setNewItemDesc}
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categoryRow}>
                  {categories.map((category) => (
                    <Pressable
                      key={category}
                      onPress={() => setNewItemCategory(category)}
                      style={[
                        styles.categoryButton,
                        newItemCategory === category && styles.selectedCategory,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          newItemCategory === category && styles.selectedCategoryText,
                        ]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Price (R)"
                  value={newItemPrice}
                  onChangeText={setNewItemPrice}
                  keyboardType="numeric"
                />

                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ingredients (comma separated)"
                  value={newItemIngredients}
                  onChangeText={setNewItemIngredients}
                  multiline
                  numberOfLines={2}
                />

                <TouchableOpacity style={styles.addButton} onPress={addMenuItem}>
                  <Text style={styles.addButtonText}>Add to Menu</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

// StyleSheet
const styles = StyleSheet.create({
  // General Styles
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  space: {
    height: 16,
  },
  pageHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  screenContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {},
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#0557ef',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  chefName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  roleLabel: {
    fontSize: 14,
    color: '#555',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#06D6A0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  guestButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  additionalStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#090909',
    marginBottom: 8,
  },
  actionsContainer: {
    padding: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0557ef',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionText: {
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  menuContainer: {
    padding: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: {
    color: '#0557ef',
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 14,
  },
  menuList: {
    paddingBottom: 16,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  menuCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  menuInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#0557ef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0557ef',
  },
  menuItemDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ingredients: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  menuCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availability: {
    fontWeight: '600',
    marginRight: 8,
  },
  toggleButton: {
    padding: 4,
  },
  menuActions: {
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
  activityContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalBody: {
    padding: 16,
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
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedCategory: {
    backgroundColor: '#0557ef',
    borderColor: '#0557ef',
  },
  categoryText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#06D6A0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreenA;
