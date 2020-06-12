import React, { useState, useRef } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import {
  View,
  ScrollView,
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
import { TextInputMask } from 'react-native-masked-text';

const RegisterScreen = (props) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const dateValidator = (text) => {
    let inputArr = text.split('');

    // if (inputArr.length === 0) {
    //   setDateOfBirth('');
    // }

    if (inputArr.length > 0 && !inputArr[0].match(/[0-3]/)) {
      return;
    }

    if (
      inputArr.length > 1 &&
      inputArr[0].match(/3/) &&
      inputArr[1].match(/[2-9]/)
    ) {
      return;
    }

    if (inputArr.length > 3 && !inputArr[3].match(/[0-1]/)) {
      return;
    }

    if (inputArr.length > 4 && !inputArr[4].match(/[0-9]/)) {
      return;
    }

    if (inputArr.length > 6 && !inputArr[6].match(/[1-2]/)) {
      return;
    }

    if (inputArr.length > 7 && !inputArr[7].match(/[0]|[9]/)) {
      return;
    }

    if (text.length === 10) {
      // console.log(text);
      let dateFormat = 'DD/MM/YYYY';

      let correctFormatDate = moment(text.toString(), dateFormat);

      console.log(new Date(correctFormatDate).getTime());

      if (!moment(correctFormatDate).isValid()) {
        console.log('HERE');
        setErrorMessage('Invalid date');
        setDateOfBirth('');

        return;
      }
    }

    setDateOfBirth(text);
    // setErrorMessage(null);
  };

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

    if (dateOfBirth.length !== 10) {
      setErrorMessage('Enter your birthday');
      return;
    }

    if (dateOfBirth.length === 10) {
      let dateFormat = 'DD/MM/YYYY';
      let correctFormatDate = moment(dateOfBirth.toString(), dateFormat);

      let years = moment().diff(correctFormatDate, 'years', false);
      if (years < 16) {
        setErrorMessage('You must be 16 years and above to use this app');
        return;
      }
    }

    try {
      let dateFormat = 'DD/MM/YYYY';
      let formattedDate = moment(dateOfBirth.toString(), dateFormat);
      const DOB = new Date(formattedDate).getTime();
      console.log(DOB);
      dispatch(authActions.signUp(name, email, password, DOB));
    } catch (error) {
      setErrorMessage('An account with this email already exists');
    }

    // props.navigation.navigate('Setup', { name, email, password });

    // try {
    //
    // } catch (error) {
    //   setErrorMessage(error.message);
    // }
  };
  // if (dateOfBirth.length === 10) {
  //   console.log('JERE');
  //   console.log(dateOfBirth);
  //   console.log(moment(moment(dateOfBirth)).isValid());
  // }

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
          bottom: -50,
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
          top: 120,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Text
          style={styles.greeting}
        >{`Sign up to start connecting with \nlanguage exchange partners near you.`}</Text>
      </View>

      <View style={styles.errorMessage}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            autoCapitalize="words"
            style={styles.input}
            onChangeText={(text) => setName(text)}
            value={name}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={{ marginTop: 32 }}>
          <Text style={styles.inputTitle}>Email Address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
            value={email}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={{ marginTop: 32 }}>
          <Text style={styles.inputTitle}>Birthday</Text>
          <TextInputMask
            style={styles.input}
            placeholder="DD/MM/YYYY"
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY',
            }}
            value={dateOfBirth}
            onChangeText={(text) => {
              dateValidator(text);
            }}
            returnKeyType="done"
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
      </ScrollView>

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
    // flex: 1,
    height: '100%',
    backgroundColor: 'white',
  },
  greeting: {
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
  errorMessage: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 36,
    marginTop: -60,
  },
  error: {
    color: '#E9446A',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    // paddingTop: 70,
  },
  form: {
    justifyContent: 'center',
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
    marginBottom: 80,
    marginHorizontal: 30,
    backgroundColor: '#E9446A',
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RegisterScreen;
