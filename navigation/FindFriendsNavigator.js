import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FindFriendsScreen, {
  screenOptions as findFriendsScreenOptions,
} from '../screens/FindFriendsScreen';
import ViewProfileScreen, {
  screenOptions as viewProfileScreenOptions,
} from '../screens/ViewProfileScreen';
import PrivateChatScreen, {
  screenOptions as privateChatScreenOptions,
} from '../screens/PrivateChatScreen';

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
        options={viewProfileScreenOptions}
        // options={languageselectionScreenOptions}
      />
      <FindFriendsStackNavigator.Screen
        name="PrivateChat"
        component={PrivateChatScreen}
        options={privateChatScreenOptions}
        // options={viewProfileScreenOptions}
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
