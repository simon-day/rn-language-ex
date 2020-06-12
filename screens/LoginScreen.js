import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  LayoutAnimation,
} from 'react-native';
import * as authActions from '../store/actions/auth';

const LoginScreen = (props) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const authHandler = async () => {
    setErrorMessage(null);
    try {
      // await dispatch(authActions.login(email, password));
      dispatch(authActions.signIn(email, password));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  LayoutAnimation.easeInEaseOut();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={require('../assets/authHeader.jpg')}
        style={{
          width: '100%',
          height: '35%',
          marginTop: -60,
          transform: [{ rotate: '-15deg' }, { scaleX: 1.1 }],
          opacity: 0.85,
        }}
      />

      <Image
        source={require('../assets/authHeader.jpg')}
        style={{
          position: 'absolute',
          bottom: -70,
          left: 0,
          width: '100%',
          height: '35%',
          transform: [{ rotate: '195deg' }, { scaleX: 1.1 }],
          opacity: 0.7,
        }}
      />

      <Image
        source={require('../assets/logo.png')}
        style={{
          marginTop: -200,
          alignSelf: 'center',
          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        }}
      />

      <Text style={styles.greeting}>{`Hello again.\nWelcome back.`}</Text>
      <View style={styles.errorMessage}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.inputTitle}>Email Address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
        <View style={{ marginTop: 32 }}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={authHandler}>
        <Text style={{ color: '#FFF', fontWeight: '500' }}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignSelf: 'center', marginTop: 32 }}
        onPress={() => props.navigation.navigate('Register')}
      >
        <Text style={{ color: '#414959', fontSize: 13 }}>
          New to Exchange?{' '}
          <Text style={{ fontWeight: '500', color: '#E9446A' }}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  greeting: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 36,
  },
  error: {
    color: '#E9446A',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: '#8A8F9E',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  input: {
    borderBottomColor: '#8A8F9E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: '#161F3D',
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: '#E9446A',
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const screenOptions = {
  headerShown: false,
};

export default LoginScreen;
