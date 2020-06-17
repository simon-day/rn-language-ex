import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import LoadingScreen from '../screens/LoadingScreen';
import AuthNavigator from '../navigation/AuthNavigator';
import BottomTabNavigator from '../navigation/BottomTabNavigator';
import AskForAgeScreen from '../screens/AskForAgeScreen';

const AppNavigator = (props) => {
  const profileExists = useSelector((state) => !!state.auth.profileExists);
  const hasAge = useSelector((state) => !!state.user.dateOfBirth);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {profileExists && hasAge && <BottomTabNavigator />}
      {!hasAge && profileExists && <AskForAgeScreen />}
      {didTryAutoLogin && !profileExists && <AuthNavigator />}
      {!profileExists && !didTryAutoLogin && <LoadingScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
