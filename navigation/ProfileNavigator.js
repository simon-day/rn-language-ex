import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import LanguageSelectionScreen, {
  screenOptions as languageselectionScreenOptions,
} from '../screens/LanguageSelectionScreen';
import GenderSelectionScreen, {
  screenOptions as genderSelectionScreenOptions,
} from '../screens/GenderSelectionScreen';

const ProfileStackNavigator = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <ProfileStackNavigator.Navigator mode="modal">
      <ProfileStackNavigator.Screen name="Profile" component={ProfileScreen} />
      <ProfileStackNavigator.Screen
        mode="modal"
        name="LanguageSelect"
        component={LanguageSelectionScreen}
        options={languageselectionScreenOptions}
      />
      <ProfileStackNavigator.Screen
        name="GenderSelect"
        component={GenderSelectionScreen}
        options={genderSelectionScreenOptions}
      />
    </ProfileStackNavigator.Navigator>
  );
};

export default ProfileNavigator;
