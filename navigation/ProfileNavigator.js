import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import LanguageSelectionScreen, {
  screenOptions as languageselectionScreenOptions,
} from '../screens/LanguageSelectionScreen';

const ProfileStackNavigator = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <ProfileStackNavigator.Navigator>
      <ProfileStackNavigator.Screen name="Profile" component={ProfileScreen} />
      <ProfileStackNavigator.Screen
        name="LanguageSelect"
        component={LanguageSelectionScreen}
        options={languageselectionScreenOptions}
      />
    </ProfileStackNavigator.Navigator>
  );
};

export default ProfileNavigator;
