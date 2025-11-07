// HomeScreenA.tsx : Admin Screen 
// Imports
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, TextInput, Alert, ScrollView, Image, Pressable, Modal, Switch, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import MenuManagementScreen from './MenuManagementScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
// Import ImagePicker for selecting images from device gallery
import * as ImagePicker from 'expo-image-picker';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeA'>;
type Props = { navigation: HomeScreenNavigationProp };

/* Menu management interfaces */
type Category = "Starter" | "Main" | "Dessert" ;

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
  preparationTime: number;
  calories?: number;
  spiceLevel: 0 | 1 | 2 | 3;
  image?: ImageSourcePropType;
}

const categories: Category[] = ["Starter", "Main", "Dessert"];

/* Gallery Screen Component */
const GalleryScreen: React.FC = () => {
  const galleryImages = [
    { id: '1', title: 'Restaurant Interior', image: require('../assets/gallery/interior.jpg'), description: 'Our cozy dining area' },
    { id: '2', title: 'Chef in Action', image: require('../assets/gallery/chef-cooking.jpg'), description: 'Master chef preparing your meal' },
    { id: '3', title: 'Fresh Ingredients', image: require('../assets/gallery/ingredients.jpg'), description: 'Daily fresh ingredients' },
    { id: '4', title: 'Dining Experience', image: require('../assets/gallery/dining.jpg'), description: 'Elegant dining atmosphere' },
    { id: '5', title: 'Dessert Selection', image: require('../assets/gallery/desserts.jpg'), description: 'Our signature desserts' },
    { id: '6', title: 'Wine Collection', image: require('../assets/gallery/wine.jpg'), description: 'Premium wine selection' },
  ];

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Restaurant Gallery</Text>
      <Text style={styles.screenSubtitle}>Behind the scenes of our culinary experience</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.galleryGrid}>
          {galleryImages.map((item) => (
            <View key={item.id} style={styles.galleryItem}>
              <Image source={item.image} style={styles.galleryImage} />
              <View style={styles.galleryInfo}>
                <Text style={styles.galleryTitle}>{item.title}</Text>
                <Text style={styles.galleryDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

/* Admin Dashboard */
const HomeScreenA: React.FC<Props> = ({ navigation }) => {
  // Menu management state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
    id: '1', name: 'Tomato Soup', description: 'Rich and creamy tomato soup with fresh herbs', price: 55, category: 'Starter', available: true, popularity: 4.5,
    ingredients: ['tomatoes', 'cream', 'fresh basil', 'garlic', 'olive oil'], dietaryTags: ['Vegetarian', 'Gluten-Free'], preparationTime: 15, calories: 120, spiceLevel: 0,
    image: require('../assets/menu/tomato soup.jpg')
  },
  {
    id: '2', name: 'Grilled Chicken', description: 'Perfectly grilled chicken served with garlic butter sauce', price: 120, category: 'Main', available: true, popularity: 4.8,
    ingredients: ['chicken breast', 'garlic', 'butter', 'herbs', 'lemon'], dietaryTags: [], preparationTime: 25, calories: 320, spiceLevel: 1,
    image: require('../assets/menu/grilled chicken.jpg')
  },
  {
    id: '3', name: 'Chocolate Mousse', description: 'Smooth and rich chocolate dessert', price: 65, category: 'Dessert', available: false, popularity: 4.7,
    ingredients: ['dark chocolate', 'cream', 'eggs', 'sugar'], dietaryTags: ['Vegetarian'], preparationTime: 10, calories: 280, spiceLevel: 0,
    image: require('../assets/menu/chocolate mousse.jpg')
  },
  {
    id: '4', name: 'Caesar Salad', description: 'Crisp romaine with creamy dressing', price: 70, category: 'Starter', available: true, popularity: 4.3,
    ingredients: ['lettuce', 'croutons', 'parmesan', 'dressing'], dietaryTags: ['Vegetarian'], preparationTime: 10, calories: 150, spiceLevel: 0,
    image: require('../assets/menu/caesar salad.jpg')
  },
  {
    id: '5', name: 'Seafood Platter', description: 'Selection of fresh oysters, prawns and crab', price: 180, category: 'Main', available: true, popularity: 4.6,
    ingredients: ['oysters', 'prawns', 'crab'], dietaryTags: [], preparationTime: 30, calories: 400, spiceLevel: 2,
    image: require('../assets/menu/seafood platter.jpg')
  },
  ]);

  // Form state
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<Category>("Starter");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemIngredients, setNewItemIngredients] = useState("");
  const [newItemPrepTime, setNewItemPrepTime] = useState("");
  const [newItemCalories, setNewItemCalories] = useState("");
  const [newItemSpiceLevel, setNewItemSpiceLevel] = useState<0 | 1 | 2 | 3>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  // State for storing the selected image URI when adding a new menu item
  const [newItemImage, setNewItemImage] = useState<string | null>(null);

  // Filter state
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterAvailability, setFilterAvailability] = useState<'All' | 'Available' | 'Unavailable'>('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /* Filter Functionality */
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      const matchesAvailability = filterAvailability === 'All' ||
        (filterAvailability === 'Available' && item.available) ||
        (filterAvailability === 'Unavailable' && !item.available);
      const matchesSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesAvailability && matchesSearch;
    });
  }, [menuItems, filterCategory, filterAvailability, searchQuery]);

  const resetFilters = () => {
    setFilterCategory('All');
    setFilterAvailability('All');
    setSearchQuery('');
    setShowFilterModal(false);
  };

  /* Menu Statistics */
  const stats = useMemo(() => {
    const total = menuItems.length;
    const availableItems = menuItems.filter(item => item.available).length;
    const totalRevenue = menuItems.reduce((sum, item) => sum + item.price, 0);
    const avgPrice = total > 0 ? totalRevenue / total : 0;

    const grouped = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});

    const avgByCourse: Record<string, number> = {};
    for (const [course, items] of Object.entries(grouped)) {
      avgByCourse[course] = items.reduce((sum, i) => sum + i.price, 0) / items.length;
    }

    const allPrices = menuItems.map(i => i.price);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const mostPopularCourse = Object.keys(grouped).reduce((a, b) => grouped[a].length > grouped[b].length ? a : b);

    return { total, availableItems, totalRevenue, avgPrice, avgByCourse, min, max, mostPopularCourse };
  }, [menuItems]);

  /* Function to pick an image from device gallery */
  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access camera roll is required to add images.");
      return;
    }

    // Launch image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    // If image was selected successfully, set the image URI
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setNewItemImage(pickerResult.assets[0].uri);
    }
  };

  /* Menu Management Functions */
  const addMenuItem = () => {
    if (!newItemName || !newItemDesc || !newItemPrice) {
      Alert.alert("Error", "Please fill out all required fields!");
      return;
    }

    const parsedPrice = parseFloat(newItemPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert("Error", "Enter a valid price.");
      return;
    }

    // Create new menu item with optional image
    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      name: newItemName,
      description: newItemDesc,
      category: newItemCategory,
      price: parsedPrice,
      available: true,
      ingredients: newItemIngredients ? newItemIngredients.split(',').map(i => i.trim()) : [],
      dietaryTags: [],
      preparationTime: parseInt(newItemPrepTime) || 15,
      calories: newItemCalories ? parseInt(newItemCalories) : undefined,
      spiceLevel: newItemSpiceLevel,
      // Include image if one was selected
      image: newItemImage ? { uri: newItemImage } : undefined,
    };

    setMenuItems(prev => [...prev, newMenuItem]);
    resetForm();
    setModalVisible(false);
    Alert.alert("Success", "Menu item added successfully!");
  };

  const resetForm = () => {
    setNewItemName("");
    setNewItemDesc("");
    setNewItemPrice("");
    setNewItemIngredients("");
    setNewItemPrepTime("");
    setNewItemCalories("");
    setNewItemSpiceLevel(0);
    // Reset the image selection when form is cleared
    setNewItemImage(null);
  };

  const toggleAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, available: !item.available } : item));
  };

  const deleteMenuItem = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this menu item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setMenuItems(prev => prev.filter(item => item.id !== id)) }
    ]);
  };

  /* Menu Item Renderer with Image Display */
  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuCard}>
      {/* Display menu item image if available */}
      {item.image && (
        <Image source={item.image} style={styles.menuItemImage} />
      )}
      
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
          <Text style={styles.detailText}>{['None', 'Mild', 'Medium', 'Spicy'][item.spiceLevel]}</Text>
        </View>

        {item.ingredients.length > 0 && (
          <Text style={styles.ingredients}>Ingredients: {item.ingredients.join(', ')}</Text>
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
          <Text style={[styles.availabilityText, { color: item.available ? '#06D6A0' : '#f0101b' }]}>
            {item.available ? 'Available' : 'Unavailable'}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMenuItem(item.id)}>
            <Ionicons name="trash-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /* Gallery Preview Component */
  const GalleryPreview = () => {
    const galleryImages = [
      { id: '1', title: 'Restaurant Interior', image: require('../assets/gallery/interior.jpg'), description: 'Our cozy dining area' },
      { id: '2', title: 'Chef in Action', image: require('../assets/gallery/chef-cooking.jpg'), description: 'Master chef preparing your meal' },
      { id: '3', title: 'Fresh Ingredients', image: require('../assets/gallery/ingredients.jpg'), description: 'Daily fresh ingredients' },
    ];

    return (
      <View style={styles.galleryPreviewContainer}>
        <View style={styles.galleryPreviewHeader}>
          <Text style={styles.sectionTitle}>Restaurant Gallery</Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => setActiveScreen('gallery')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#0557ef" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.galleryPreviewRow}>
            {galleryImages.map((item) => (
              <View key={item.id} style={styles.galleryPreviewItem}>
                <Image source={item.image} style={styles.galleryPreviewImage} />
                <View style={styles.galleryPreviewInfo}>
                  <Text style={styles.galleryPreviewTitle}>{item.title}</Text>
                  <Text style={styles.galleryPreviewDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  /* Screen Content Renderer */
  const renderScreenContent = () => {
    switch (activeScreen) {
      case 'dashboard':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image source={require('../assets/Logo(1).jpeg')} style={styles.logo} />
                <View>
                  <Text style={styles.chefName}>Chef Christoffel</Text>
                  <Text style={styles.roleLabel}>Admin Dashboard</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.guestButton} onPress={() => navigation.navigate('HomeG')}>
                <Ionicons name="eye-outline" size={20} color="#fff" />
                <Text style={styles.guestButtonText}>Guest View</Text>
              </TouchableOpacity>
            </View>

            {/* Search and Filter Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search menu items..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilterModal(true)}
              >
                <Ionicons name="filter" size={20} color="#0557ef" />
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>
            </View>

            {/* Active Filters Display */}
            {(filterCategory !== 'All' || filterAvailability !== 'All' || searchQuery) && (
              <View style={styles.activeFiltersContainer}>
                <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
                <View style={styles.activeFiltersRow}>
                  {filterCategory !== 'All' && (
                    <View style={styles.activeFilterTag}>
                      <Text style={styles.activeFilterText}>Category: {filterCategory}</Text>
                      <TouchableOpacity onPress={() => setFilterCategory('All')}>
                        <Ionicons name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                  {filterAvailability !== 'All' && (
                    <View style={styles.activeFilterTag}>
                      <Text style={styles.activeFilterText}>
                        {filterAvailability === 'Available' ? 'Available Only' : 'Unavailable Only'}
                      </Text>
                      <TouchableOpacity onPress={() => setFilterAvailability('All')}>
                        <Ionicons name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                  {searchQuery && (
                    <View style={styles.activeFilterTag}>
                      <Text style={styles.activeFilterText}>Search: "{searchQuery}"</Text>
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                  <TouchableOpacity style={styles.clearAllButton} onPress={resetFilters}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Quick Stats */}
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
                  <View style={styles.space} />
                  {Object.entries(stats.avgByCourse).map(([course, price]) => (
                    <Text key={course} style={styles.additionalStatValue}>{course}: R {price.toFixed(2)}</Text>
                  ))}
                </View>
                <View style={styles.statCard}>
                  <Ionicons name="pricetag-outline" size={24} color="#f0101b" />
                  <Text style={styles.statLabel}>Avg Price</Text>
                  <Text style={styles.statNumber}>R{stats.avgPrice.toFixed(2)}</Text>
                  <Text style={styles.additionalStatValue}>Most Popular: {stats.mostPopularCourse}</Text>
                  <Text style={styles.statLabel}>Price Range</Text>
                  <Text style={styles.additionalStatValue}>R{stats.min} - R{stats.max}</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
                  <Ionicons name="add-circle" size={28} color="#fff" />
                  <Text style={styles.actionText}>Add New Item</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setActiveScreen('gallery')}
                >
                  <Ionicons name="images-outline" size={28} color="#fff" />
                  <Text style={styles.actionText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="analytics-outline" size={28} color="#fff" />
                  <Text style={styles.actionText}>View Analytics</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>
                  Menu Items ({filteredMenuItems.length})
                  {menuItems.length !== filteredMenuItems.length && ` of ${menuItems.length}`}
                </Text>
                <Text style={styles.filteredCount}>
                  {filteredMenuItems.length} items
                </Text>
              </View>

              {filteredMenuItems.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyStateText}>No menu items found</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Try adjusting your filters or search terms
                  </Text>
                  <TouchableOpacity style={styles.resetFiltersButton} onPress={resetFilters}>
                    <Text style={styles.resetFiltersText}>Reset Filters</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={filteredMenuItems}
                  renderItem={renderMenuItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.listContent}
                />
              )}
            </View>

            {/* Gallery Preview */}
            <GalleryPreview />

            {/* Recent Activity */}
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

      case 'gallery':
        return <GalleryScreen />;

      case 'menu': return <MenuManagementScreen />;
      case 'profile': return <ProfileScreen />;
      case 'settings': return <SettingsScreen />;
      default: return (
        <View style={styles.screenContainer}>
          <Text style={styles.screenTitle}>Dashboard</Text>
        </View>
      );
    }
  };

  const getScreenTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      gallery: 'Gallery',
      menu: 'Menu',
      profile: 'Profile',
      settings: 'Settings'
    };
    return titles[activeScreen as keyof typeof titles] || 'Dashboard';
  };

  const navItems = [
    { key: 'dashboard', icon: 'restaurant', label: 'Dashboard' },
    { key: 'gallery', icon: 'images', label: 'Gallery' },
    { key: 'menu', icon: 'book', label: 'Menu' },
    { key: 'profile', icon: 'person', label: 'Profile' },
    { key: 'settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <LinearGradient colors={['#ffffff', '#f0f4ff']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{getScreenTitle()}</Text>
        </View>

        {renderScreenContent()}

        <View style={styles.bottomNav}>
          {navItems.map((navItem) => (
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
        <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Menu Item</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Image Selection Section */}
                <Text style={styles.inputLabel}>Item Image (Optional)</Text>
                <View style={styles.imageSelectionContainer}>
                  {newItemImage ? (
                    <View style={styles.selectedImageContainer}>
                      <Image source={{ uri: newItemImage }} style={styles.selectedImage} />
                      <TouchableOpacity 
                        style={styles.changeImageButton} 
                        onPress={pickImage}
                      >
                        <Text style={styles.changeImageText}>Change Image</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                      <Ionicons name="camera-outline" size={32} color="#0557ef" />
                      <Text style={styles.addImageText}>Add Image from Gallery</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TextInput style={styles.input} placeholder="Item Name" value={newItemName} onChangeText={setNewItemName} />
                <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={newItemDesc} onChangeText={setNewItemDesc} multiline numberOfLines={3} />

                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categoryRow}>
                  {categories.map((category) => (
                    <Pressable
                      key={category}
                      onPress={() => setNewItemCategory(category)}
                      style={[styles.categoryOption, newItemCategory === category && styles.selectedCategory]}
                    >
                      <Text style={[styles.categoryOptionText, newItemCategory === category && styles.selectedCategoryText]}>
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <TextInput style={styles.input} placeholder="Price (R)" value={newItemPrice} onChangeText={setNewItemPrice} keyboardType="numeric" />
                <TextInput style={[styles.input, styles.textArea]} placeholder="Ingredients (use a comma as a separator)" value={newItemIngredients} onChangeText={setNewItemIngredients} multiline numberOfLines={2} />
                <TextInput style={styles.input} placeholder="Preparation Time (minutes)" value={newItemPrepTime} onChangeText={setNewItemPrepTime} keyboardType="numeric" />
                <TextInput style={styles.input} placeholder="Calories (optional)" value={newItemCalories} onChangeText={setNewItemCalories} keyboardType="numeric" />

                <Text style={styles.inputLabel}>Spice Level</Text>
                <View style={styles.spiceLevelContainer}>
                  {[0, 1, 2, 3].map(level => (
                    <Pressable
                      key={level}
                      onPress={() => setNewItemSpiceLevel(level as 0 | 1 | 2 | 3)}
                      style={[styles.spiceLevelOption, newItemSpiceLevel === level && styles.selectedSpiceLevel]}
                    >
                      <Text style={[styles.spiceLevelText, newItemSpiceLevel === level && styles.selectedSpiceLevelText]}>
                        {['None', 'Mild', 'Medium', 'Spicy'][level]}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={addMenuItem}>
                  <Text style={styles.saveButtonText}>Add to Menu</Text>
                </TouchableOpacity>
                {/*To get the button in view*/}
                <Text style={styles.space}></Text>
                <Text style={styles.space}></Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Filter Modal */}
        <Modal animationType="slide" transparent visible={showFilterModal} onRequestClose={() => setShowFilterModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Menu Items</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Category Filter */}
                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
                  <Pressable
                    style={[styles.filterOption, filterCategory === 'All' && styles.activeFilterOption]}
                    onPress={() => setFilterCategory('All')}
                  >
                    <Text style={[styles.filterOptionText, filterCategory === 'All' && styles.activeFilterOptionText]}>
                      All
                    </Text>
                  </Pressable>
                  {categories.map(category => (
                    <Pressable
                      key={category}
                      style={[styles.filterOption, filterCategory === category && styles.activeFilterOption]}
                      onPress={() => setFilterCategory(category)}
                    >
                      <Text style={[styles.filterOptionText, filterCategory === category && styles.activeFilterOptionText]}>
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                {/* Availability Filter */}
                <Text style={styles.inputLabel}>Availability</Text>
                <View style={styles.availabilityFilterRow}>
                  {(['All', 'Available', 'Unavailable'] as const).map(availability => (
                    <Pressable
                      key={availability}
                      style={[styles.filterOption, filterAvailability === availability && styles.activeFilterOption]}
                      onPress={() => setFilterAvailability(availability)}
                    >
                      <Text style={[styles.filterOptionText, filterAvailability === availability && styles.activeFilterOptionText]}>
                        {availability}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.filterActions}>
                  <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                    <Text style={styles.resetButtonText}>Reset Filters</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilterModal(false)}>
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView >
    </LinearGradient >
  );
};

// Updated StyleSheet with new styles for images
const styles = StyleSheet.create({
  // Layout
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollView: { flex: 1 },
  space: { height: 16 },

  // Headers
  pageHeader: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#222' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
  chefName: { fontSize: 18, fontWeight: '700', color: '#222' },
  roleLabel: { fontSize: 14, color: '#555' },

  // Search and Filter
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, margin: 16, marginBottom: 8 },
  searchInput: { flex: 1, marginLeft: 12, marginRight: 12, fontSize: 16, color: '#333' },
  activeFiltersContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f8f9fa', marginHorizontal: 16, borderRadius: 8, marginBottom: 8 },
  activeFiltersTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  activeFiltersRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  activeFilterTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0557ef', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 4 },
  activeFilterText: { color: '#fff', fontSize: 12, marginRight: 6 },
  clearAllButton: { marginLeft: 'auto' },
  clearAllText: { color: '#0557ef', fontSize: 14, fontWeight: '600' },
  filterButton: { flexDirection: 'row', alignItems: 'center' },
  filterText: { color: '#0557ef', fontSize: 14, fontWeight: '600', marginLeft: 4 },

  // Stats
  statsContainer: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#222', marginVertical: 4 },
  statLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
  additionalStatValue: { fontSize: 12, color: '#666', marginTop: 2 },

  // Actions
  actionsContainer: { padding: 16 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { backgroundColor: '#0557ef', padding: 16, borderRadius: 12, alignItems: 'center', width: '30%' },
  actionText: { color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 8, textAlign: 'center' },

  // Menu Items
  menuContainer: { padding: 16 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  filteredCount: { fontSize: 14, color: '#666' },
  listContent: { paddingBottom: 16 },
  menuCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  // Style for menu item images
  menuItemImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 4 },
  categoryBadge: { backgroundColor: '#e3f2fd', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#0557ef' },
  itemPrice: { fontSize: 18, fontWeight: '700', color: '#0557ef', marginLeft: 8 },
  itemDescription: { fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20 },
  itemDetails: { marginBottom: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailIcon: { marginLeft: 12 },
  detailText: { fontSize: 12, color: '#666', marginLeft: 4 },
  ingredients: { fontSize: 12, color: '#666', fontStyle: 'italic', marginBottom: 8 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: '#f0f4ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 6, marginBottom: 4 },
  tagText: { fontSize: 10, fontWeight: '600', color: '#0557ef' },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  availabilityContainer: { flexDirection: 'row', alignItems: 'center' },
  availabilityText: { fontSize: 14, fontWeight: '600', marginLeft: 8 },
  actionButtons: { flexDirection: 'row' },
  editButton: { backgroundColor: '#0557ef', padding: 8, borderRadius: 6, marginRight: 8 },
  deleteButton: { backgroundColor: '#f0101b', padding: 8, borderRadius: 6 },

  // Empty State
  emptyState: { alignItems: 'center', padding: 40, backgroundColor: '#fff', borderRadius: 12 },
  emptyStateText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16 },
  emptyStateSubtext: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  resetFiltersButton: { backgroundColor: '#0557ef', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 16 },
  resetFiltersText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  // Gallery
  galleryPreviewContainer: { padding: 16 },
  galleryPreviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAllButton: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { color: '#0557ef', fontSize: 14, fontWeight: '600', marginRight: 4 },
  galleryPreviewRow: { flexDirection: 'row' },
  galleryPreviewItem: { width: 200, backgroundColor: '#fff', borderRadius: 12, marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  galleryPreviewImage: { width: '100%', height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  galleryPreviewInfo: { padding: 12 },
  galleryPreviewTitle: { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 4 },
  galleryPreviewDescription: { fontSize: 12, color: '#666' },

  // Activity
  activityContainer: { padding: 16 },
  activityList: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  activityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  activityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  activityText: { flex: 1, fontSize: 14, color: '#333' },
  activityTime: { fontSize: 12, color: '#999' },

  // Screen Components
  screenContainer: { flex: 1, padding: 16 },
  screenTitle: { fontSize: 24, fontWeight: '700', color: '#222', marginBottom: 8 },
  screenSubtitle: { fontSize: 16, color: '#666', marginBottom: 24 },

  // Gallery Styles
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  galleryItem: { width: '48%', backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  galleryImage: { width: '100%', height: 150, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  galleryInfo: { padding: 12 },
  galleryTitle: { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 4 },
  galleryDescription: { fontSize: 12, color: '#666' },

  // Navigation
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingVertical: 8 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  activeNavItem: { },
  navText: { fontSize: 12, color: '#666', marginTop: 4 },
  activeNavText: { color: '#0557ef', fontWeight: '600' },

  // Modal
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#222' },
  modalBody: { padding: 20 },

  // Form Elements
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  inputLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  
  // Image Selection Styles
  imageSelectionContainer: { marginBottom: 16 },
  addImageButton: { borderWidth: 2, borderColor: '#0557ef', borderStyle: 'dashed', borderRadius: 8, padding: 20, alignItems: 'center', justifyContent: 'center' },
  addImageText: { color: '#0557ef', fontSize: 14, fontWeight: '600', marginTop: 8 },
  selectedImageContainer: { alignItems: 'center' },
  selectedImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 },
  changeImageButton: { backgroundColor: '#0557ef', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  changeImageText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  // Category Selection
  categoryRow: { flexDirection: 'row', marginBottom: 16 },
  categoryOption: { flex: 1, padding: 12, marginRight: 8, borderRadius: 8, backgroundColor: '#f8f9fa', alignItems: 'center' },
  selectedCategory: { backgroundColor: '#0557ef' },
  categoryOptionText: { fontSize: 14, fontWeight: '600', color: '#666' },
  selectedCategoryText: { color: '#fff' },

  // Spice Level
  spiceLevelContainer: { flexDirection: 'row', marginBottom: 16 },
  spiceLevelOption: { flex: 1, padding: 12, marginRight: 8, borderRadius: 8, backgroundColor: '#f8f9fa', alignItems: 'center' },
  selectedSpiceLevel: { backgroundColor: '#0557ef' },
  spiceLevelText: { fontSize: 14, fontWeight: '600', color: '#666' },
  selectedSpiceLevelText: { color: '#fff' },

  // Filter Options
  filterOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f8f9fa', marginRight: 8, marginBottom: 8 },
  activeFilterOption: { backgroundColor: '#0557ef' },
  filterOptionText: { fontSize: 14, fontWeight: '600', color: '#666' },
  activeFilterOptionText: { color: '#fff' },
  availabilityFilterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },

  // Buttons
  saveButton: { backgroundColor: '#0557ef', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  guestButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0557ef', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  guestButtonText: { color: '#fff', fontSize: 14, fontWeight: '600', marginLeft: 6 },

  // Filter Actions
  filterActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  resetButton: { flex: 1, padding: 16, borderRadius: 8, backgroundColor: '#f8f9fa', alignItems: 'center', marginRight: 8 },
  resetButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
  applyButton: { flex: 1, padding: 16, borderRadius: 8, backgroundColor: '#0557ef', alignItems: 'center' },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default HomeScreenA;