import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as firebase from 'firebase';
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
  KeyboardAvoidingView,
} from 'react-native';
import { SocialIcon, Button } from 'react-native-elements';
import * as authActions from '../store/actions/auth';
import * as userActions from '../store/actions/user';
import * as Google from 'expo-google-app-auth';
import { validateEmail } from '../utilities/validation';
import DividerWithMiddleText from '../components/DividerWithMiddleText';
import env from '../env';

const LoginScreen = (props) => {
  const dispatch = useDispatch();
  const emailField = useRef();
  const passwordField = useRef();

  const [showEmailPasswordLogin, setShowEmailPasswordLogin] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const authError = useSelector((state) => state.auth.authError);

  useEffect(() => {
    setErrorMessage(authError);
  }, [authError]);

  useEffect(() => {
    if (showEmailPasswordLogin) {
      emailField.current.focus();
    }
  }, [showEmailPasswordLogin]);

  const authHandler = async () => {
    setErrorMessage(null);

    if (!validateEmail(email)) {
      setErrorMessage('Invalid email');
      return;
    }

    if (password.length <= 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    try {
      // await dispatch(authActions.login(email, password));
      dispatch(authActions.signIn(email, password));
    } catch (error) {
      console.log('here');
      setErrorMessage(error.message);
    }
  };

  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const onSignIn = (googleUser) => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((res) => {
            console.log('RESSSSSSSSS: ', res);
            const photoUrl = res.user.photoURL;
            const largerPhoto = photoUrl.replace('s96-c', 's400-c');
            console.log(res.additionalUserInfo.profile.given_name);
            const givenName = res.additionalUserInfo.profile.given_name;

            const userId = res.user.uid;

            if (res.additionalUserInfo.isNewUser) {
              console.log('WEEEEEEEEE');
              dispatch(userActions.setUserName(userId, givenName));
              dispatch(userActions.addProfilePhoto(userId, largerPhoto));
              dispatch(userActions.setSharedPhoto(userId, largerPhoto));

              // props.navigation.navigate('AskForAge');
            }

            console.log('user signed in');
          })
          .catch((error) => {
            // Handle Errors here.
            console.log(error);
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  };

  const signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: env.androidClientId,
        iosClientId: env.iosClientId,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
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
          marginTop: -245,
          alignSelf: 'center',
          transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
        }}
      />
      {showGreeting && (
        <Text style={styles.greeting}>{`Hello again.\nWelcome back.`}</Text>
      )}
      <View style={styles.errorMessage}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </View>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-65}>
        <SocialIcon
          style={{
            width: '86%',
            alignSelf: 'center',
            fontWeight: '500',
          }}
          title="Sign In With Google"
          Component={TouchableOpacity}
          type="google"
          button
          onPress={signInWithGoogleAsync}
        />
        <View style={{ marginVertical: 5 }}>
          <DividerWithMiddleText text="OR" />
        </View>
        <SocialIcon
          style={{
            width: '86%',
            alignSelf: 'center',
            fontWeight: '500',
          }}
          title="Sign In With Facebook"
          Component={TouchableOpacity}
          type="facebook"
          button
          onPress={() => console.log('TODO')}
        />
        <View style={{ marginTop: 5, marginBottom: 15 }}>
          <DividerWithMiddleText text="OR" />
        </View>

        {showEmailPasswordLogin && (
          <View style={styles.form}>
            <View>
              <Text style={styles.inputTitle}>Email Address</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
                value={email}
                ref={emailField}
                onSubmitEditing={() => passwordField.current.focus()}
                onFocus={() => setShowGreeting(false)}
                onBlur={() => setShowGreeting(true)}
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
                ref={passwordField}
                onFocus={() => setShowGreeting(false)}
                onBlur={() => setShowGreeting(true)}
              />
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={
            !showEmailPasswordLogin
              ? () => setShowEmailPasswordLogin(true)
              : authHandler
          }
        >
          <Text style={{ color: '#FFF', fontWeight: '500' }}>
            {showEmailPasswordLogin
              ? 'Sign In'
              : 'Sign in with email and password'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignSelf: 'center', marginTop: 32 }}
          onPress={() => props.navigation.navigate('Register')}
        >
          <Text
            style={{
              color: '#414959',
              fontSize: 13,
              paddingHorizontal: 50,
              textAlign: 'center',
            }}
          >
            Don't have a social account?{' '}
            <Text style={{ fontWeight: '500', color: '#E9446A' }}>
              Sign up with email instead
            </Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  greeting: {
    // marginTop: 10,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  errorMessage: {
    height: 52,
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
    marginBottom: 32,
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
    // marginTop: -20,
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
