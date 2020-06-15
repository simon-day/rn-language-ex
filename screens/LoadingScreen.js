import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';
import * as userActions from '../store/actions/user';
import * as firebase from 'firebase';
import { db } from '../Fire';

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const { uid, displayName } = user;

      dispatch(authActions.profileExists(true, uid, displayName));
    } else {
      dispatch(authActions.profileExists(false));
      dispatch(authActions.setDidTryAL());
    }
  });

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StartupScreen;
