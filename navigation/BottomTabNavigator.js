import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ProfileNavigator from './ProfileNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import MessageScreen from '../screens/MessageScreen';
import FindFriendsScreen from '../screens/FindFriendsScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconStyle;

          if (route.name === 'Home') {
            iconName = 'ios-home';
          } else if (route.name === 'Profile') {
            iconName = 'ios-person';
            size = 30;
          } else if (route.name === 'FindFriends') {
            iconName = 'ios-contacts';
            size = 52;
            color = '#E9446A';
            iconStyle = {
              shadowColor: '#E9446A',
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 10,
              shadowOpacity: 0.3,
            };
          } else if (route.name === 'Messages') {
            iconName = 'ios-chatboxes';
            size = 30;
          } else if (route.name === 'Notifications') {
            iconName = 'ios-notifications';
          }

          // You can return any component that you like here!
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
              style={iconStyle}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
        showLabel: false,
        style: {
          borderTopWidth: 1,
          borderWidthColor: 'black',
          paddingTop: 2,
        },
      }}
    >
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileNavigator} />
      <Tab.Screen name="FindFriends" component={FindFriendsScreen} />
      <Tab.Screen name="Messages" component={MessageScreen} />
      {/* <Tab.Screen name="Notifications" component={NotificationScreen} /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
