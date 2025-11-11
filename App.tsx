// Imports 
// App.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import SplashScreen from './screens/SplashScreen';
import HomeScreenG from './screens/HomeScreenG';
import HomeScreenA from './screens/HomeScreenA';

// Import interfaces
type Category = "Starter" | "Main" | "Dessert";

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
  image?: any;
}

export type RootStackParamList = {
  Splash: undefined;
  HomeG: undefined;
  HomeA: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Initial menu data - shared across all screens
const initialMenuItems: MenuItem[] = [
  {
    id: '1', name: 'Tomato Soup', description: 'Rich and creamy tomato soup with fresh herbs', price: 55, category: 'Starter', available: true, popularity: 4.5,
    ingredients: ['tomatoes', 'cream', 'fresh basil', 'garlic', 'olive oil'], dietaryTags: ['Vegetarian', 'Gluten-Free'], preparationTime: 15, calories: 120, spiceLevel: 0,
    image: require('./assets/menu/tomato soup.jpg')
  },
  {
    id: '2', name: 'Grilled Chicken', description: 'Perfectly grilled chicken served with garlic butter sauce', price: 120, category: 'Main', available: true, popularity: 4.8,
    ingredients: ['chicken breast', 'garlic', 'butter', 'herbs', 'lemon'], dietaryTags: [], preparationTime: 25, calories: 320, spiceLevel: 1,
    image: require('./assets/menu/grilled chicken.jpg')
  },
  {
    id: '3', name: 'Chocolate Mousse', description: 'Smooth and rich chocolate dessert', price: 65, category: 'Dessert', available: false, popularity: 4.7,
    ingredients: ['dark chocolate', 'cream', 'eggs', 'sugar'], dietaryTags: ['Vegetarian'], preparationTime: 10, calories: 280, spiceLevel: 0,
    image: require('./assets/menu/chocolate mousse.jpg')
  },
  {
    id: '4', name: 'Caesar Salad', description: 'Crisp romaine with creamy dressing', price: 70, category: 'Starter', available: true, popularity: 4.3,
    ingredients: ['lettuce', 'croutons', 'parmesan', 'dressing'], dietaryTags: ['Vegetarian'], preparationTime: 10, calories: 150, spiceLevel: 0,
    image: require('./assets/menu/caesar salad.jpg')
  },
  {
    id: '5', name: 'Seafood Platter', description: 'Selection of fresh oysters, prawns and crab', price: 180, category: 'Main', available: true, popularity: 4.6,
    ingredients: ['oysters', 'prawns', 'crab'], dietaryTags: [], preparationTime: 30, calories: 400, spiceLevel: 2,
    image: require('./assets/menu/seafood platter.jpg')
  },
];

export default function App() {
  // Shared menu state managed at the app level
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="HomeG">
          {props => <HomeScreenG {...props} menuItems={menuItems} />}
        </Stack.Screen>
        <Stack.Screen name="HomeA">
          {props => <HomeScreenA {...props} menuItems={menuItems} setMenuItems={setMenuItems} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}