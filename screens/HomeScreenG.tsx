// HomeScreenG.tsx : Guest view 
// Imports
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Category = "Starter" | "Main" | "Dessert" ;

// Menu management state
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
}

const categories: Category[] = ["Starter", "Main", "Dessert", ];

const mockMenu: MenuItem[] = [
  //Sample data
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
];

// HomeScreenG components
const HomeScreenG: React.FC = () => {
  const [menuItems] = useState(mockMenu);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterAvailability, setFilterAvailability] = useState<'All' | 'Available' | 'Unavailable'>('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /* Filter and Search Functionality */
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      const matchesAvailability = filterAvailability === 'All' ||
        (filterAvailability === 'Available' && item.available) ||
        (filterAvailability === 'Unavailable' && !item.available);
      const matchesSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesAvailability && matchesSearch;
    });
  }, [menuItems, filterCategory, filterAvailability, searchQuery]);

  const resetFilters = () => {
    setFilterCategory('All');
    setFilterAvailability('All');
    setSearchQuery('');
    setShowFilterModal(false);
  };

  const addToCart = (itemId: string) => setCartItems(prev => [...prev, itemId]);
  const removeFromCart = (itemId: string) => setCartItems(prev => prev.filter(id => id !== itemId));
  const isInCart = (itemId: string) => cartItems.includes(itemId);

  /* Statistics */
  const stats = useMemo(() => {
    const total = menuItems.length;
    const availableItems = menuItems.filter(item => item.available).length;
    const totalValue = menuItems.reduce((sum, item) => sum + item.price, 0);
    const avgPrice = total > 0 ? totalValue / total : 0;

    const prices = menuItems.map(item => item.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const grouped = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});

    const avgByCourse: Record<string, number> = {};
    for (const [course, items] of Object.entries(grouped)) {
      avgByCourse[course] = items.reduce((sum, i) => sum + i.price, 0) / items.length;
    }

    const mostPopularCourse = Object.keys(grouped).reduce((a, b) => grouped[a].length > grouped[b].length ? a : b, "Starter");
    const popularItems = [...menuItems].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    const mostPopular = popularItems.length > 0 ? popularItems[0] : null;

    return { total, availableItems, totalValue, avgPrice, minPrice, maxPrice, avgByCourse, mostPopularCourse, mostPopular };
  }, [menuItems]);

  /* Menu Item Renderer */
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
          <Text style={[styles.availabilityText, { color: item.available ? '#06D6A0' : '#f0101b' }]}>
            {item.available ? 'Available' : 'Unavailable'}
          </Text>
        </View>

        <View style={styles.guestActions}>
          {isInCart(item.id) ? (
            <TouchableOpacity style={styles.removeFromCartButton} onPress={() => removeFromCart(item.id)}>
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

  const getScreenTitle = () => {
    const titles = { dashboard: 'Menu Explorer', menu: 'Full Menu', profile: 'My Profile', settings: 'Settings' };
    return titles[activeScreen as keyof typeof titles] || 'Menu Explorer';
  };

  const navItems = [
    { key: 'dashboard', icon: 'restaurant', label: 'Explore' },
    { key: 'menu', icon: 'book', label: 'Menu' },
    { key: 'profile', icon: 'person', label: 'Profile' },
    { key: 'settings', icon: 'settings', label: 'Settings' },
  ];

  /* Screen Content Renderer */
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

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search menu items..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {/* Active Filters */}
            {(filterCategory !== 'All' || filterAvailability !== 'All') && (
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
                  <Text style={styles.additionalStatValue}>R{stats.minPrice} - R{stats.maxPrice}</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setShowFilterModal(true)}>
                  <Ionicons name="filter" size={28} color="#fff" />
                  <Text style={styles.actionText}>Filter Items</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="star-outline" size={28} color="#fff" />
                  <Text style={styles.actionText}>Favorites</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="time-outline" size={28} color="#fff" />
                  <Text style={styles.actionText}>Order History</Text>
                </TouchableOpacity>
              </View>
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
                  <View style={styles.featuredDetails}>
                    <Text style={styles.featuredPrice}>R {stats.mostPopular.price.toFixed(2)}</Text>
                    <Text style={styles.featuredTime}>{stats.mostPopular.preparationTime} min</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Menu Items List */}
            <View style={styles.menuContainer}>
              <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>
                  Menu Items ({filteredMenuItems.length})
                  {menuItems.length !== filteredMenuItems.length && ` of ${menuItems.length}`}
                </Text>
                <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
                  <Ionicons name="filter" size={20} color="#0557ef" />
                  <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
              </View>

              {filteredMenuItems.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyStateText}>No menu items found</Text>
                  <Text style={styles.emptyStateSubtext}>Try adjusting your filters or search terms</Text>
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

            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <View style={styles.cartSummary}>
                <Text style={styles.cartSummaryTitle}>Your Cart</Text>
                <Text style={styles.cartSummaryText}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} selected</Text>
                <TouchableOpacity style={styles.viewCartButton}>
                  <Text style={styles.viewCartButtonText}>View Cart</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        );

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

      case 'settings':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Settings</Text>
            <Text style={styles.screenSubtitle}>Customize your experience</Text>
            <View style={styles.settingsContent}>
              {[
                { icon: 'moon-outline', text: 'Dark Mode', status: 'Off' },
                { icon: 'language-outline', text: 'Language', status: 'English' },
                { icon: 'volume-high-outline', text: 'Sound Effects', status: 'On' },
                { icon: 'help-circle-outline', text: 'Help & Support' },
                { icon: 'shield-checkmark-outline', text: 'Privacy Policy' },
                { icon: 'document-text-outline', text: 'Terms of Service' },
              ].map((item, index) => (
                <View key={index} style={styles.settingItem}>
                  <Ionicons name={item.icon as any} size={24} color="#0557ef" />
                  <Text style={styles.settingText}>{item.text}</Text>
                  {item.status ? <Text style={styles.settingStatus}>{item.status}</Text> : <Ionicons name="chevron-forward" size={20} color="#666" />}
                </View>
              ))}
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
                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
                  <Pressable
                    style={[styles.filterOption, filterCategory === 'All' && styles.activeFilterOption]}
                    onPress={() => setFilterCategory('All')}
                  >
                    <Text style={[styles.filterOptionText, filterCategory === 'All' && styles.activeFilterOptionText]}>All</Text>
                  </Pressable>
                  {categories.map(category => (
                    <Pressable
                      key={category}
                      style={[styles.filterOption, filterCategory === category && styles.activeFilterOption]}
                      onPress={() => setFilterCategory(category)}
                    >
                      <Text style={[styles.filterOptionText, filterCategory === category && styles.activeFilterOptionText]}>{category}</Text>
                    </Pressable>
                  ))}
                </ScrollView>

                <Text style={styles.inputLabel}>Availability</Text>
                <View style={styles.availabilityFilterRow}>
                  {(['All', 'Available', 'Unavailable'] as const).map(availability => (
                    <Pressable
                      key={availability}
                      style={[styles.filterOption, filterAvailability === availability && styles.activeFilterOption]}
                      onPress={() => setFilterAvailability(availability)}
                    >
                      <Text style={[styles.filterOptionText, filterAvailability === availability && styles.activeFilterOptionText]}>{availability}</Text>
                    </Pressable>
                  ))}
                </View>

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
      </SafeAreaView>
    </LinearGradient>
  );
};

