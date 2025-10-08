// Imports 
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import SplashScreen from './screens/SplashScreen';
import HomeScreenG from './screens/HomeScreenG';
import HomeScreenA from './screens/HomeScreenA';

export type RootStackParamList = {
  Splash: undefined;
  HomeG: undefined;
  HomeA: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="HomeG" component={HomeScreenG} />
        <Stack.Screen name="HomeA" component={HomeScreenA} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
