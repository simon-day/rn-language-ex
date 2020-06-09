import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen, {
  screenOptions as loginScreenOptions,
} from '../screens/LoginScreen';
import RegisterScreen, {
  screenOptions as registerScreenOptions,
} from '../screens/RegisterScreen';
import AccountSetUpScreen from '../screens/AccountSetUpScreen';

const AuthStackNavigator = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator>
      <AuthStackNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={loginScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="Register"
        component={RegisterScreen}
        options={registerScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="Setup"
        component={AccountSetUpScreen}
        // options={registerScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthNavigator;