// Optimized StyleSheet
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
  cartContainer: { position: 'relative' },
  cartBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#f0101b', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  // Search and Filter
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, margin: 16, marginBottom: 8 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#333' },
  activeFiltersContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f8f9fa', marginHorizontal: 16, borderRadius: 8, marginBottom: 8 },
  activeFiltersTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  activeFiltersRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  activeFilterTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0557ef', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 4 },
  activeFilterText: { color: '#fff', fontSize: 12, fontWeight: '500', marginRight: 6 },
  clearAllButton: { backgroundColor: '#f8f9fa', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#0557ef' },
  clearAllText: { color: '#0557ef', fontSize: 12, fontWeight: '500' },

  // Buttons
  actionButton: { flex: 1, alignItems: 'center', backgroundColor: '#0557ef', padding: 16, borderRadius: 12, marginHorizontal: 4 },
  actionText: { color: '#fff', marginTop: 8, fontWeight: '600', fontSize: 12, textAlign: 'center' },

  // Stats
  statsContainer: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 3
  },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#333', marginTop: 8, marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#666', textAlign: 'center' },
  additionalStatValue: { fontSize: 13, fontWeight: '700', color: '#090909', marginBottom: 8 },

  // Containers
  actionsContainer: { padding: 16 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  menuContainer: { padding: 16 },

  // Lists
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  listContent: { paddingBottom: 16 },
  filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f4ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  filterText: { color: '#0557ef', marginLeft: 4, fontWeight: '600', fontSize: 14 },

  // Empty State
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: '#f8f9fa', borderRadius: 12 },
  emptyStateText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16, marginBottom: 8 },
  emptyStateSubtext: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 20 },
  resetFiltersButton: { backgroundColor: '#0557ef', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  resetFiltersText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  // Menu Cards
  menuCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 3
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 6 },
  categoryBadge: { backgroundColor: '#0557ef', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  categoryText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  itemPrice: { fontSize: 20, fontWeight: '700', color: '#0557ef' },
  itemDescription: { fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20 },

  // Item Details
  itemDetails: { marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailIcon: { marginLeft: 12 },
  detailText: { fontSize: 12, color: '#666', marginLeft: 4 },
  ingredients: { fontSize: 12, color: '#888', fontStyle: 'italic', marginBottom: 8 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: '#E8F5E8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 6, marginBottom: 4 },
  tagText: { fontSize: 10, color: '#2E7D32', fontWeight: '500' },

  // Card Actions
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  availabilityContainer: { flexDirection: 'row', alignItems: 'center' },
  availabilityText: { fontSize: 14, fontWeight: '600', marginLeft: 8 },
  guestActions: { flexDirection: 'row', gap: 8 },
  addToCartButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#06D6A0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  removeFromCartButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0101b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  disabledButton: { backgroundColor: '#ccc' },
  cartButtonText: { color: '#fff', marginLeft: 6, fontWeight: '600', fontSize: 14 },

  // Featured Item
  featuredContainer: { padding: 16 },
  featuredCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 3
  },
  featuredHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  featuredName: { fontSize: 18, fontWeight: '700', color: '#222' },
  featuredBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  featuredBadgeText: { color: '#FFA000', fontSize: 12, fontWeight: '600', marginLeft: 4 },
  featuredDesc: { fontSize: 14, color: '#666', marginBottom: 8 },
  featuredDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredPrice: { fontSize: 16, fontWeight: '700', color: '#0557ef' },
  featuredTime: { fontSize: 14, color: '#666' },

  // Cart Summary
  cartSummary: {
    margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 3, alignItems: 'center'
  },
  cartSummaryTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 4 },
  cartSummaryText: { fontSize: 14, color: '#666', marginBottom: 12 },
  viewCartButton: { backgroundColor: '#0557ef', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  viewCartButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Screens
  screenContainer: { flex: 1, padding: 16 },
  screenTitle: { fontSize: 24, fontWeight: '700', color: '#222', marginBottom: 8 },
  screenSubtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  menuFullContainer: { flex: 1 },
  fullMenuList: { paddingBottom: 16 },

  // Navigation
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingVertical: 8 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  activeNavItem: {},
  navText: { fontSize: 12, color: '#666', marginTop: 4 },
  activeNavText: { color: '#0557ef', fontWeight: '600' },

  // Modal
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 16, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  modalBody: { padding: 20 },

  // Form
  inputLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },

  // Filter Options
  categoryRow: { flexGrow: 0, marginBottom: 16 },
  filterOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginRight: 8, backgroundColor: '#fff' },
  activeFilterOption: { backgroundColor: '#0557ef', borderColor: '#0557ef' },
  filterOptionText: { fontSize: 14, color: '#333', fontWeight: '500' },
  activeFilterOptionText: { color: '#fff' },
  availabilityFilterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  filterActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  resetButton: { flex: 1, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#0557ef', alignItems: 'center', marginRight: 8 },
  resetButtonText: { color: '#0557ef', fontSize: 16, fontWeight: '600' },
  applyButton: { flex: 1, backgroundColor: '#0557ef', padding: 16, borderRadius: 8, alignItems: 'center', marginLeft: 8 },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Profile
  profileContent: { flex: 1 },
  profileHeader: { alignItems: 'center', marginBottom: 32 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  profileName: { fontSize: 24, fontWeight: '700', color: '#222', marginBottom: 4 },
  profileEmail: { fontSize: 16, color: '#666' },
  profileSection: { marginBottom: 24 },
  preferenceItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 2
  },
  preferenceText: { flex: 1, fontSize: 16, color: '#333', marginLeft: 12 },
  preferenceStatus: { fontSize: 14, color: '#06D6A0', fontWeight: '600' },
  dietaryPreferences: { flexDirection: 'row', flexWrap: 'wrap' },
  dietaryText: { backgroundColor: '#E8F5E8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8, color: '#2E7D32', fontWeight: '500' },

  // Settings
  settingsContent: { flex: 1 },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 2
  },
  settingText: { flex: 1, fontSize: 16, color: '#333', marginLeft: 12 },
  settingStatus: { fontSize: 14, color: '#666', marginRight: 8 },
});

export default HomeScreenG;