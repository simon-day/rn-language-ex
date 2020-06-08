import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as authActions from '../store/actions/auth';
import UserPermissions from '../utilities/UserPermissions';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Fire from '../Fire';

const RegisterScreen = (props) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const authHandler = async () => {
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert(
        'Oopsie',
        'Make sure to fill in all your information and add a photo to create an account',
        [{ text: 'OK' }]
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match, please try again'),
        setPassword('');
      setConfirmPassword('');
      return;
    }

    if (password.length <= 5) {
      setErrorMessage('Password must be at least 6 characters long'),
        setPassword('');
      setConfirmPassword('');
      return;
    }

    try {
      const response = await dispatch(
        authActions.signup(name, email, password)
      );
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

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
          opacity: 0.55,
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

      <TouchableOpacity
        style={styles.back}
        onPress={() => props.navigation.goBack()}
      >
        <Ionicons name="ios-arrow-round-back" size={36} color="white" />
      </TouchableOpacity>

      <View
        style={{
          position: 'absolute',
          top: 180,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Text
          style={styles.greeting}
        >{`Sign up to start connecting with \nlanguage exchange partners near you.`}</Text>
        {/* <TouchableOpacity
          style={styles.avatarPlaceholder}
          onPress={pickAvatarHandler}
        >
          {avatar && <Image style={styles.avatar} source={{ uri: avatar }} />}
          {!avatar && (
            <Ionicons
              name="ios-add"
              size={40}
              color="#8f8f8f"
              style={{ marginTop: 6, marginLeft: 1 }}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.photoText}>Add profile photo</Text> */}
      </View>

      <View style={styles.errorMessage}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            autoCapitalize="words"
            style={styles.input}
            onChangeText={(text) => setName(text)}
            value={name}
          />
        </View>
        <View style={{ marginTop: 32 }}>
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
        <View style={{ marginTop: 32 }}>
          <Text style={styles.inputTitle}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={authHandler}>
        <Text style={{ color: '#FFF', fontWeight: '500' }}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ alignSelf: 'center', marginTop: 32 }}
        onPress={() => props.navigation.navigate('Login')}
      >
        <Text style={{ color: '#414959', fontSize: 13 }}>
          Already have an account?{' '}
          <Text style={{ fontWeight: '500', color: '#E9446A' }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export const screenOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  photoText: {
    marginTop: 5,
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '200',
  },
  greeting: {
    // marginTop: 32,
    color: '#2e2e2e',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  back: {
    position: 'absolute',
    top: 40,
    left: 32,
    width: 36,
    height: 36,
    borderRadius: 16,
    backgroundColor: '#E1E2E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#E1E2E6',
    borderRadius: 50,
    marginTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
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
    // paddingTop: 70,
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

export default RegisterScreen;
