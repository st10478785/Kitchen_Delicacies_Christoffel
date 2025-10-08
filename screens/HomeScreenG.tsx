// HomeScreenG.tsx : Guest view 
// Imports
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Menu Data to match HomeScreenA structure
type Category = "Starter" | "Main" | "Dessert" | "Drink";
type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  available: boolean;
  popularity?: number;
  ingredients?: string[];
  dietaryTags?: string[];
};

// Using the same menu items as HomeScreenA for consistency
const mockMenu: MenuItem[] = [
  // Expanded menu 
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
  // Compresed version of menu
  { id: '3', name: 'Chocolate Mousse', description: 'Smooth chocolate dessert', price: 65, category: 'Dessert', available: false, popularity: 4.7, ingredients: ['chocolate', 'cream', 'eggs'], dietaryTags: ['Vegetarian'] },
    { id: '4', name: 'Caesar Salad', description: 'Crisp romaine with creamy dressing', price: 70, category: 'Starter', available: true, popularity: 4.3, ingredients: ['lettuce', 'croutons', 'parmesan', 'dressing'], dietaryTags: ['Vegetarian'] },
    { id: '5', name: 'Seafood Platter', description: 'Selection of fresh oysters, prawns and crab', price: 180, category: 'Main', available: true, popularity: 4.6, ingredients: ['oysters', 'prawns', 'crab'], dietaryTags: [] },
];

const categories: Category[] = ["Starter", "Main", "Dessert", "Drink"];

