import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FindFriendsScreen, {
  screenOptions as findFriendsScreenOptions,
} from '../screens/FindFriendsScreen';
import ViewProfileScreen from '../screens/ViewProfileScreen';

const FindFriendsStackNavigator = createStackNavigator();

const FindFriendsNavigator = () => {
  return (
    <FindFriendsStackNavigator.Navigator>
      <FindFriendsStackNavigator.Screen
        name="FindFriendsScreen"
        component={FindFriendsScreen}
        options={findFriendsScreenOptions}
      />
      <FindFriendsStackNavigator.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        // options={languageselectionScreenOptions}
      />
      {/* <FindFriendsStackNavigator.Screen
        name="GenderSelect"
        component={GenderSelectionScreen}
        options={genderSelectionScreenOptions}
      />
      <ProfileStackNavigator.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        // options={genderSelectionScreenOptions}
      /> */}
    </FindFriendsStackNavigator.Navigator>
  );
};

export default FindFriendsNavigator;
