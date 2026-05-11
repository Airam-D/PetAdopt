import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, Text } from 'react-native';
import { RootStackParamList, TabParamList } from './types/navigation';

import Detalhes from './screens/Detalhes';
import Home from './screens/Home';
import Login from './screens/Login';
import Ongs from './screens/Ongs';
import Perfil from './screens/Perfi';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator({ route }: any) {
  const usuario = route?.params?.usuario || 'Visitante';
  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: false, 
      tabBarShowLabel: true,
      tabBarActiveTintColor: '#D8916F',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: { 
        height: Platform.OS === 'ios' ? 100 : 80,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
      }
    }}>
      <Tab.Screen name="Explorar" component={Home as any} initialParams={{ usuario }} options={{ 
        tabBarLabel: 'Explorar',
        tabBarIcon: ({ focused, color }) => (
          <Text style={{ fontSize: 24 }}>🔍</Text>
        )
      }} />
      <Tab.Screen name="ONGs" component={Ongs} initialParams={{ usuario }} options={{ 
        tabBarLabel: 'ONGs',
        tabBarIcon: ({ focused, color }) => (
          <Text style={{ fontSize: 24 }}>🤝</Text>
        )
      }} />
      <Tab.Screen name="Perfil" component={Perfil} initialParams={{ usuario }} options={{ 
        tabBarLabel: 'Perfil',
        tabBarIcon: ({ focused, color }) => (
          <Text style={{ fontSize: 24 }}>👤</Text>
        )
      }} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="PetDetalhes" component={Detalhes} options={{ headerShown: true, headerTitle: '', headerStyle: { backgroundColor: '#FDF6EE' }, headerShadowVisible: false }} />
    </Stack.Navigator>
  );
}