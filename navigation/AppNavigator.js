import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import AuthNavigator from '../navigation/AuthNavigator';
import BottomTabNavigator from '../navigation/BottomTabNavigator';
import AccountSetUpScreen from '../screens/AccountSetUpScreen';
import ProfileScreen2 from '../screens/ProfileScreen2';

const AppNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const isNew = useSelector((state) => state.auth.newAccount);
  console.log('isNew: ', isNew);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  // {isNew && isAuth &&

  return (
    <NavigationContainer>
      {/* <ProfileScreen2 /> */}
      {isAuth && <BottomTabNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <LoadingScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
