import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import AuthNavigator from '../navigation/AuthNavigator';
import BottomTabNavigator from '../navigation/BottomTabNavigator';
import AccountSetUpScreen from '../screens/AccountSetUpScreen';

const AppNavigator = (props) => {
  const profileExists = useSelector((state) => !!state.auth.profileExists);
  console.log('profile exists: ', profileExists);
  const isAuth = useSelector((state) => !!state.auth.token);
  const isNew = useSelector((state) => state.auth.newAccount);
  console.log('isNew: ', isNew);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);
  console.log('didTryAutoLogin: ', didTryAutoLogin);

  return (
    <NavigationContainer>
      {profileExists && <BottomTabNavigator />}
      {didTryAutoLogin && !profileExists && <AuthNavigator />}
      {!profileExists && !didTryAutoLogin && <LoadingScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
