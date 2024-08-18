import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './HomePage';
import RedemptionPage from './RedemptionPage';
import CollectionPage from './CollectionPage';
import Icon from 'react-native-vector-icons/FontAwesome'

const Tab = createBottomTabNavigator();

function BottomTabNavigator({ route }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff' }, // Customize tab bar style
        tabBarActiveTintColor: '#007bff', // Active tab color
        tabBarInactiveTintColor: '#888', // Inactive tab color
      }}
    >
      <Tab.Screen 
        name="Store" 
        component={HomePage} 
        initialParams={{ walletAddress: route.params.walletAddress }} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} /> // Home icon
          ),
          tabBarLabel: 'Store' // Renamed to Store
        }}
      />
      <Tab.Screen 
        name="Redeem" 
        component={RedemptionPage} 
        initialParams={{ walletAddress: route.params.walletAddress }} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="gift" color={color} size={size} /> // Gift icon for redeem
          ),
          tabBarLabel: 'Redeem'
        }}
      />
      <Tab.Screen 
        name="Collection" 
        component={CollectionPage} 
        initialParams={{ walletAddress: route.params.walletAddress }} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="archive" color={color} size={size} /> // Archive icon for collection
          ),
          tabBarLabel: 'Collection'
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;