import React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';
import * as userActions from '../store/actions/user';
import * as firebase from 'firebase';
import LoadingDataWithLogo from '../components/LoadingDataWithLogo';
import * as Permissions from 'expo-permissions';

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);

    if (result.status !== 'granted') {
      return false;
    }
    return true;
  };

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const { uid } = user;

      const hasPermissions = await verifyPermissions();

      if (hasPermissions) {
        dispatch(userActions.setLocation(uid, null));
      }

      dispatch(authActions.profileExists(true, uid));
      dispatch(userActions.fetchProfileData(uid));
    } else {
      dispatch(authActions.profileExists(false));
      dispatch(authActions.setDidTryAL());
    }
  });

  return <LoadingDataWithLogo />;
};

export default StartupScreen;
