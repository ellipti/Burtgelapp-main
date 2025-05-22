import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import AdminHomeScreen from './src/screens/AdminHomeScreen';
import NormalUserHomeScreen from './src/screens/NormalUserHomeScreen';
import AddPlayerScreen from './src/screens/AddPlayerScreen';
import AllPlayersScreen from './src/screens/AllPlayersScreen';
import FavoritePlayersScreen from './src/screens/FavoritePlayersScreen';
import { AuthProvider } from './src/contexts/AuthContext';
import { PlayerProvider } from './src/contexts/PlayerContext';
import RootNavigator from './src/navigation/RootNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <NavigationContainer>
        
          <RootNavigator />
          
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
            <Stack.Screen name="NormalUserHome" component={NormalUserHomeScreen} />
            <Stack.Screen name="AddPlayer" component={AddPlayerScreen} />
            <Stack.Screen name="AllPlayers" component={AllPlayersScreen} />
            <Stack.Screen name="Favorites" component={FavoritePlayersScreen} />
          
          
        </NavigationContainer>
      </PlayerProvider>
    </AuthProvider>
  );
}