const HomeScreenG: React.FC = () => {
  const [menuItems] = useState(mockMenu);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [activeScreen, setActiveScreen] = useState('dashboard');

  // Filter menu items by category
  const filteredMenuItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return menuItems;
    }
    return menuItems.filter(item => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  // Add item to cart
  const addToCart = (itemId: string) => {
    setCartItems(prev => [...prev, itemId]);
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(id => id !== itemId));
  };

  // Check if item is in cart
  const isInCart = (itemId: string) => cartItems.includes(itemId);

  // Statistics 
  const stats = useMemo(() => {
    const total = menuItems.length;
    const availableItems = menuItems.filter(item => item.available).length;
    const totalValue = menuItems.reduce((sum, item) => sum + item.price, 0);
    const avgPrice = total > 0 ? totalValue / total : 0;

    // Calculate price range
    const prices = menuItems.map(item => item.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Calculate average price by course
    const avgByCourse: Record<string, number> = {};
    categories.forEach(category => {
      const categoryItems = menuItems.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        avgByCourse[category] = categoryItems.reduce((sum, item) => sum + item.price, 0) / categoryItems.length;
      }
    });

    // Find most popular course
    const courseCounts: Record<string, number> = {};
    menuItems.forEach(item => {
      courseCounts[item.category] = (courseCounts[item.category] || 0) + 1;
    });
    const mostPopularCourse = Object.keys(courseCounts).reduce((a, b) => 
      courseCounts[a] > courseCounts[b] ? a : b, categories[0]
    );

    // Most popular item (based on popularity rating)
    const popularItems = [...menuItems].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    const mostPopular = popularItems.length > 0 ? popularItems[0] : null;

    return {
      total,
      availableItems,
      totalValue,
      avgPrice,
      minPrice,
      maxPrice,
      avgByCourse,
      mostPopularCourse,
      mostPopular
    };
  }, [menuItems]);

  // Render of each menu card 
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

      {item.dietaryTags && item.dietaryTags.length > 0 && (
        <View style={styles.dietaryTags}>
          {item.dietaryTags.map(tag => (
            <View key={tag} style={styles.dietaryTag}>
              <Text style={styles.dietaryTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {item.popularity && (
        <View style={styles.popularity}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.popularityText}>{item.popularity}</Text>
        </View>
      )}

      <View style={styles.menuCardFooter}>
        <View style={styles.availabilityContainer}>
          <Text style={[styles.availability, { color: item.available ? 'green' : 'red' }]}>
            {item.available ? 'Available' : 'Unavailable'}
          </Text>
        </View>

        <View style={styles.guestActions}>
          {isInCart(item.id) ? (
            <TouchableOpacity
              style={styles.removeFromCartButton}
              onPress={() => removeFromCart(item.id)}
            >
              <Ionicons name="remove-circle" size={20} color="#fff" />
              <Text style={styles.cartButtonText}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.addToCartButton, !item.available && styles.disabledButton]}
              onPress={() => addToCart(item.id)}
              disabled={!item.available}
            >
              <Ionicons name="cart-outline" size={20} color="#fff" />
              <Text style={styles.cartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  // Helper function to get screen title based on active screen
  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'dashboard': return 'Menu Explorer';
      case 'menu': return 'Full Menu';
      case 'profile': return 'My Profile';
      case 'settings': return 'Settings';
      default: return 'Menu Explorer';
    }
  };

  // Render Screen Content
  const renderScreenContent = () => {
    switch (activeScreen) {
      case 'dashboard':
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image source={require('../assets/Logo(2).jpeg')} style={styles.logo} />
                <View>
                  <Text style={styles.chefName}>Chef Christoffel</Text>
                  <Text style={styles.roleLabel}>Guest View - Menu Explorer</Text>
                </View>
              </View>
              <View style={styles.cartContainer}>
                <Ionicons name="cart-outline" size={28} color="#333" />
                {cartItems.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                  </View>
                )}
              </View>
            </View>

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
                  <Ionicons name="trending-up-outline" size={24} color="#FF9E0A" />
                  <Text style={styles.statLabel}>Avg Prices by Course</Text>
                  <View style={styles.coursePrices}>
                    {Object.entries(stats.avgByCourse).map(([course, price]) => (
                      <Text key={course} style={styles.additionalStatValue}>
                        {course}: R {price.toFixed(2)}
                      </Text>
                    ))}
                  </View>
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
                    R{stats.minPrice} - R{stats.maxPrice}
                  </Text>
                </View>
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.filterContainer}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                <Pressable
                  onPress={() => setSelectedCategory('All')}
                  style={[
                    styles.categoryFilterButton,
                    selectedCategory === 'All' && styles.selectedCategoryFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryFilterText,
                      selectedCategory === 'All' && styles.selectedCategoryFilterText,
                    ]}
                  >
                    All
                  </Text>
                </Pressable>
                {categories.map((category) => (
                  <Pressable
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={[
                      styles.categoryFilterButton,
                      selectedCategory === category && styles.selectedCategoryFilter,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryFilterText,
                        selectedCategory === category && styles.selectedCategoryFilterText,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Most Popular Item */}
            {stats.mostPopular && (
              <View style={styles.featuredContainer}>
                <Text style={styles.sectionTitle}>Most Popular</Text>
                <View style={styles.featuredCard}>
                  <View style={styles.featuredHeader}>
                    <Text style={styles.featuredName}>{stats.mostPopular.name}</Text>
                    <View style={styles.featuredBadge}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.featuredBadgeText}>{stats.mostPopular.popularity}</Text>
                    </View>
                  </View>
                  <Text style={styles.featuredDesc}>{stats.mostPopular.description}</Text>
                  <Text style={styles.featuredPrice}>R {stats.mostPopular.price.toFixed(2)}</Text>
                </View>
              </View>
            )}

            {/* Menu Items List */}
            <View style={styles.menuContainer}>
              <View style={styles.menuHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'All' ? 'All Menu Items' : selectedCategory}
                  ({filteredMenuItems.length})
                </Text>
              </View>

              <FlatList
                data={filteredMenuItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.menuList}
              />
            </View>

            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <View style={styles.cartSummary}>
                <Text style={styles.cartSummaryTitle}>Your Cart</Text>
                <Text style={styles.cartSummaryText}>
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} selected
                </Text>
                <TouchableOpacity style={styles.viewCartButton}>
                  <Text style={styles.viewCartButtonText}>View Cart</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        );

      // Menu Screen
      case 'menu':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Menu Items</Text>
            <Text style={styles.screenSubtitle}>Browse our complete menu</Text>
            
            <View style={styles.menuFullContainer}>
              <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.fullMenuList}
              />
            </View>
          </View>
        );

      // Profile Screen
      case 'profile':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Profile</Text>
            <Text style={styles.screenSubtitle}>Manage your guest preferences</Text>
            
            <View style={styles.profileContent}>
              <View style={styles.profileHeader}>
                <Image source={require('../assets/icon.png')} style={styles.profileImage} />
                <Text style={styles.profileName}>Guest User</Text>
                <Text style={styles.profileEmail}>guest@example.com</Text>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.preferenceItem}>
                  <Ionicons name="notifications-outline" size={24} color="#0557ef" />
                  <Text style={styles.preferenceText}>Push Notifications</Text>
                  <Text style={styles.preferenceStatus}>Enabled</Text>
                </View>
                <View style={styles.preferenceItem}>
                  <Ionicons name="mail-outline" size={24} color="#0557ef" />
                  <Text style={styles.preferenceText}>Email Updates</Text>
                  <Text style={styles.preferenceStatus}>Disabled</Text>
                </View>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Dietary Preferences</Text>
                <View style={styles.dietaryPreferences}>
                  <Text style={styles.dietaryText}>Vegetarian</Text>
                  <Text style={styles.dietaryText}>Dairy-Free</Text>
                </View>
              </View>
            </View>
          </View>
        );

      // Settings Screen
      case 'settings':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Settings</Text>
            <Text style={styles.screenSubtitle}>Customize your experience</Text>
            
            <View style={styles.settingsContent}>
              <View style={styles.settingItem}>
                <Ionicons name="moon-outline" size={24} color="#0557ef" />
                <Text style={styles.settingText}>Dark Mode</Text>
                <Text style={styles.settingStatus}>Off</Text>
              </View>
              
              <View style={styles.settingItem}>
                <Ionicons name="language-outline" size={24} color="#0557ef" />
                <Text style={styles.settingText}>Language</Text>
                <Text style={styles.settingStatus}>English</Text>
              </View>
              
              <View style={styles.settingItem}>
                <Ionicons name="volume-high-outline" size={24} color="#0557ef" />
                <Text style={styles.settingText}>Sound Effects</Text>
                <Text style={styles.settingStatus}>On</Text>
              </View>
              
              <View style={styles.settingItem}>
                <Ionicons name="help-circle-outline" size={24} color="#0557ef" />
                <Text style={styles.settingText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
              
              <View style={styles.settingItem}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#0557ef" />
                <Text style={styles.settingText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
              
              <View style={styles.settingItem}>
                <Ionicons name="document-text-outline" size={24} color="#0557ef" />
                <Text style={styles.settingText}>Terms of Service</Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Menu Explorer</Text>
          </View>
        );
    }
  };

  // Main return
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
            { key: 'dashboard', icon: 'restaurant', label: 'Explore' },
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
      </SafeAreaView>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
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
  // Header styles
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
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#f0101b',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
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
    marginBottom: 4,
  },
  additionalStatValue: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
    marginBottom: 2,
  },
  coursePrices: {
    marginTop: 8,
    alignItems: 'center',
  },
  filterContainer: {
    padding: 16,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  selectedCategoryFilter: {
    backgroundColor: '#0557ef',
    borderColor: '#0557ef',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryFilterText: {
    color: '#fff',
  },
  featuredContainer: {
    padding: 16,
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  featuredBadgeText: {
    color: '#FFA000',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  featuredDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0557ef',
  },
  menuContainer: {
    padding: 16,
  },
  menuFullContainer: {
    flex: 1,
  },
  fullMenuList: {
    paddingBottom: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 8,
  },
  dietaryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dietaryTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  dietaryTagText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '500',
  },
  popularity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  popularityText: {
    fontSize: 14,
    color: '#FFA000',
    fontWeight: '600',
    marginLeft: 4,
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
  guestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#06D6A0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeFromCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0101b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cartButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  cartSummary: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  cartSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cartSummaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  viewCartButton: {
    backgroundColor: '#0557ef',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Profile Styles
  profileContent: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  profileSection: {
    marginBottom: 24,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  preferenceText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  preferenceStatus: {
    fontSize: 14,
    color: '#06D6A0',
    fontWeight: '600',
  },
  dietaryPreferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dietaryText: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    color: '#2E7D32',
    fontWeight: '500',
  },
  // Settings Styles
  settingsContent: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  settingStatus: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
});

export default HomeScreenG;